import '../styles/RuletaSorteo.css'

const COLORES = ['#f4a6c1', '#fde4a8', '#a9d8ef', '#d3c1f0', '#bfe8cf']
const TAMANO = 300
const FOCOS = 24

function punto(centro, radio, grados) {
    const rad = ((grados - 90) * Math.PI) / 180
    return [
        centro + radio * Math.cos(rad),
        centro + radio * Math.sin(rad),
    ]
}

// Evita que el último gajo quede del mismo color que el primero
function colorDe(i, total) {
    let idx = i % COLORES.length
    if (total > 1 && i === total - 1 && idx === 0) idx = 2
    return COLORES[idx]
}

// numeros: lista de números que participan (cada uno es un gajo).
// rotacion: grados que tiene girada la ruleta ahora.
export default function RuletaSorteo({
    numeros,
    rotacion,
    girando,
    duracion,
    numeroGanador = null,
    nombreGanador = '',
    alTerminar,
}) {
    const mostrarGanador = !girando && numeroGanador !== null
    const total = numeros.length
    const centro = TAMANO / 2
    const radio = centro - 2
    const angulo = total > 0 ? 360 / total : 0
    const conTexto = total > 0 && total <= 30
    const conClavijas = total > 1 && total <= 36

    const focos = Array.from({ length: FOCOS }, (_, i) =>
        punto(200, 187.5, (i * 360) / FOCOS),
    )

    return (
        <div
            className={[
                'pa-rul',
                girando ? 'pa-rul--girando' : '',
                mostrarGanador ? 'pa-rul--ganador' : '',
            ].filter(Boolean).join(' ')}
        >
            {/* Marco dorado con focos (fijo) */}
            <svg className="pa-rul__marco" viewBox="0 0 400 400" aria-hidden="true">
                <defs>
                    <linearGradient id="pa-rul-oro" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#fff1b8" />
                        <stop offset="35%" stopColor="#e6b035" />
                        <stop offset="65%" stopColor="#a8741a" />
                        <stop offset="100%" stopColor="#f6d77a" />
                    </linearGradient>
                </defs>
                <circle cx="200" cy="200" r="199" fill="url(#pa-rul-oro)" />
                <circle cx="200" cy="200" r="176" fill="#7a2a58" />
                <circle
                    cx="200"
                    cy="200"
                    r="176"
                    fill="none"
                    stroke="url(#pa-rul-oro)"
                    strokeWidth="3"
                />
                {focos.map(([x, y], i) => (
                    <circle
                        key={i}
                        className="pa-rul__foco"
                        cx={x}
                        cy={y}
                        r="6"
                        style={{ animationDelay: i % 2 ? '0.6s' : '0s' }}
                    />
                ))}
            </svg>

            {/* Disco que gira */}
            <svg
                className="pa-rul__disco"
                viewBox={`0 0 ${TAMANO} ${TAMANO}`}
                role="img"
                aria-label={`Ruleta con ${total} números`}
                onTransitionEnd={(evento) => {
                    if (
                        girando &&
                        evento.target === evento.currentTarget &&
                        evento.propertyName === 'transform'
                    ) {
                        alTerminar?.()
                    }
                }}
                style={{
                    transform: `rotate(${rotacion}deg)`,
                    transition: girando
                        ? `transform ${duracion}s cubic-bezier(0.1, 0.75, 0.15, 1)`
                        : 'none',
                }}
            >
                <defs>
                    <radialGradient id="pa-rul-brillo" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
                        <stop offset="60%" stopColor="#fff" stopOpacity="0" />
                        <stop offset="100%" stopColor="#4a1d3a" stopOpacity="0.2" />
                    </radialGradient>
                </defs>

                {total === 0 && (
                    <circle
                        cx={centro}
                        cy={centro}
                        r={radio}
                        fill="#f3ece8"
                        stroke="#ddd3ce"
                    />
                )}

                {total === 1 && (
                    <circle cx={centro} cy={centro} r={radio} fill={COLORES[0]} />
                )}

                {total > 1 &&
                    numeros.map((numero, i) => {
                        const inicio = i * angulo
                        const fin = inicio + angulo
                        const [x1, y1] = punto(centro, radio, inicio)
                        const [x2, y2] = punto(centro, radio, fin)
                        const [tx, ty] = punto(centro, radio * 0.8, inicio + angulo / 2)
                        const [cx, cy] = punto(centro, radio - 5, inicio)
                        const grande = angulo > 180 ? 1 : 0

                        return (
                            <g key={numero}>
                                <path
                                    d={`M ${centro} ${centro} L ${x1} ${y1} A ${radio} ${radio} 0 ${grande} 1 ${x2} ${y2} Z`}
                                    fill={colorDe(i, total)}
                                    stroke="#fff"
                                    strokeOpacity="0.9"
                                    strokeWidth={total > 60 ? 0.4 : 1}
                                />

                                {conClavijas && (
                                    <circle cx={cx} cy={cy} r="1.8" fill="#fff" />
                                )}

                                {conTexto && (
                                    <text
                                        x={tx}
                                        y={ty}
                                        fontSize={total > 20 ? 9 : total > 12 ? 11 : 15}
                                        fontWeight="800"
                                        fill="#4a1d3a"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        transform={`rotate(${inicio + angulo / 2}, ${tx}, ${ty})`}
                                    >
                                        {String(numero).padStart(2, '0')}
                                    </text>
                                )}
                            </g>
                        )
                    })}

                {/* Brillo para dar profundidad */}
                <circle
                    cx={centro}
                    cy={centro}
                    r={radio}
                    fill="url(#pa-rul-brillo)"
                    pointerEvents="none"
                />
                <circle
                    cx={centro}
                    cy={centro}
                    r={radio}
                    fill="none"
                    stroke="#fff"
                    strokeWidth="3"
                />
            </svg>

            {/* Centro (fijo) */}
            <svg className="pa-rul__centro" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="48" fill="url(#pa-rul-oro)" />
                <circle cx="50" cy="50" r="38" fill="#fff" stroke="#c4406f" strokeWidth="4" />
                <text x="50" y="52" fontSize="38" textAnchor="middle" dominantBaseline="middle">
                    🍬
                </text>
            </svg>

            {/* Puntero (fijo) */}
            <svg className="pa-rul__puntero" viewBox="0 0 52 64" aria-hidden="true">
                <path
                    d="M26 62 L4 22 A24 24 0 1 1 48 22 Z"
                    fill="#c4406f"
                    stroke="#fff"
                    strokeWidth="3"
                    strokeLinejoin="round"
                />
                <circle cx="26" cy="22" r="7" fill="#fff" />
            </svg>
            {/* Anuncio accesible del resultado */}
            <div className="pa-rul__anuncio" role="status" aria-live="polite">
                {mostrarGanador && (
                    <span>
                        Número ganador: {numeroGanador}
                        {nombreGanador ? `. Felicitaciones, ${nombreGanador}` : ''}
                    </span>
                )}
            </div>

            {mostrarGanador && (
                <div
                    className="pa-rul__celebracion"
                    key={`ganador-${numeroGanador}`}
                >
                    {/* Confeti decorativo */}
                    <div className="pa-rul__confeti" aria-hidden="true">
                        {Array.from({ length: 40 }, (_, i) => (
                            <span
                                key={i}
                                className="pa-rul__papel"
                                style={{
                                    '--x': `${(i * 37) % 100}%`,
                                    '--deriva': `${((i * 29) % 160) - 80}px`,
                                    '--demora': `${(i % 10) * 0.08}s`,
                                    '--tiempo': `${2.2 + (i % 5) * 0.2}s`,
                                    '--giro': `${i % 2 ? 540 : -540}deg`,
                                    '--color': COLORES[i % COLORES.length],
                                }}
                            />
                        ))}
                    </div>

                    <div className="pa-rul__tarjeta-ganador">
                        <span className="pa-rul__trofeo" aria-hidden="true">
                            🏆
                        </span>

                        <p className="pa-rul__titulo-ganador">
                            ¡Tenemos ganador!
                        </p>

                        <span className="pa-rul__etiqueta-ganador">
                            NÚMERO GANADOR
                        </span>

                        <strong className="pa-rul__numero-ganador">
                            {String(numeroGanador).padStart(2, '0')}
                        </strong>

                        {nombreGanador && (
                            <p className="pa-rul__nombre-ganador">
                                {nombreGanador}
                            </p>
                        )}

                        <p className="pa-rul__felicitaciones">
                            ¡Muchas felicidades! 🎉
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}