import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function BackButton({ onClick }) {
  const navigate = useNavigate()
  
  const handleDefaultClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(-1)
    }
  }

  return (
    <button 
      onClick={handleDefaultClick} 
      style={s.backBtn}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e5e7eb'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4"/><polyline points="13 8 8 12 13 16"/>
      </svg>
      <span style={s.backLabel}>Kembali</span>
    </button>
  )
}

const s = {
  backBtn: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: 8, 
    background: 'transparent', 
    border: 'none', 
    cursor: 'pointer', 
    padding: '6px 10px', 
    borderRadius: 8, 
    marginBottom: 12, 
    transition: 'background 0.15s', 
    fontFamily: "'Poppins',sans-serif" 
  },
  backLabel: { 
    fontSize: '0.95rem', 
    fontWeight: 600, 
    color: '#333' 
  }
}
