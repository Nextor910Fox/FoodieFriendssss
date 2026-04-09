import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWishlist, addToWishlist, removeFromWishlist } from '../services/restaurants'
import { useAuth } from '../contexts/AuthContext'

export default function Wishlist() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', city: '', notes: '' })

  const load = async () => {
    setLoading(true)
    const data = await getWishlist(user.uid)
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    if (!form.name) return
    await addToWishlist(user.uid, form)
    setForm({ name: '', city: '', notes: '' })
    setShowForm(false)
    await load()
  }

  const handleRemove = async (id) => {
    if (!confirm('¿Eliminar de la lista?')) return
    await removeFromWishlist(user.uid, id)
    await load()
  }

  const handleVisited = async (item) => {
    if (!confirm('¿Marcar como visitado y crear ficha del restaurante?')) return
    navigate('/agregar', { state: { prefill: item } })
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Lista de deseos</h1>
          <div className="subtitle">Restaurantes por visitar</div>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="field">
            <label>Nombre del restaurante</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Ciudad</label>
            <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          </div>
          <div className="field">
            <label>Notas</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="¿Por qué quieres ir?" />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn" onClick={handleAdd}>Agregar</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="spinner"></div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="icon">❤️</div>
          <h3>Lista vacía</h3>
          <p>Agrega restaurantes que quieras visitar</p>
        </div>
      ) : (
        items.map(item => (
          <div key={item.id} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div className="card-title">{item.name}</div>
                {item.city && <div className="card-meta"><span>📍 {item.city}</span></div>}
                {item.notes && <div style={{ marginTop: 8, color: 'var(--text-dim)', fontSize: 14 }}>{item.notes}</div>}
              </div>
              <button onClick={() => handleRemove(item.id)} style={{ fontSize: 20, color: 'var(--text-dim)' }}>×</button>
            </div>
            <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => handleVisited(item)}>
              ✓ Marcar como visitado
            </button>
          </div>
        ))
      )}

      {!showForm && (
        <button className="fab" onClick={() => setShowForm(true)}>+</button>
      )}
    </div>
  )
}
