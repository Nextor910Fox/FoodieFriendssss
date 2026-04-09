import { useNavigate } from 'react-router-dom'
import { calculateAverages } from '../services/restaurants'

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate()
  const avg = calculateAverages(restaurant.ratings)
  const cover = restaurant.photos?.[0]?.url

  return (
    <div className="card" onClick={() => navigate(`/restaurante/${restaurant.id}`)}>
      {cover ? (
        <img src={cover} alt={restaurant.name} className="card-img" />
      ) : (
        <div className="card-img-placeholder">🍽️</div>
      )}
      <div className="card-body">
        <div className="card-title">{restaurant.name}</div>
        <div className="card-meta">
          <span>📍 {restaurant.city}</span>
          {restaurant.foodType && <span className="tag">{restaurant.foodType}</span>}
          {restaurant.priceLevel && <span className="tag">{'$'.repeat(restaurant.priceLevel)}</span>}
        </div>
        <div className="card-rating">
          <span className="score">{avg.overall || '—'} ★</span>
          <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>
            {avg.count} {avg.count === 1 ? 'calificación' : 'calificaciones'}
          </span>
        </div>
      </div>
    </div>
  )
}
