import RuletaSorteo from './RuletaSorteo.jsx'

export default function Ruleta({
    numeros = [],
    rotacion = 0,
    girando = false,
    duracion = 6500,
    alTerminar,
    numeroGanador = null,
    nombreGanador = '',
}) {
    function manejarFinGiro(evento) {
        // Solo reaccionamos al final del giro del disco.
        // Las animaciones de luces y confeti no finalizan el sorteo.
        if (
            !girando ||
            evento.propertyName !== 'transform' ||
            !evento.target.classList.contains('pa-rul__disco')
        ) {
            return
        }

        alTerminar?.()
    }

    return (
        <div onTransitionEnd={manejarFinGiro}>
            <RuletaSorteo
                numeros={numeros}
                rotacion={rotacion}
                girando={girando}
                duracion={duracion / 1000}
                numeroGanador={numeroGanador}
                nombreGanador={nombreGanador}
            />
        </div>
    )
}