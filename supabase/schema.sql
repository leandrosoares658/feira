-- =========================================================
-- Marketplace — estrutura do banco
-- Cole no Supabase: SQL Editor → New query → Run.
-- Pode rodar de novo sem problema (apaga e recria tudo).
-- =========================================================

drop function if exists public.place_order(jsonb);
drop table if exists public.order_items, public.orders, public.products, public.sellers, public.categories, public.stores cascade;

-- ---------- Catálogo ----------

create table public.stores (
  id   text primary key,
  name text not null
);

create table public.categories (
  store_id text not null references public.stores on delete cascade,
  id       text not null,
  slug     text not null,
  name     text not null,
  blurb    text not null default '',
  tone     text not null default '#dddddd',
  position int  not null default 0,
  primary key (store_id, id)
);

create table public.sellers (
  store_id text not null references public.stores on delete cascade,
  id       text not null,
  slug     text not null,
  name     text not null,
  city     text not null default '',
  since    int  not null,
  rating   numeric(2,1) not null default 5,
  sales    int  not null default 0,
  blurb    text not null default '',
  tone     text not null default '#dddddd',
  position int  not null default 0,
  primary key (store_id, id)
);

create table public.products (
  store_id      text not null references public.stores on delete cascade,
  id            text not null,
  slug          text not null,
  name          text not null,
  category_id   text not null,
  seller_id     text not null,
  price         numeric(10,2) not null check (price >= 0),
  compare_at    numeric(10,2),
  rating        numeric(2,1) not null default 5,
  reviews       int  not null default 0,
  stock         int  not null default 0 check (stock >= 0),
  free_shipping boolean not null default false,
  badge         text,
  description   text not null default '',
  highlights    text[],
  specs         jsonb,
  options       jsonb,   -- [{ "name": "Cor", "values": [{ "label": "Preto", "swatch": "#111" }] }]
  images        text[],
  tone          text not null default '#dddddd',
  tags          text[],
  position      int  not null default 0,
  primary key (store_id, id),
  foreign key (store_id, category_id) references public.categories (store_id, id),
  foreign key (store_id, seller_id)   references public.sellers (store_id, id)
);

-- ---------- Pedidos ----------

create table public.orders (
  id              uuid primary key default gen_random_uuid(),
  number          bigint generated always as identity (start with 100001) unique,
  store_id        text not null references public.stores,
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text,
  address         jsonb not null,
  shipping_method text not null,
  payment_method  text not null check (payment_method in ('pix', 'cartao', 'boleto')),
  installments    int  not null default 1,
  subtotal        numeric(10,2) not null,
  shipping        numeric(10,2) not null,
  discount        numeric(10,2) not null,
  total           numeric(10,2) not null,
  created_at      timestamptz not null default now()
);

create table public.order_items (
  order_id   uuid not null references public.orders on delete cascade,
  product_id text not null,
  seller_id  text not null,
  name       text not null,
  unit_price numeric(10,2) not null,
  qty        int  not null check (qty > 0),
  choices    jsonb not null default '{}'
);

-- ---------- Segurança (RLS) ----------
-- Catálogo: qualquer visitante pode LER. Ninguém de fora escreve.
-- Pedidos: ninguém lê nem escreve direto; só pela função place_order.

alter table public.stores      enable row level security;
alter table public.categories  enable row level security;
alter table public.sellers     enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Projetos novos do Supabase não liberam tabelas para a API por padrão.
grant select on public.stores, public.categories, public.sellers, public.products to anon, authenticated;

create policy "catálogo público" on public.stores     for select to anon, authenticated using (true);
create policy "catálogo público" on public.categories for select to anon, authenticated using (true);
create policy "catálogo público" on public.sellers    for select to anon, authenticated using (true);
create policy "catálogo público" on public.products   for select to anon, authenticated using (true);

-- ---------- Criar pedido ----------
-- Recebe o carrinho, busca os preços NO BANCO (o navegador não decide preço),
-- confere estoque, calcula frete/desconto e devolve o número do pedido.
-- Não guarda dados de cartão: só a forma de pagamento.

create function public.place_order(payload jsonb)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_store      text := payload->>'store_id';
  v_order      uuid;
  v_number     bigint;
  v_subtotal   numeric(10,2) := 0;
  v_shipping   numeric(10,2) := coalesce((payload->>'shipping_price')::numeric, 0);
  v_free_over  numeric(10,2) := coalesce((payload->>'free_over')::numeric, 0);
  v_pix        numeric       := least(greatest(coalesce((payload->>'pix_discount')::numeric, 0), 0), 0.2);
  v_discount   numeric(10,2) := 0;
  v_item       jsonb;
  v_product    public.products;
  v_qty        int;
begin
  if jsonb_array_length(coalesce(payload->'items', '[]')) = 0 then
    raise exception 'Carrinho vazio';
  end if;
  if coalesce(payload->'customer'->>'email', '') !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'E-mail inválido';
  end if;

  insert into public.orders (store_id, customer_name, customer_email, customer_phone, address,
                             shipping_method, payment_method, installments, subtotal, shipping, discount, total)
  values (v_store,
          left(payload->'customer'->>'name', 120),
          left(payload->'customer'->>'email', 160),
          left(payload->'customer'->>'phone', 30),
          coalesce(payload->'address', '{}'),
          left(payload->>'shipping_method', 40),
          payload->>'payment_method',
          greatest(1, least(12, coalesce((payload->>'installments')::int, 1))),
          0, 0, 0, 0)
  returning id, number into v_order, v_number;

  for v_item in select * from jsonb_array_elements(payload->'items') loop
    select * into v_product from public.products
     where store_id = v_store and id = v_item->>'product_id';
    if not found then
      raise exception 'Produto % não existe', v_item->>'product_id';
    end if;
    v_qty := (v_item->>'qty')::int;
    if v_qty < 1 or v_qty > v_product.stock then
      raise exception 'Estoque insuficiente para %', v_product.name;
    end if;
    insert into public.order_items (order_id, product_id, seller_id, name, unit_price, qty, choices)
    values (v_order, v_product.id, v_product.seller_id, v_product.name, v_product.price, v_qty,
            coalesce(v_item->'choices', '{}'));
    v_subtotal := v_subtotal + v_product.price * v_qty;
  end loop;

  if v_free_over > 0 and v_subtotal >= v_free_over then
    v_shipping := 0;
  end if;
  if payload->>'payment_method' = 'pix' then
    v_discount := round(v_subtotal * v_pix, 2);
  end if;

  update public.orders
     set subtotal = v_subtotal, shipping = v_shipping, discount = v_discount,
         total = v_subtotal + v_shipping - v_discount
   where id = v_order;

  return v_number;
end;
$$;

revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to anon, authenticated;
