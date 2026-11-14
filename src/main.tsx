import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fontes de todos os presets. O navegador só baixa as que a loja ativa usa.
import '@fontsource-variable/inter-tight'
import '@fontsource-variable/fraunces'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/dm-sans'
import { applyTheme } from './config'
import { hydrateCatalog } from './lib/catalog'
import App from './App'
import './styles/global.css'

applyTheme()
// Catálogo do Supabase quando disponível; senão, os dados locais do preset.
const source = await hydrateCatalog()
document.documentElement.dataset.catalog = source

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
