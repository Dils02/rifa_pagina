import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import RuletaSorteo from '../components/RuletaSorteo.jsx'
import { premios } from '../data/rifa.js'
import { supabase } from '../lib/supabaseClient.js'
import { formatoNumero } from '../utils/rifa.js'

import '../styles/panel-admin.css'

const TOTAL_PREMIOS = 8
const DURACION_GIRO = 7
const VUELTAS = 6

const ETIQUETA_ESTADO = {
    disponible: 'Disponible',
    reservado: 'Reservado',
    pagado: 'Pagado',
}

const ETIQUETA_FASE = {
    abierta: 'Inscripciones abiertas',
    cerrada: 'Inscripciones cerradas',
    finalizada: 'Sorteo terminado',
}

// Grados que hay que girar para que el gajo ganador quede bajo la flecha.
function calcularRotacion(indice, total, actual) {
    if (!total || indice < 0) return actual

    const angulo = 360 / total
    const centro = indice * angulo + angulo / 2
    const falta = (((-centro - actual) % 360) + 360) % 360

    return actual + VUELTAS * 360 + falta
}

function mensajeDe(error) {
    return error?.message || 'Algo salió mal. Intenta de nuevo.'
}

/* ---------- Sesión ---------- */

function useSesion() {
    const [sesion, setSesion] = useState(null)
    const [cargando, setCargando] = useState(Boolean(supabase))

    useEffect(() => {
        if (!supabase) return undefined

        supabase.auth.getSession().then(({ data }) => {
            setSesion(data.session)
            setCargando(false)
        })

        const { data } = supabase.auth.onAuthStateChange((_evento, nueva) => {
            setSesion(nueva)
        })

        return () => data.subscription.unsubscribe()
    }, [])

    return { sesion, cargando }
}

function Pantalla({ children }) {
    return (
        <main className="pa pa--centro">
            <div className="pa-caja">{children}</div>
        </main>
    )
}

/* ---------- Ingreso ---------- */

function Ingreso() {
    const [correo, setCorreo] = useState('')
    const [clave, setClave] = useState('')
    const [error, setError] = useState('')
    const [enviando, setEnviando] = useState(false)

    async function entrar(evento) {
        evento.preventDefault()
        setError('')
        setEnviando(true)

        const { error: fallo } = await supabase.auth.signInWithPassword({
            email: correo.trim(),
            password: clave,
        })

        setEnviando(false)

        if (fallo) setError('El correo o la contraseña no coinciden.')
    }

    return (
        <Pantalla>
            <h1 className="pa-titulo">Panel de la rifa</h1>
            <p className="pa-texto">Ingresa con tu cuenta de administradora.</p>

            <form className="pa-form" onSubmit={entrar}>
                <label className="pa-campo">
                    <span>Correo</span>
                    <input
                        type="email"
                        autoComplete="username"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </label>

                <label className="pa-campo">
                    <span>Contraseña</span>
                    <input
                        type="password"
                        autoComplete="current-password"
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
                        required
                    />
                </label>

                {error && <p className="pa-error" role="alert">{error}</p>}

                <button className="pa-boton" type="submit" disabled={enviando}>
                    {enviando ? 'Ingresando…' : 'Ingresar'}
                </button>
            </form>
        </Pantalla>
    )
}

/* ---------- Editor de un número ---------- */

