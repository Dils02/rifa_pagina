import { useState } from 'react'
import { alternarNumero } from '../utils/rifa.js'

export default function useSeleccionNumeros(maximo, precio) {
    const [seleccion, setSeleccion] = useState([])

    function alternar(numero) {
        setSeleccion((actual) =>
            alternarNumero(actual, numero, maximo),
        )
    }

    function limpiar() {
        setSeleccion([])
    }

    return {
        seleccion,
        alternar,
        limpiar,
        total: seleccion.length * precio,
    }
}