import afiche from '../assets/afiche-rifa.jpeg'
import { rifa } from '../data/rifa.js'
import { formatoMoneda } from '../utils/rifa.js'
import Icono from './Icono.jsx'

export default function Portada() {
    const datos = [
        {
            icono: 'entrada',
            titulo: 'Valor por número',
            valor: formatoMoneda(rifa.precioNumero),
            detalle: 'Un pequeño aporte',
        },
        {
            icono: 'regalo',
            titulo: 'Números de la rifa',
            valor: String(rifa.totalNumeros),
            detalle: 'Elige tus favoritos',
        },
        {
            icono: 'calendario',
            titulo: 'Fecha del sorteo',
            valor: rifa.fechaSorteo,
            detalle: '¡Anótalo en tu calendario!',
        },
    ]

    return (
        <>
            <section
                className="portada contenedor"
                aria-labelledby="titulo-principal"
            >
                <div className="portada__texto">
                    <span className="etiqueta">
                        <Icono nombre="corazon" />
                        TU APOYO TAMBIÉN ENDULZA MIS SUEÑOS
                    </span>

                    <h1 id="titulo-principal">
                        ¡Gran rifa <span>dulce!</span>
                    </h1>

                    <p className="portada__lema">{rifa.lema}</p>

                    <p className="portada__descripcion">
                        Ayúdame a seguir estudiando y participa por premios
                        preparados para compartir. Cada numerito es un gesto
                        de cariño que me acerca a mi sueño.
                    </p>

                    <div className="portada__acciones">
                        <a href="#numeros" className="boton boton--rosa">
                            Elegir mis números
                            <Icono nombre="flecha" />
                        </a>

                        <a href="#premios" className="enlace-suave">
                            Conocer los premios
                            <span aria-hidden="true">↗</span>
                        </a>
                    </div>

                    <div className="portada__nota">
                        <span className="corazon-sello" aria-hidden="true">
                            ♡
                        </span>

                        <span>
                            Un poquito de ti.
                            <br />
                            <strong>Un gran paso para mí.</strong>
                        </span>
                    </div>
                </div>

                <div className="portada__visual">
                    <span
                        className="decoracion decoracion--uno"
                        aria-hidden="true"
                    >
                        ♡
                    </span>

                    <span
                        className="decoracion decoracion--dos"
                        aria-hidden="true"
                    >
                        ✧
                    </span>

                    <a
                        className="afiche"
                        href={afiche}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Abrir afiche original de la Gran rifa dulce en otra pestaña"
                    >
                        <img
                            src={afiche}
                            width="1090"
                            height="1375"
                            alt="Afiche de la Gran rifa dulce con sus ocho premios, valor de mil pesos por número y sorteo el 25 de octubre."
                            fetchPriority="high"
                        />

                        <span className="afiche__pie">
                            Un sueño que compartimos
                            <Icono nombre="corazon" />
                        </span>
                    </a>

                    <div className="sello-premios">
                        <Icono nombre="regalo" />

                        <span>
                            <strong>8 premios</strong>
                            <small>y mucho cariño</small>
                        </span>
                    </div>
                </div>
            </section>

            <div
                className="contenedor datos-rifa"
                aria-label="Información de la rifa"
            >
                {datos.map((dato) => (
                    <article className="dato" key={dato.titulo}>
                        <span className="dato__icono">
                            <Icono nombre={dato.icono} />
                        </span>

                        <div>
                            <h2>{dato.titulo}</h2>
                            <strong>{dato.valor}</strong>
                            <p>{dato.detalle}</p>
                        </div>
                    </article>
                ))}
            </div>
        </>
    )
}