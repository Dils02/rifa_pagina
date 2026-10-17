// Calcula los grados finales de la ruleta para que el segmento ganador
// quede justo bajo la flecha (arriba, a las 12).
export function rotacionGanadora(
    indiceGanador,
    totalSegmentos,
    rotacionActual = 0,
    vueltas = 6,
) {
    if (!totalSegmentos || indiceGanador < 0) return rotacionActual

    const angulo = 360 / totalSegmentos
    const centro = indiceGanador * angulo + angulo / 2

    // Cuánto falta girar para que el centro del segmento quede arriba
    const objetivo = (((-centro - rotacionActual) % 360) + 360) % 360

    return rotacionActual + vueltas * 360 + objetivo
}