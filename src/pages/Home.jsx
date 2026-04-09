import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { listRestaurants, calculateAverages } from '../services/restaurants'
import RestaurantCard from '../components/RestaurantCard'

export default function Home() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('todas')
  const navigate = useNavigate()

  useEffect(() => {
    listRestaurants().then(data => {
      setRestaurants(data)
      setLoading(false)
    })
  }, [])

  const cities = useMemo(() => {
    const set = new Set(restaurants.map(r => r.city).filter(Boolean))
    return ['todas', ...Array.from(set)]
  }, [restaurants])

  const filtered = useMemo(() => {
    return restaurants.filter(r => {
      const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase())
      const matchCity = cityFilter === 'todas' || r.city === cityFilter
      return matchSearch && matchCity
    })
  }, [restaurants, search, cityFilter])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Foodie Crew</h1>
          <div className="subtitle">{restaurants.length} restaurantes registrados</div>
        </div>
      </div>

      <div className="search-bar">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Buscar restaurante..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-chips">
        {cities.map(c => (
          <button
            key={c}
            className={`chip ${cityFilter === c ? 'active' : ''}`}
            onClick={() => setCityFilter(c)}
          >
            {c === 'todas' ? 'Todas las ciudades' : c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🍽️</div>
          <h3>Sin restaurantes aún</h3>
          <p>Toca el botón + para agregar el primero</p>
        </div>
      ) : (
        filtered.map(r => <RestaurantCard key={r.id} restaurant={r} />)
      )}

      <button className="fab" onClick={() => navigate('/agregar')}>+</button>
    </div>
  )
}
