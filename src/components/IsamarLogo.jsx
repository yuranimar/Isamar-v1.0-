import { useState } from 'react'

// Logo con fallback SVG — si /logo.png no existe nunca muestra imagen rota
export default function IsamarLogo({ size = 40, className = '', variant = 'default' }) {
  const [broken, setBroken] = useState(false)

  if (broken) {
    // Fallback: sello "IS" en SVG cuando logo.png no existe
    const color = variant === 'light' ? '#FAF6F3' : '#8B3A45'
    const border = variant === 'light' ? 'rgba(250,246,243,0.4)' : 'rgba(139,58,69,0.3)'
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Isamar"
        className={className}
      >
        <rect x="1" y="1" width="38" height="38" rx="2" stroke={border} strokeWidth="1" />
        <text
          x="20"
          y="26"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="16"
          fontWeight="400"
          fill={color}
          letterSpacing="1"
        >
          IS
        </text>
      </svg>
    )
  }

  return (
    <img
      src="/logo.png"
      alt="Isamar"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
      onError={() => setBroken(true)}
    />
  )
}
