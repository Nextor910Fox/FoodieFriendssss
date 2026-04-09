import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { listRestaurants, calculateAverages, getAllUsers } from '../services/restaurants'

export default function Profile() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({ total: 0, rated: 0, avgGiven: 0 })
  const [members, setMembers] = useState([])

  useEffect(() => {
    Promise.all([listRestaurants(), getAllUsers()]).then(([restaurants, users]) => {
      const rated = restaurants.filter(r => r.ratings?.[user.uid])
      const totalScore = rated.reduce((sum, r) => {
        const my = r.ratings[user.uid]
        return sum + ((my.food + my.service + my.atmosphere + my.price + my.value) / 5)
      }, 0)
      setStats({
        total: restaurants.length,
        rated: rated.length,
        avgGiven: rated.length ? +(totalScore / rated.length).toFixed(1) : 0
      })
      setMembers(users)
    })
  }, [user.uid])

  return (
    <div className="page">
      <div className="page-header">
        <h1>Mi perfil</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
        {user.photoURL ? (
          <img src={user.photoURL} className="avatar avatar-lg" alt="" />
        ) : (
          <div className="avatar avatar-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700 }}>
            {user.name[0]}
          </div>
        )}
        <h2 style={{ marginTop: 12 }}>{user.name}</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>{user.email}</p>
      </div>

      <div className="section-title">Mis estadísticas</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <div className="card" style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{stats.total}</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Restaurantes</div>
        </div>
        <div className="card" style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{stats.rated}</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Calificados</div>
        </div>
        <div className="card" style={{ padding: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{stats.avgGiven || '—'}</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Promedio dado</div>
        </div>
      </div>

      <div className="section-title">Miembros del grupo ({members.length})</div>
      {members.map(m => (
        <div key={m.id} className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          {m.photoURL ? (
            <img src={m.photoURL} className="avatar" alt="" />
          ) : (
            <div className="avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {(m.name || '?')[0]}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{m.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{m.email}</div>
          </div>
          {m.uid === user.uid && <span className="tag">Tú</span>}
        </div>
      ))}

      <button className="btn btn-secondary" style={{ marginTop: 24 }} onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  )
}
