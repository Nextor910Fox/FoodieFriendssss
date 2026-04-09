import { useNavigate, useLocation } from 'react-router-dom'

const items = [
  { path: '/', icon: '🏠', label: 'Inicio' },
  { path: '/rankings', icon: '🏆', label: 'Ranking' },
  { path: '/agregar', icon: '➕', label: 'Agregar' },
  { path: '/lista-deseos', icon: '❤️', label: 'Deseos' },
  { path: '/perfil', icon: '👤', label: 'Perfil' }
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Ocultar en detalle
  if (pathname.startsWith('/restaurante/')) return null

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button
          key={item.path}
          className={pathname === item.path ? 'active' : ''}
          onClick={() => navigate(item.path)}
        >
          <span className="icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
