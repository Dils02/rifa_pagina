import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

const CADA_MS = 30000

// Lee desde Supabase qué números ya no están disponibles y en qué fase
// va la rifa. Si algo falla, la página sigue funcionando como siempre.
export default function useEstadoNumeros() {
    const [estados, setEstados] = useState({})
    const [fase, setFase] = useState(null)

    const cargar = useCallback(async () => {
        if (!supabase) return

        try {
            const [rNumeros, rControl] = await Promise.all([
                supabase.from('rifa_numeros').select('numero, estado'),
                supabase.from('rifa_control').select('fase').maybeSingle(),
            ])

            if (rNumeros.error || rControl.error) return

            const mapa = {}
            for (const fila of rNumeros.data ?? []) {
                if (fila.estado !== 'disponible') {
                    mapa[fila.numero] = fila.estado
                }
            }

            setEstados(mapa)
            setFase(rControl.data?.fase ?? null)
        } catch {
            // Sin conexión: se mantiene lo último que se vio.
        }
    }, [])

    useEffect(() => {
        cargar()

        const cadaTanto = setInterval(cargar, CADA_MS)

        const alVolver = () => {
            if (document.visibilityState === 'visible') cargar()
        }
        document.addEventListener('visibilitychange', alVolver)

        return () => {
            clearInterval(cadaTanto)
            document.removeEventListener('visibilitychange', alVolver)
        }
    }, [cargar])

    return { estados, fase }
}