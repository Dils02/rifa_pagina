import {
    useEffect,
    useRef,
    useState,
} from 'react'

import { Link } from 'react-router-dom'

import {
    modoLocal,
    supabase,
} from '../lib/supabaseClient.js'

import { premios } from '../data/rifa.js'

import useAdmin from '../hooks/useAdmin.js'
import useRifa from '../hooks/useRifa.js'

import { rotacionGanadora } from '../utils/ruleta.js'
import Ruleta from '../components/Ruleta.jsx'

const clave = modoLocal
    ? 'rifa-local-solicitud-pendiente'
    : 'rifa-solicitud-pendiente'

function leerPendiente() {
    try {
        const valor = JSON.parse(
            sessionStorage.getItem(clave),
        )

        const valido =
            valor &&
            Number.isInteger(valor.premio) &&
            valor.premio >= 1 &&
            valor.premio <= 8 &&
            /^[0-9a-f-]{36}$/i.test(valor.id)

        return valido ? valor : null
    } catch {
        return null
    }
}

function guardarPendiente(valor) {
    try {
        if (valor) {
            sessionStorage.setItem(
                clave,
                JSON.stringify(valor),
            )
        } else {
            sessionStorage.removeItem(clave)
        }
    } catch {
        // La solicitud también permanece en memoria.
    }
}

