import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { listRestaurants, calculateAverages } from '../services/restaurants'

export default function Rankings() {
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('top') // top | worst
  const [cityFilter, setCityFilter] = useState('todas')
  const [foodFilter, setFoodFilter] = useState('todas')

  useEffect(() => {
    listRestaurants().then(data => {
      setRestaurants(data)
      setLoading(false)
    })
  }, [])

  const cities = useMemo(() => ['todas', ...new Set(restaurants.map(r => r.city).filter(Boolean))], [restaurants])
  const foodTypes = useMemo(() => ['todas', ...new Set(restaurants.map(r => r.foodType).filter(Boolean))], [restaurants])

  const ranked = useMemo(() => {
    const withScores = restaurants
      .map(r => ({ ...r, avg: calculateAverages(r.ratings) }))
      .filter(r => r.avg.count > 0)
      .filter(r => cityFilter === 'todas' || r.city === cityFilter)
      .filter(r => foodFilter === 'todas' || r.foodType === foodFilter)

    return withScores.sort((a, b) =>
      mode === 'top' ? b.avg.overall - a.avg.overall : a.avg.overall - b.avg.overall
    )
  }, [restaurants, mode, cityFilter, foodFilter])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Rankings</h1>
          <div className="subtitle">Los mejores y peores del grupo</div>
        </div>
      </div>

      <div className="filter-chips">
        <button className={`chip ${mode === 'top' ? 'active' : ''}`} onClick={() => setMode('top')}>
          🏆 Mejores
        </button>
        <button className={`chip ${mode === 'worst' ? 'active' : ''}`} onClick={() => setMode('worst')}>
          👎 Peores
        </button>
      </div>

      <div className="filter-chips">
        {cities.map(c => (
          <button key={c} className={`chip ${cityFilter === c ? 'active' : ''}`} onClick={() => setCityFilter(c)}>
            {c === 'todas' ? 'Todas las ciudades' : c}
          </button>
        ))}
      </div>

      <div className="filter-chips">
        {foodTypes.map(f => (
          <button key={f} className={`chip ${foodFilter === f ? 'active' : ''}`} onClick={() => setFoodFilter(f)}>
            {f === 'todas' ? 'Todos los tipos' : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : ranked.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🏆</div>
          <h3>Sin rankings aún</h3>
          <p>Califica restaurantes para verlos aquí</p>
        </div>
      ) : (
        ranked.map((r, idx) => (
          <div key={r.id} className="rank-item" onClick={() => navigate(`/restaurante/${r.id}`)}>
            <div className="position">#{idx + 1}</div>
            <div className="info">
              <div className="name">{r.name}</div>
              <div className="meta">{r.city} · {r.foodType || 'Sin categoría'} · {r.avg.count} {r.avg.count === 1 ? 'voto' : 'votos'}</div>
            </div>
            <div className="score">{r.avg.overall} ★</div>
          </div>
        ))
      )}
    </div>
  )
}
