import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getRestaurant, rateRestaurant, calculateAverages,
  uploadPhoto, addPhotoToRestaurant, getAllUsers, deleteRestaurant
} from '../services/restaurants'
import StarRating from '../components/StarRating'
import { useAuth } from '../contexts/AuthContext'

const CATEGORIES = [
  { key: 'food', label: 'Comida' },
  { key: 'service', label: 'Servicio' },
  { key: 'atmosphere', label: 'Ambiente' },
  { key: 'price', label: 'Precio' },
  { key: 'value', label: 'Relación calidad/precio' }
]

export default function RestaurantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [restaurant, setRestaurant] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [myRating, setMyRating] = useState({
    food: 0, service: 0, atmosphere: 0, price: 0, value: 0, comment: ''
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const load = async () => {
    const data = await getRestaurant(id)
    setRestaurant(data)
    if (data?.ratings?.[user.uid]) {
      setMyRating({
        food: data.ratings[user.uid].food || 0,
        service: data.ratings[user.uid].service || 0,
        atmosphere: data.ratings[user.uid].atmosphere || 0,
        price: data.ratings[user.uid].price || 0,
        value: data.ratings[user.uid].value || 0,
        comment: data.ratings[user.uid].comment || ''
      })
    }
    const allUsers = await getAllUsers()
    setUsers(allUsers)
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleSaveRating = async () => {
    setSaving(true)
    try {
      await rateRestaurant(id, user.uid, {
        ...myRating,
        userName: user.name,
        userPhoto: user.photoURL
      })
      showToast('Calificación guardada')
      await load()
    } catch (err) {
      alert('Error: ' + err.message)
    }
    setSaving(false)
  }

  const handleAddPhoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if ((restaurant.photos?.length || 0) >= 10) {
      alert('Máximo 10 fotos por restaurante')
      return
    }
    try {
      const uploaded = await uploadPhoto(id, file)
      await addPhotoToRestaurant(id, { ...uploaded, uploadedBy: user.uid })
      showToast('Foto agregada')
      await load()
    } catch (err) {
      alert('Error subiendo foto: ' + err.message)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este restaurante? Esta acción no se puede deshacer.')) return
    await deleteRestaurant(id)
    navigate('/')
  }

  if (loading) return <div className="spinner"></div>
  if (!restaurant) return <div className="page"><p>Restaurante no encontrado</p></div>

  const avg = calculateAverages(restaurant.ratings)
  const ratingEntries = Object.entries(restaurant.ratings || {})
  const cover = restaurant.photos?.[0]?.url

  return (
    <div>
      <div className="detail-hero">
        {cover ? <img src={cover} alt={restaurant.name} /> : <div className="card-img-placeholder" style={{ height: '100%' }}>🍽️</div>}
        <button className="detail-back" onClick={() => navigate('/')}>←</button>
      </div>

      <div className="detail-content">
        <h1>{restaurant.name}</h1>
        <div className="detail-meta">
          <span>📍 {restaurant.city}</span>
          {restaurant.location && <span>• {restaurant.location}</span>}
        </div>
        <div className="detail-meta">
          {restaurant.foodType && <span className="tag">{restaurant.foodType}</span>}
          {restaurant.priceLevel && <span className="tag">{'$'.repeat(restaurant.priceLevel)}</span>}
          {restaurant.visitDate && <span className="tag">📅 {restaurant.visitDate}</span>}
        </div>

        <div className="score-big">
          <div className="num">{avg.overall || '—'}</div>
          <div>
            <div style={{ fontWeight: 700 }}>Calificación grupal</div>
            <div className="label-text">{avg.count} {avg.count === 1 ? 'persona ha calificado' : 'personas han calificado'}</div>
          </div>
        </div>

        {restaurant.notes && (
          <>
            <div className="section-title">¿Qué comimos?</div>
            <p style={{ color: 'var(--text-dim)', lineHeight: 1.5 }}>{restaurant.notes}</p>
          </>
        )}

        {/* Galería */}
        <div className="section-title">Fotos ({restaurant.photos?.length || 0}/10)</div>
        <div className="gallery">
          {(restaurant.photos || []).map((p, i) => (
            <img key={i} src={p.url} alt="" onClick={() => window.open(p.url, '_blank')} />
          ))}
          {(restaurant.photos?.length || 0) < 10 && (
            <label className="add-btn" style={{ aspectRatio: 1, height: 'auto', width: '100%' }}>
              +
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAddPhoto} />
            </label>
          )}
        </div>

        {/* Promedios por categoría */}
        {avg.count > 0 && (
          <>
            <div className="section-title">Promedios del grupo</div>
            <div className="card" style={{ padding: '4px 16px' }}>
              {CATEGORIES.map(cat => (
                <div key={cat.key} className="rating-row">
                  <span className="label">{cat.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StarRating value={Math.round(avg[cat.key])} size="small" readOnly />
                    <span style={{ fontWeight: 700, minWidth: 30 }}>{avg[cat.key]}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Mi calificación */}
        <div className="section-title">Mi calificación</div>
        <div className="card" style={{ padding: 16 }}>
          {CATEGORIES.map(cat => (
            <div key={cat.key} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 6, fontWeight: 600 }}>
                {cat.label}
              </div>
              <StarRating
                value={myRating[cat.key]}
                onChange={v => setMyRating({ ...myRating, [cat.key]: v })}
              />
            </div>
          ))}
          <div className="field" style={{ marginTop: 8 }}>
            <label>Comentario (opcional)</label>
            <textarea
              value={myRating.comment}
              onChange={e => setMyRating({ ...myRating, comment: e.target.value })}
              placeholder="¿Qué te pareció?"
            />
          </div>
          <button className="btn" onClick={handleSaveRating} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar mi calificación'}
          </button>
        </div>

        {/* Calificaciones individuales */}
        {ratingEntries.length > 0 && (
          <>
            <div className="section-title">Opiniones del grupo</div>
            {ratingEntries.map(([uid, r]) => {
              const overall = +(((r.food + r.service + r.atmosphere + r.price + r.value) / 5).toFixed(1))
              return (
                <div key={uid} className="user-rating-card">
                  <div className="header">
                    {r.userPhoto ? (
                      <img src={r.userPhoto} className="avatar" alt="" />
                    ) : (
                      <div className="avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {(r.userName || '?')[0]}
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div className="name">{r.userName || 'Usuario'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{overall} ★ promedio</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 13 }}>
                    {CATEGORIES.map(cat => (
                      <div key={cat.key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-dim)' }}>{cat.label}</span>
                        <span style={{ fontWeight: 600 }}>{r[cat.key]} ★</span>
                      </div>
                    ))}
                  </div>
                  {r.comment && <div className="comment">"{r.comment}"</div>}
                </div>
              )
            })}
          </>
        )}

        <button
          className="btn btn-secondary"
          style={{ marginTop: 24, color: 'var(--danger)' }}
          onClick={handleDelete}
        >
          Eliminar restaurante
        </button>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
