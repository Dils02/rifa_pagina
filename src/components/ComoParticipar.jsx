import Icono from './Icono.jsx'

const pasos = [
    {
        numero: '01',
        icono: 'entrada',
        titulo: 'Elige con el corazón',
        texto:
            'Marca tus números favoritos en la cuadrícula. Puedes elegir más de uno.',
    },
    {
        numero: '02',
        icono: 'telefono',
        titulo: 'Conversemos por WhatsApp',
        texto:
            'Envía tu selección para confirmar disponibilidad y coordinar la transferencia.',
    },
    {
        numero: '03',
        icono: 'corazon',
        titulo: 'Confirma y cruza los dedos',
        texto:
            'La organizadora revisa el pago y confirma tus números. ¡Gracias por ser parte!',
    },
]

export default function ComoParticipar() {
    return (
        <section
            className="seccion contenedor"
            id="como-participar"
            aria-labelledby="titulo-pasos"
        >
            <div className="titulo-seccion">
                <span className="sobretitulo">
                    <Icono nombre="corazon" />
                    ASÍ DE FÁCIL
                </span>

                <h2 id="titulo-pasos">
                    Tres pasos, <span>mucho cariño.</span>
                </h2>

                <p>
                    Participar es sencillo. El apoyo que hay detrás
                    significa muchísimo.
                </p>
            </div>

            <div className="pasos">
                {pasos.map((paso) => (
                    <article className="paso" key={paso.numero}>
                        <div className="paso__arriba">
                            <span className="paso__icono">
                                <Icono nombre={paso.icono} />
                            </span>

                            <span
                                className="paso__numero"
                                aria-hidden="true"
                            >
                                {paso.numero}
                            </span>
                        </div>

                        <h3>{paso.titulo}</h3>
                        <p>{paso.texto}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}