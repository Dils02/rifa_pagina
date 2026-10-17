const COLORES = ['#f9a8d4', '#fde68a', '#a5f3fc', '#c4b5fd', '#bbf7d0']

function punto(cx, cy, radio, grados) {
    const rad = ((grados - 90) * Math.PI) / 180
    return [cx + radio * Math.cos(rad), cy + radio * Math.sin(rad)]
}

export default function Ruleta({
    participantes = [],
    rotacion = 0,
    girando = false,
    duracion = 6,
}) {
    const total = participantes.length
    const tamano = 300
    const c = tamano / 2
    const radio = c - 6
    const angulo = total ? 360 / total : 0
    const mostrarTexto = total > 0 && total <= 40

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: 340, margin: '0 auto' }}>
            {/* Flecha */}
            <div
                style={{
                    position: 'absolute',
                    top: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '12px solid transparent',
                    borderRight: '12px solid transparent',
                    borderTop: '22px solid #be185d',
                    zIndex: 2,
                }}
            />

            <svg
                viewBox={`0 0 ${tamano} ${tamano}`}
                style={{
                    width: '100%',
                    transform: `rotate(${rotacion}deg)`,
                    transition: girando
                        ? `transform ${duracion}s cubic-bezier(0.12, 0.8, 0.2, 1)`
                        : 'none',
                }}
            >
                {total === 0 && (
                    <circle cx={c} cy={c} r={radio} fill="#f3f4f6" stroke="#d1d5db" />
                )}

                {total === 1 && (
                    <circle cx={c} cy={c} r={radio} fill={COLORES[0]} />
                )}

                {total > 1 &&
                    participantes.map((p, i) => {
                        const inicio = i * angulo
                        const fin = inicio + angulo
                        const [x1, y1] = punto(c, c, radio, inicio)
                        const [x2, y2] = punto(c, c, radio, fin)
                        const grande = angulo > 180 ? 1 : 0
                        const [tx, ty] = punto(c, c, radio * 0.78, inicio + angulo / 2)

                        return (
                            <g key={p.id ?? `${p.etiqueta}-${i}`}>
                                <path
                                    d={`M ${c} ${c} L ${x1} ${y1} A ${radio} ${radio} 0 ${grande} 1 ${x2} ${y2} Z`}
                                    fill={COLORES[i % COLORES.length]}
                                    stroke="#fff"
                                    strokeWidth="1"
                                />
                                {mostrarTexto && (
                                    <text
                                        x={tx}
                                        y={ty}
                                        fontSize={total > 20 ? 9 : 12}
                                        fontWeight="700"
                                        fill="#4b1d3f"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        transform={`rotate(${inicio + angulo / 2}, ${tx}, ${ty})`}
                                    >
                                        {p.etiqueta}
                                    </text>
                                )}
                            </g>
                        )
                    })}

                <circle cx={c} cy={c} r="14" fill="#fff" stroke="#be185d" strokeWidth="3" />
            </svg>
        </div>
    )
}