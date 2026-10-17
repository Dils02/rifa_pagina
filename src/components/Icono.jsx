const trazos = {
    corazon: (
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),

    entrada: (
        <>
            <path d="M3 5h18v4a3 3 0 0 0 0 6v4H3v-4a3 3 0 0 0 0-6V5Z" />
            <path d="M15 5v2m0 4v2m0 4v2" />
        </>
    ),

    regalo: (
        <>
            <path d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13" />
            <path d="M12 8H7.5A2.5 2.5 0 1 1 10 5.5L12 8Zm0 0h4.5A2.5 2.5 0 1 0 14 5.5L12 8Z" />
        </>
    ),

    calendario: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M7 3v4m10-4v4M3 11h18m-13 4h1m6 0h1m-8 3h1" />
        </>
    ),

    flecha: <path d="M4 12h16m-6-6 6 6-6 6" />,

    check: <path d="m5 12 4 4L19 6" />,

    telefono: (
        <>
            <path d="M21 11.5a9 9 0 0 1-13.4 7.9L3 21l1.6-4.6A9 9 0 1 1 21 11.5Z" />
            <path d="m8 7-1 2c1 4 3 6 7 7l2-1-2-2-1 1c-2-1-3-2-4-4l1-1-2-2Z" />
        </>
    ),

    instagram: (
        <>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <path d="M17.5 6.5h.01" />
        </>
    ),

    estrella: (
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
    ),
}

export default function Icono({ nombre, className = '' }) {
    return (
        <svg
            className={`icono ${className}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {trazos[nombre] || trazos.corazon}
        </svg>
    )
}