const moneda = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
})

export function formatoMoneda(valor) {
    return moneda.format(valor)
}

export function formatoNumero(numero) {
    return String(numero).padStart(2, '0')
}

export function alternarNumero(seleccion, numero, maximo) {
    if (!Number.isInteger(numero) || numero < 1 || numero > maximo) {
        return seleccion
    }

    return seleccion.includes(numero)
        ? seleccion.filter((actual) => actual !== numero)
        : [...seleccion, numero].sort((a, b) => a - b)
}

export function crearEnlaceWhatsApp(configuracion, seleccion) {
    if (seleccion.length === 0) return null

    const numeros = [...seleccion]
        .sort((a, b) => a - b)
        .map(formatoNumero)
        .join(', ')

    const cantidad = seleccion.length
    const total = formatoMoneda(
        cantidad * configuracion.precioNumero,
    )

    const mensaje = [
        `¡Hola! Quiero consultar disponibilidad para la ${configuracion.titulo}.`,
        `Mis números elegidos: ${numeros}.`,
        `${cantidad} ${cantidad === 1 ? 'número' : 'números'
        } · Total: ${total}.`,
        '¿Siguen disponibles? Me gustaría coordinar el pago. ¡Gracias! 💗',
    ].join('\n')

    return `https://wa.me/${configuracion.whatsapp
        }?text=${encodeURIComponent(mensaje)}`
}