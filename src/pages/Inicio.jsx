import Encabezado from '../components/Encabezado.jsx'
import Portada from '../components/Portada.jsx'
import Premios from '../components/Premios.jsx'
import SelectorNumeros from '../components/SelectorNumeros.jsx'
import ComoParticipar from '../components/ComoParticipar.jsx'
import PiePagina from '../components/PiePagina.jsx'

export default function Inicio() {
    return (
        <div className="sitio" id="inicio">
            <a
                className="saltar-contenido"
                href="#contenido"
            >
                Saltar al contenido
            </a>

            <Encabezado />

            <main id="contenido">
                <Portada />
                <Premios />
                <SelectorNumeros />
                <ComoParticipar />
            </main>

            <PiePagina />
        </div>
    )
}