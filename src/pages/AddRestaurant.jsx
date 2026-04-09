import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRestaurant, uploadPhoto, addPhotoToRestaurant } from '../services/restaurants'
import PhotoUploader from '../components/PhotoUploader'
import { useAuth } from '../contexts/AuthContext'

const FOOD_TYPES = [
  'Colombiana',
  'Mexicana',
  'Peruana',
  'Argentina',
  'Venezolana',
  'Brasilera',
  'Italiana',
  'Pizza',
  'Española',
  'Francesa',
  'Mediterránea',
  'Sushi / Japonesa',
  'China',
  'Tailandesa',
  'Coreana',
  'India',
  'Vietnamita',
  'BBQ / Parrilla',
  'Hamburguesas',
  'Pollo',
  'Alitas',
  'Mariscos',
  'Ceviches',
  'Desayunos / Brunch',
  'Cafetería',
  'Panadería',
  'Postres',
  'Heladería',
  'Vegetariana / Vegana',
  'Saludable',
  'Fusión',
  'Árabe / Mediterránea',
  'Internacional',
  'Comida rápida',
  'Otro'
]

export default function AddRestaurant() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: '',
    city: '',
    location: '',
    foodType: '',
    visitDate: new Date().toISOString().slice(0, 10),
    notes: '',
    priceLevel: 2
  })
  const [photos, setPhotos] = useState([])
  const [saving, setSaving] = useState(false)

  const update = (k, v) => setForm({ ...form, [k]: v })

  const handleSubmit = async () => {
    if (!form.name || !form.city) {
      alert('Nombre y ciudad son obligatorios')
      return
    }
    setSaving(true)
    try {
      const id = await createRestaurant({
        ...form,
        priceLevel: Number(form.priceLevel),
        createdBy: user.uid,
        createdByName: user.name
      })

      for (const p of photos) {
        if (p.file) {
          const uploaded = await uploadPhoto(id, p.file)
          await addPhotoToRestaurant(id, { ...uploaded, uploadedBy: user.uid })
        }
      }

      navigate(`/restaurante/${id}`)
    } catch (err) {
      console.error(err)
      alert('Error: ' + err.message)
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} style={{ fontSize: 22 }}>←</button>
        <h1 style={{ fontSize: 22 }}>Nuevo restaurante</h1>
        <div style={{ width: 22 }}></div>
      </div>

      <div className="field">
        <label>Nombre *</label>
        <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Ej: La Casa del Camarón" />
      </div>

      <div className="field">
        <label>Ciudad *</label>
        <input value={form.city} onChange={e => update('city', e.target.value)} placeholder="Ej: Medellín" />
      </div>

      <div className="field">
        <label>Ubicación de referencia</label>
        <input value={form.location} onChange={e => update('location', e.target.value)} placeholder="Ej: Cerca al Parque Lleras" />
      </div>

      <div className="field">
        <label>Tipo de comida</label>
        <select value={form.foodType} onChange={e => update('foodType', e.target.value)}>
          <option value="">Selecciona un tipo...</option>
          {FOOD_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Fecha de la visita</label>
        <input type="date" value={form.visitDate} onChange={e => update('visitDate', e.target.value)} />
      </div>

      <div className="field">
        <label>Nivel de precio</label>
        <select value={form.priceLevel} onChange={e => update('priceLevel', e.target.value)}>
          <option value="1">$ — Económico</option>
          <option value="2">$$ — Moderado</option>
          <option value="3">$$$ — Caro</option>
          <option value="4">$$$$ — Muy caro</option>
        </select>
      </div>

      <div className="field">
        <label>¿Qué pidieron? (notas)</label>
        <textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Pedimos ceviche, langostinos al ajillo..." />
      </div>

      <div className="field">
        <label>Fotos (máx 8)</label>
        <PhotoUploader photos={photos} onChange={setPhotos} max={8} />
      </div>

      <button className="btn" onClick={handleSubmit} disabled={saving}>
        {saving ? 'Guardando...' : 'Guardar restaurante'}
      </button>
    </div>
  )
}
