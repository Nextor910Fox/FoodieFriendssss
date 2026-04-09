import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Home from './pages/Home'
import AddRestaurant from './pages/AddRestaurant'
import RestaurantDetail from './pages/RestaurantDetail'
import Rankings from './pages/Rankings'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'
import BottomNav from './components/BottomNav'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="spinner"></div>
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agregar" element={<AddRestaurant />} />
        <Route path="/restaurante/:id" element={<RestaurantDetail />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/lista-deseos" element={<Wishlist />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <BottomNav />
    </div>
  )
}
