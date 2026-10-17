import { rifa } from '../data/rifa.js'
import useSeleccionNumeros from '../hooks/useSeleccionNumeros.js'

import {
    crearEnlaceWhatsApp,
    formatoMoneda,
    formatoNumero,
} from '../utils/rifa.js'

import Icono from './Icono.jsx'

export default function SelectorNumeros() {
    const {
        seleccion,
        alternar,
        limpiar,
        total,
    } = useSeleccionNumeros(
        rifa.totalNumeros,
        rifa.precioNumero,
    )

    const numeros = Array.from(
        { length: rifa.totalNumeros },
        (_, indice) => indice + 1,
    )

    const enlace = crearEnlaceWhatsApp(rifa, seleccion)

    return (
        <section
            className="seccion seccion--numeros"
            id="numeros"
            aria-labelledby="titulo-numeros"
        >
            <div className="contenedor">
                <div className="titulo-seccion">
                    <span className="sobretitulo">
                        <Icono nombre="entrada" />
                        CADA NÚMERO CUENTA
                    </span>

                    <h2 id="titulo-numeros">
                        ¿Cuál es tu número <span>de la suerte?</span>
                    </h2>

                    <p>
                        Elige uno o varios favoritos y consulta su
                        disponibilidad por WhatsApp.
                    </p>
                </div>

                <div className="seleccion-layout">
                    <div className="tablero">
                        <div className="tablero__cabecera">
                            <h3>
                                Del 1 al {rifa.totalNumeros}, con cariño
                            </h3>

                            <span>
                                {formatoMoneda(rifa.precioNumero)}{' '}
                                <small>c/u</small>
                            </span>
                        </div>

                        <div
                            className="leyenda"
                            aria-label="Estados de los números"
                        >
                            <span>
                                <i
                                    className="leyenda__punto"
                                    aria-hidden="true"
                                />
                                Por consultar
                            </span>

                            <span>
                                <i
                                    className="leyenda__punto leyenda__punto--seleccion"
                                    aria-hidden="true"
                                />
                                Tu selección
                            </span>
                        </div>

                        <div
                            className="numeros"
                            role="group"
                            aria-label="Selecciona los números que quieres consultar"
                            aria-describedby="nota-disponibilidad"
                        >
                            {numeros.map((numero) => {
                                const elegido = seleccion.includes(numero)

                                return (
                                    <button
                                        className={`numero${elegido ? ' numero--seleccionado' : ''
                                            }`}
                                        key={numero}
                                        type="button"
                                        aria-pressed={elegido}
                                        aria-label={`Número ${numero}${elegido ? ', seleccionado' : ''
                                            }`}
                                        onClick={() => alternar(numero)}
                                    >
                                        <span>{formatoNumero(numero)}</span>

                                        <Icono
                                            nombre={elegido ? 'check' : 'corazon'}
                                        />
                                    </button>
                                )
                            })}
                        </div>

                        <p
                            className="nota-disponibilidad"
                            id="nota-disponibilidad"
                        >
                            <Icono nombre="corazon" />

                            Seleccionar un número no lo reserva. La
                            organizadora confirmará disponibilidad y pago
                            por WhatsApp.
                        </p>
                    </div>

                    <aside
                        className="resumen"
                        aria-labelledby="titulo-resumen"
                    >
                        <div className="resumen__icono">
                            <Icono nombre="entrada" />
                        </div>

                        <h3 id="titulo-resumen">Tus numeritos</h3>

                        <p>Un pequeño aporte lleno de ilusión.</p>

                        <div className="resumen__seleccion">
                            {seleccion.length === 0 ? (
                                <div className="resumen__vacio">
                                    <Icono nombre="corazon" />

                                    <p>
                                        Tu suerte empieza aquí.
                                        <br />
                                        Toca tus números favoritos.
                                    </p>
                                </div>
                            ) : (
                                <ul
                                    className="chips"
                                    aria-label="Números seleccionados"
                                >
                                    {seleccion.map((numero) => (
                                        <li key={numero}>
                                            <button
                                                type="button"
                                                onClick={() => alternar(numero)}
                                                aria-label={`Quitar número ${numero}`}
                                            >
                                                {formatoNumero(numero)}
                                                <span aria-hidden="true">×</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div
                            className="resumen__cuenta"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            <div>
                                <span>
                                    {seleccion.length}{' '}
                                    {seleccion.length === 1
                                        ? 'número elegido'
                                        : 'números elegidos'}
                                </span>

                                <span>
                                    {formatoMoneda(rifa.precioNumero)} c/u
                                </span>
                            </div>

                            <div className="resumen__total">
                                <span>Total</span>
                                <strong>{formatoMoneda(total)}</strong>
                            </div>
                        </div>

                        {enlace ? (
                            <a
                                className="boton boton--rosa resumen__boton"
                                href={enlace}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Consultar por WhatsApp
                                <Icono nombre="telefono" />
                            </a>
                        ) : (
                            <button
                                className="boton boton--rosa resumen__boton"
                                type="button"
                                disabled
                            >
                                Elige tus números
                                <Icono nombre="corazon" />
                            </button>
                        )}

                        <button
                            className="limpiar-seleccion"
                            type="button"
                            disabled={seleccion.length === 0}
                            onClick={limpiar}
                        >
                            Limpiar selección
                        </button>

                        <p className="resumen__aclaracion">
                            Consulta disponibilidad antes de transferir.
                            Tu participación se confirma cuando la
                            organizadora valida el pago.
                        </p>
                    </aside>
                </div>
            </div>
        </section>
    )
}