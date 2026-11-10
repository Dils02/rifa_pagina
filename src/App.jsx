import { lazy, Suspense, useEffect, useState } from 'react'
import Inicio from './pages/Inicio.jsx'
import './App.css'

// El panel se carga solo cuando alguien entra a /#/admin,
// así la página pública no descarga su código.
const Admin = lazy(() => import('./pages/Admin.jsx'))

function enRutaAdmin() {
  return window.location.hash.startsWith('#/admin')
}

export default function App() {
  const [admin, setAdmin] = useState(enRutaAdmin)

  useEffect(() => {
    const alCambiar = () => setAdmin(enRutaAdmin())
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])

  if (admin) {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    )
  }

  return <Inicio />
}