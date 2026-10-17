import afiche from '../assets/afiche-rifa.jpeg'
import { premios } from '../data/rifa.js'
import Icono from './Icono.jsx'

export default function Premios() {
    return (
        <section
            className="seccion contenedor"
            id="premios"
            aria-labelledby="titulo-premios"
        >
            <div className="titulo-seccion">
                <span className="sobretitulo">
                    <Icono nombre="regalo" />
                    HECHOS PARA DISFRUTAR
                </span>

                <h2 id="titulo-premios">
                    Premios que dan <span>alegría.</span>
                </h2>

                <p>
                    Algo rico para compartir, un detalle especial y unas
                    cuantas sorpresas.
                </p>
            </div>

            <div className="premios">
                {premios.map((premio) => (
                    <article className="premio" key={premio.numero}>
                        <div className="premio__imagen">
                            <svg
                                viewBox={premio.encuadre}
                                preserveAspectRatio="xMidYMid slice"
                                role="img"
                                aria-label={premio.nombre}
                            >
                                <image
                                    href={afiche}
                                    width="1090"
                                    height="1375"
                                />
                            </svg>

                            <span className="premio__numero">
                                <span className="sr-only">Premio </span>
                                {String(premio.numero).padStart(2, '0')}
                            </span>

                            {premio.numero > 4 && (
                                <span className="premio__sorpresa">
                                    <Icono nombre="estrella" />
                                    Sorpresa
                                </span>
                            )}
                        </div>

                        <div className="premio__texto">
                            <h3>{premio.nombre}</h3>
                            <p>{premio.detalle}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}