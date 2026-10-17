import Icono from './Icono.jsx'

export default function Encabezado() {
    return (
        <header className="encabezado">
            <div className="contenedor encabezado__interior">
                <a
                    className="marca"
                    href="#inicio"
                    aria-label="Gran rifa dulce, inicio"
                >
                    <span className="marca__icono">
                        <Icono nombre="entrada" />
                    </span>

                    <span>
                        dulce<span className="marca__punto">.</span>
                        <small>UNA RIFA CON CARIÑO</small>
                    </span>
                </a>

                <nav
                    className="navegacion"
                    aria-label="Navegación principal"
                >
                    <a href="#premios">Los premios</a>
                    <a href="#numeros">Los números</a>
                    <a href="#como-participar">Cómo participar</a>
                </nav>

                <a
                    href="#numeros"
                    className="boton boton--pequeno boton--rosa"
                >
                    Quiero participar
                    <Icono nombre="corazon" />
                </a>
            </div>
        </header>
    )
}