function EditorNumero({ numero, fila, participante, bloqueado, onCerrar, onGuardado }) {
    const [nombre, setNombre] = useState(participante?.nombre ?? '')
    const [telefono, setTelefono] = useState(participante?.telefono ?? '')
    const [error, setError] = useState('')
    const [guardando, setGuardando] = useState(false)

    async function guardar(estado) {
        setError('')

        if (estado !== 'disponible' && nombre.trim().length < 2) {
            setError('Escribe el nombre de quien compró (mínimo 2 letras).')
            return
        }

        if (
            estado === 'disponible' &&
            fila.estado !== 'disponible' &&
            !window.confirm(
                `¿Liberar el número ${formatoNumero(numero)}? Se borran los datos de ${participante?.nombre || 'la persona'}.`,
            )
        ) {
            return
        }

        setGuardando(true)

        const { error: fallo } = await supabase.rpc('guardar_numero_rifa', {
            p_numero: numero,
            p_estado: estado,
            p_nombre: estado === 'disponible' ? null : nombre,
            p_telefono: estado === 'disponible' ? null : telefono,
            p_version: fila.version,
        })

        setGuardando(false)

        if (fallo) {
            setError(mensajeDe(fallo))
            onGuardado(false)
            return
        }

        onGuardado(true)
    }

    return (
        <div className="pa-modal" role="dialog" aria-modal="true" aria-labelledby="pa-modal-titulo">
            <div className="pa-modal__panel">
                <h2 id="pa-modal-titulo" className="pa-modal__titulo">
                    Número {formatoNumero(numero)}
                </h2>

                <p className="pa-texto">
                    Estado actual: <strong>{ETIQUETA_ESTADO[fila.estado]}</strong>
                </p>

                {bloqueado ? (
                    <>
                        <p className="pa-aviso">
                            Las inscripciones están cerradas, ya no se pueden
                            cambiar los participantes.
                        </p>

                        {participante && (
                            <p className="pa-texto">
                                {participante.nombre}
                                {participante.telefono ? ` · ${participante.telefono}` : ''}
                            </p>
                        )}

                        <div className="pa-modal__acciones">
                            <button className="pa-boton pa-boton--suave" type="button" onClick={onCerrar}>
                                Cerrar
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <label className="pa-campo">
                            <span>Nombre de quien compró</span>
                            <input
                                type="text"
                                value={nombre}
                                maxLength={100}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </label>

                        <label className="pa-campo">
                            <span>Teléfono (opcional)</span>
                            <input
                                type="tel"
                                value={telefono}
                                maxLength={30}
                                onChange={(e) => setTelefono(e.target.value)}
                            />
                        </label>

                        {error && <p className="pa-error" role="alert">{error}</p>}

                        <div className="pa-modal__acciones">
                            <button
                                className="pa-boton"
                                type="button"
                                disabled={guardando}
                                onClick={() => guardar('pagado')}
                            >
                                Marcar como pagado
                            </button>

                            <button
                                className="pa-boton pa-boton--ambar"
                                type="button"
                                disabled={guardando}
                                onClick={() => guardar('reservado')}
                            >
                                Dejar reservado
                            </button>

                            {fila.estado !== 'disponible' && (
                                <button
                                    className="pa-boton pa-boton--borde"
                                    type="button"
                                    disabled={guardando}
                                    onClick={() => guardar('disponible')}
                                >
                                    Liberar número
                                </button>
                            )}

                            <button
                                className="pa-boton pa-boton--suave"
                                type="button"
                                disabled={guardando}
                                onClick={onCerrar}
                            >
                                Cancelar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

/* ---------- Panel ---------- */

function Panel({ correo }) {
    const [control, setControl] = useState(null)
    const [numeros, setNumeros] = useState([])
    const [participantes, setParticipantes] = useState({})
    const [ganadores, setGanadores] = useState([])
    const [sinNombres, setSinNombres] = useState(false)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    const [editando, setEditando] = useState(null)
    const [cerrando, setCerrando] = useState(false)

    const [girando, setGirando] = useState(false)
    const [rotacion, setRotacion] = useState(0)
    const [segmentos, setSegmentos] = useState(null)
    const [resultado, setResultado] = useState(null)

    const animando = useRef(false)
    const solicitudes = useRef({})

    const cargar = useCallback(async () => {
        // Mientras gira la ruleta no se actualiza nada, para no adelantar el resultado.
        if (animando.current) return

        const [rControl, rNumeros, rParticipantes, rGanadores] = await Promise.all([
            supabase.from('rifa_control').select('fase').maybeSingle(),
            supabase.from('rifa_numeros').select('numero, estado, version').order('numero'),
            supabase.from('rifa_participantes').select('numero, nombre, telefono'),
            supabase
                .from('rifa_ganadores')
                .select('premio, numero, candidatos')
                .order('premio'),
        ])

        const fallo = rControl.error || rNumeros.error || rGanadores.error

        if (fallo) {
            setError(mensajeDe(fallo))
            setCargando(false)
            return
        }

        setError('')
        setControl(rControl.data)
        setNumeros(rNumeros.data ?? [])
        setGanadores(rGanadores.data ?? [])

        if (rParticipantes.error) {
            setSinNombres(true)
            setParticipantes({})
        } else {
            setSinNombres(false)
            setParticipantes(
                Object.fromEntries(
                    (rParticipantes.data ?? []).map((p) => [p.numero, p]),
                ),
            )
        }

        setCargando(false)
    }, [])

    useEffect(() => {
        cargar()
    }, [cargar])

    const porNumero = useMemo(
        () => Object.fromEntries(numeros.map((n) => [n.numero, n])),
        [numeros],
    )

    const conteo = useMemo(() => {
        const cuenta = { disponible: 0, reservado: 0, pagado: 0 }
        for (const n of numeros) cuenta[n.estado] += 1
        return cuenta
    }, [numeros])

    const elegibles = useMemo(() => {
        const ganados = new Set(ganadores.map((g) => g.numero))
        return numeros
            .filter((n) => n.estado === 'pagado' && !ganados.has(n.numero))
            .map((n) => n.numero)
    }, [numeros, ganadores])

    const fase = control?.fase ?? 'abierta'
    const total = numeros.length
    const completo = total > 0 && conteo.pagado === total
    const premioSiguiente = ganadores.length + 1
    const ganadorDe = Object.fromEntries(ganadores.map((g) => [g.premio, g]))
    const numerosRuleta = segmentos ?? elegibles

    async function salir() {
        await supabase.auth.signOut()
    }

    async function cerrarInscripciones() {
        const seguro = window.confirm(
            'Vas a cerrar las inscripciones. Después no se puede cambiar ningún número ni reabrir la rifa. ¿Seguimos?',
        )
        if (!seguro) return

        setCerrando(true)
        setError('')

        const { error: fallo } = await supabase.rpc('cambiar_fase_rifa', {
            p_fase: 'cerrada',
        })

        setCerrando(false)

        if (fallo) {
            setError(mensajeDe(fallo))
            return
        }

        await cargar()
    }

    async function girar() {
        if (girando || premioSiguiente > TOTAL_PREMIOS) return

        setError('')
        setResultado(null)

        // La misma solicitud se reutiliza si hay que reintentar el mismo premio.
        const clave = `premio-${premioSiguiente}`
        if (!solicitudes.current[clave]) {
            solicitudes.current[clave] = crypto.randomUUID()
        }

        animando.current = true
        setGirando(true)

        const { data, error: fallo } = await supabase.rpc('sortear_premio_rifa', {
            p_premio: premioSiguiente,
            p_solicitud: solicitudes.current[clave],
        })

        if (fallo) {
            animando.current = false
            setGirando(false)
            setError(mensajeDe(fallo))
            return
        }

        const candidatos = data.candidatos ?? []
        const indice = candidatos.indexOf(data.numero)

        setSegmentos(candidatos)
        setRotacion((actual) => calcularRotacion(indice, candidatos.length, actual))

        setTimeout(async () => {
            animando.current = false
            setGirando(false)
            setResultado(data)
            await cargar()
        }, DURACION_GIRO * 1000 + 400)
    }

    function alGuardar(correcto) {
        if (correcto) setEditando(null)
        cargar()
    }

    if (cargando) {
        return (
            <Pantalla>
                <p className="pa-texto">Cargando la rifa…</p>
            </Pantalla>
        )
    }

    const premioResultado = resultado
        ? premios.find((p) => p.numero === resultado.premio)
        : null

    return (
        <main className="pa">
            <header className="pa-cabecera">
                <div>
                    <h1 className="pa-titulo">Panel de la rifa</h1>
                    <p className="pa-texto">{correo}</p>
                </div>

                <div className="pa-cabecera__acciones">
                    <a className="pa-boton pa-boton--borde" href="#/">
                        Ver la página
                    </a>
                    <button className="pa-boton pa-boton--suave" type="button" onClick={salir}>
                        Salir
                    </button>
                </div>
            </header>

            {error && <p className="pa-error" role="alert">{error}</p>}

            <section className="pa-resumen" aria-label="Resumen">
                <div className="pa-dato pa-dato--principal">
                    <strong>{conteo.pagado} de {total}</strong>
                    <span>números pagados</span>
                    <div
                        className="pa-barra"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={total}
                        aria-valuenow={conteo.pagado}
                    >
                        <div
                            className="pa-barra__relleno"
                            style={{ width: `${total ? (conteo.pagado / total) * 100 : 0}%` }}
                        />
                    </div>
                </div>

                <div className="pa-dato">
                    <strong>{conteo.reservado}</strong>
                    <span>reservados</span>
                </div>

                <div className="pa-dato">
                    <strong>{conteo.disponible}</strong>
                    <span>disponibles</span>
                </div>

                <div className="pa-dato">
                    <strong className="pa-fase">{ETIQUETA_FASE[fase] ?? fase}</strong>
                    <span>estado de la rifa</span>
                </div>
            </section>

            <section className="pa-seccion" aria-labelledby="pa-numeros">
                <h2 id="pa-numeros" className="pa-subtitulo">Números</h2>

                <p className="pa-texto">
                    Toca un número para registrar quién lo compró y marcarlo como
                    pagado.
                </p>

                {sinNombres && (
                    <p className="pa-aviso">
                        No se pudieron leer los nombres de los participantes.
                        Los estados sí se ven bien.
                    </p>
                )}

                <ul className="pa-leyenda" aria-label="Colores">
                    <li><i className="pa-punto pa-punto--disponible" />Disponible</li>
                    <li><i className="pa-punto pa-punto--reservado" />Reservado</li>
                    <li><i className="pa-punto pa-punto--pagado" />Pagado</li>
                </ul>

                <div className="pa-grilla">
                    {numeros.map((fila) => {
                        const persona = participantes[fila.numero]
                        const primerNombre = persona?.nombre?.trim().split(' ')[0]

                        return (
                            <button
                                key={fila.numero}
                                type="button"
                                className={`pa-num pa-num--${fila.estado}`}
                                onClick={() => setEditando(fila.numero)}
                                aria-label={`Número ${fila.numero}, ${ETIQUETA_ESTADO[fila.estado]}${primerNombre ? `, ${primerNombre}` : ''}`}
                            >
                                <span className="pa-num__valor">{formatoNumero(fila.numero)}</span>
                                {primerNombre && (
                                    <span className="pa-num__nombre">{primerNombre}</span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </section>

            <section className="pa-seccion" aria-labelledby="pa-sorteo">
                <h2 id="pa-sorteo" className="pa-subtitulo">Sorteo</h2>

                {fase === 'abierta' && (
                    <>
                        <p className="pa-texto">
                            La ruleta se habilita cuando los {total || 100} números
                            estén pagados y cierres las inscripciones.
                            {!completo && total > 0 && (
                                <> Faltan <strong>{total - conteo.pagado}</strong> para llegar.</>
                            )}
                        </p>

                        <button
                            className="pa-boton"
                            type="button"
                            disabled={!completo || cerrando}
                            onClick={cerrarInscripciones}
                        >
                            {cerrando ? 'Cerrando…' : 'Cerrar inscripciones y preparar el sorteo'}
                        </button>
                    </>
                )}

                {fase !== 'abierta' && (
                    <div className="pa-sorteo">
                        <div className="pa-sorteo__ruleta">
                            <RuletaSorteo
                                numeros={numerosRuleta}
                                rotacion={rotacion}
                                girando={girando}
                                duracion={DURACION_GIRO}
                            />

                            {fase === 'cerrada' && (
                                <button
                                    className="pa-boton pa-boton--grande"
                                    type="button"
                                    disabled={girando}
                                    onClick={girar}
                                >
                                    {girando
                                        ? 'Girando…'
                                        : `Girar para el premio ${premioSiguiente}: ${premios.find((p) => p.numero === premioSiguiente)?.nombre ?? ''}`}
                                </button>
                            )}

                            {fase === 'finalizada' && !girando && (
                                <p className="pa-aviso">¡Sorteo terminado! Ya están los 8 ganadores.</p>
                            )}

                            {resultado && !girando && (
                                <div className="pa-resultado" role="status">
                                    <span>Premio {resultado.premio}: {premioResultado?.nombre}</span>
                                    <strong>{formatoNumero(resultado.numero)}</strong>
                                    <span>{participantes[resultado.numero]?.nombre ?? ''}</span>
                                </div>
                            )}
                        </div>

                        <ol className="pa-premios">
                            {premios.map((premio) => {
                                const ganador = ganadorDe[premio.numero]
                                const oculto =
                                    girando && premio.numero === premioSiguiente

                                return (
                                    <li key={premio.numero} className="pa-premio">
                                        <span className="pa-premio__nombre">
                                            {premio.numero}. {premio.nombre}
                                        </span>

                                        {ganador && !oculto ? (
                                            <span className="pa-premio__ganador">
                                                <strong>{formatoNumero(ganador.numero)}</strong>{' '}
                                                {participantes[ganador.numero]?.nombre ?? ''}
                                            </span>
                                        ) : (
                                            <span className="pa-premio__pendiente">Pendiente</span>
                                        )}
                                    </li>
                                )
                            })}
                        </ol>
                    </div>
                )}
            </section>

            {editando !== null && porNumero[editando] && (
                <EditorNumero
                    key={editando}
                    numero={editando}
                    fila={porNumero[editando]}
                    participante={participantes[editando]}
                    bloqueado={fase !== 'abierta'}
                    onCerrar={() => setEditando(null)}
                    onGuardado={alGuardar}
                />
            )}
        </main>
    )
}

/* ---------- Entrada ---------- */

function PanelProtegido({ sesion }) {
    const [permitido, setPermitido] = useState(null)

    useEffect(() => {
        let vigente = true

        supabase.rpc('es_admin_rifa').then(({ data, error }) => {
            if (vigente) setPermitido(!error && data === true)
        })

        return () => {
            vigente = false
        }
    }, [sesion.user.id])

    if (permitido === null) {
        return (
            <Pantalla>
                <p className="pa-texto">Revisando tu cuenta…</p>
            </Pantalla>
        )
    }

    if (!permitido) {
        return (
            <Pantalla>
                <h1 className="pa-titulo">Sin permiso</h1>
                <p className="pa-texto">
                    Esta cuenta no está registrada como administradora de la rifa.
                </p>
                <button
                    className="pa-boton"
                    type="button"
                    onClick={() => supabase.auth.signOut()}
                >
                    Salir
                </button>
            </Pantalla>
        )
    }

    return <Panel correo={sesion.user.email} />
}

export default function Admin() {
    const { sesion, cargando } = useSesion()

    if (!supabase) {
        return (
            <Pantalla>
                <h1 className="pa-titulo">Falta la conexión</h1>
                <p className="pa-texto">
                    No se encontraron las variables VITE_SUPABASE_URL y
                    VITE_SUPABASE_PUBLISHABLE_KEY. Revisa el archivo .env y
                    reinicia el servidor.
                </p>
            </Pantalla>
        )
    }

    if (cargando) {
        return (
            <Pantalla>
                <p className="pa-texto">Cargando…</p>
            </Pantalla>
        )
    }

    if (!sesion) return <Ingreso />

    return <PanelProtegido sesion={sesion} />
}