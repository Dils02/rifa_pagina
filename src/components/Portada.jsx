import { rifa } from '../data/rifa.js'
import { formatoMoneda } from '../utils/rifa.js'
import Icono from './Icono.jsx'
import '../styles/portada-centrada.css'

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
                className="portada portada--centrada contenedor"
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