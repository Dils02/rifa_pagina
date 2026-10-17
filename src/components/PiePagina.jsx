import { rifa } from '../data/rifa.js'
import Icono from './Icono.jsx'

export default function PiePagina() {
    return (
        <footer className="pie">
            <div className="contenedor agradecimiento">
                <span
                    className="agradecimiento__corazon"
                    aria-hidden="true"
                >
                    ♡
                </span>

                <h2>
                    Gracias por endulzar <span>este sueño.</span>
                </h2>

                <p>
                    Cada número es una oportunidad de ganar y también
                    de ayudarme a seguir estudiando.
                </p>

                <div className="contactos">
                    <a
                        href={`https://wa.me/${rifa.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Icono nombre="telefono" />
                        {rifa.telefonoVisible}
                    </a>

                    <a
                        href={`https://www.instagram.com/${rifa.instagram}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Icono nombre="instagram" />
                        @{rifa.instagram}
                    </a>
                </div>
            </div>

            <div className="contenedor pie__abajo">
                <span>
                    Gran rifa dulce <span aria-hidden="true">♡</span>
                </span>

                <span>Hecha con cariño, para compartir.</span>
            </div>
        </footer>
    )
}