export default function Sorteo() {
    const { esAdmin } = useAdmin()
    const datos = useRifa()

    const [pendiente, setPendiente] =
        useState(leerPendiente)

    const [escena, setEscena] =
        useState(null)

    const [rotacion, setRotacion] =
        useState(0)

    const [girando, setGirando] =
        useState(false)

    const [pidiendo, setPidiendo] =
        useState(false)

    const [duracion, setDuracion] =
        useState(6500)

    const [error, setError] =
        useState('')

    const temporizador = useRef(null)
    const terminado = useRef(true)

    const ocupado = pidiendo || girando

    const ultimo =
        datos.ganadores.at(-1)

    const elegibles = datos.numeros
        .filter(
            (numero) =>
                numero.estado === 'pagado' &&
                !datos.ganadores.some(
                    (ganador) =>
                        ganador.numero === numero.numero,
                ),
        )
        .map((numero) => numero.numero)

    const numeros =
        escena?.candidatos || elegibles

    const siguiente =
        datos.ganadores.length + 1

    useEffect(() => {
        if (
            !ocupado &&
            ultimo &&
            ultimo.solicitud !== escena?.solicitud
        ) {
            setEscena(ultimo)

            setRotacion(
                rotacionGanadora(
                    0,
                    ultimo.candidatos,
                    ultimo.numero,
                ) % 360,
            )
        }
    }, [
        ultimo,
        ocupado,
        escena?.solicitud,
    ])

    useEffect(() => {
        return () => {
            clearTimeout(
                temporizador.current,
            )
        }
    }, [])

    function finalizar() {
        if (terminado.current) return

        terminado.current = true

        clearTimeout(
            temporizador.current,
        )

        setGirando(false)
        setPendiente(null)

        guardarPendiente(null)

        datos.recargar()
    }

    async function sortear() {
        if (ocupado || !esAdmin) return

        setPidiendo(true)
        setError('')

        try {
            const solicitud = pendiente || {
                premio: siguiente,
                id: crypto.randomUUID(),
            }

            setPendiente(solicitud)
            guardarPendiente(solicitud)

            const respuesta = await supabase.rpc(
                'sortear_premio_rifa',
                {
                    p_premio: solicitud.premio,
                    p_solicitud: solicitud.id,
                },
            )

            if (respuesta.error) {
                throw respuesta.error
            }

            const resultado = respuesta.data

            const destino = rotacionGanadora(
                rotacion,
                resultado.candidatos,
                resultado.numero,
            )

            const reducirMovimiento =
                window.matchMedia(
                    '(prefers-reduced-motion: reduce)',
                ).matches

            const tiempo =
                reducirMovimiento ? 0 : 6500

            setDuracion(tiempo)
            setEscena(resultado)
            setGirando(true)

            terminado.current = false

            requestAnimationFrame(() => {
                setRotacion(destino)
            })

            temporizador.current = setTimeout(
                finalizar,
                tiempo + 200,
            )
        } catch (fallo) {
            setError(
                fallo.message ||
                'No pudimos obtener el resultado. Reintenta para recuperar la misma solicitud.',
            )

            if (
                fallo.code === 'P0001' ||
                fallo.code === '42501'
            ) {
                setPendiente(null)
                guardarPendiente(null)
            }

            datos.recargar()
        } finally {
            setPidiendo(false)
        }
    }

    const permitido =
        esAdmin &&
        !ocupado &&
        !datos.error &&
        !datos.cargando &&
        (
            pendiente ||
            (
                datos.control?.fase === 'cerrada' &&
                siguiente <= 8 &&
                elegibles.length > 0
            )
        )

    const textoBoton = pidiendo
        ? 'Registrando resultado…'
        : girando
            ? 'Girando…'
            : pendiente
                ? 'Recuperar resultado pendiente'
                : siguiente > 8
                    ? 'Sorteo finalizado'
                    : `Sortear premio ${siguiente}`

    return (
        <main className="contenedor admin-pagina sorteo-pagina">
            <header className="admin-cabecera">
                <Link to="/">
                    ← Volver a la rifa
                </Link>

                <Link
                    className="admin-boton"
                    to="/admin"
                >
                    Administración
                </Link>
            </header>

            <div className="titulo-seccion">
                <span className="sobretitulo">
                    GRAN RIFA DULCE
                </span>

                <h1>
                    La ruleta de{' '}
                    <span>los sueños</span>
                </h1>

                <p>
                    Solo participan números pagados.
                    Cada número puede ganar una vez;
                    una persona puede ganar con
                    números distintos.
                </p>
            </div>

            {!supabase && (
                <p className="admin-aviso">
                    Los resultados se publicarán aquí
                    cuando la organizadora conecte
                    el sorteo.
                </p>
            )}

            {(error || datos.error) && (
                <p
                    className="admin-error"
                    role="alert"
                >
                    {error ||
                        'No pudimos cargar el sorteo. Inténtalo de nuevo.'}
                </p>
            )}

            {datos.cargando && (
                <p role="status">
                    Cargando participantes…
                </p>
            )}

            <div className="sorteo-layout">
                <section className="admin-caja">
                    <Ruleta
                        numeros={numeros}
                        rotacion={rotacion}
                        girando={girando}
                        duracion={duracion}
                        alTerminar={finalizar}
                    />

                    <div
                        className="sorteo-resultado"
                        role="status"
                        aria-live="polite"
                    >
                        {girando ? (
                            <h2>
                                ¡Que la suerte te acompañe!
                            </h2>
                        ) : escena ? (
                            <>
                                <span>
                                    Premio {escena.premio}:{' '}
                                    {
                                        premios[
                                            escena.premio - 1
                                        ]?.nombre
                                    }
                                </span>

                                <h2>
                                    ¡Número{' '}
                                    {String(
                                        escena.numero,
                                    ).padStart(2, '0')}
                                    !
                                </h2>

                                <p>
                                    Ganador registrado
                                </p>
                            </>
                        ) : (
                            <>
                                <h2>
                                    {elegibles.length}{' '}
                                    números pagados
                                </h2>

                                <p>
                                    {datos.control?.fase ===
                                        'abierta'
                                        ? 'La organizadora todavía está registrando participantes.'
                                        : 'Esperando el primer premio.'}
                                </p>
                            </>
                        )}
                    </div>

                    {esAdmin && (
                        <div className="sorteo-controles">
                            <button
                                type="button"
                                className="boton boton--rosa"
                                disabled={!permitido}
                                onClick={sortear}
                            >
                                {textoBoton}
                            </button>

                            {siguiente <= 8 && (
                                <p>
                                    {
                                        premios[
                                            siguiente - 1
                                        ]?.nombre
                                    }
                                </p>
                            )}

                            {datos.control?.fase ===
                                'abierta' && (
                                    <p>
                                        Cierra las inscripciones
                                        desde el panel antes
                                        de sortear.
                                    </p>
                                )}
                        </div>
                    )}
                </section>

                <section className="admin-caja">
                    <h2>Los ganadores</h2>

                    <p>
                        Ocho premios, ocho números
                        diferentes.
                    </p>

                    <ol className="sorteo-ganadores">
                        {premios.map((premio) => {
                            const ganador =
                                datos.ganadores.find(
                                    (resultado) =>
                                        resultado.premio ===
                                        premio.numero &&
                                        !(
                                            ocupado &&
                                            resultado.solicitud ===
                                            escena?.solicitud
                                        ),
                                )

                            const fecha = ganador
                                ? new Date(
                                    ganador.creado_en,
                                ).toLocaleString(
                                    'es-CL',
                                    {
                                        timeZone:
                                            'America/Santiago',
                                    },
                                )
                                : 'Pendiente'

                            return (
                                <li key={premio.numero}>
                                    <span className="sorteo-premio-id">
                                        {premio.numero}
                                    </span>

                                    <div>
                                        <strong>
                                            {premio.nombre}
                                        </strong>

                                        <small>
                                            {fecha}
                                        </small>
                                    </div>

                                    <b>
                                        {ganador
                                            ? String(
                                                ganador.numero,
                                            ).padStart(2, '0')
                                            : '—'}
                                    </b>
                                </li>
                            )
                        })}
                    </ol>

                    <p className="sorteo-nota">
                        Los resultados se guardan
                        y se actualizan cada
                        5 segundos.
                    </p>
                </section>
            </div>
        </main>
    )
}