import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { loginWithGoogle } = useAuth()

  return (
    <div className="login-screen">
      <div className="login-logo">🍴</div>
      <h1>Foodie Crew</h1>
      <p>Restaurantes y rankings entre amigos</p>
      <button className="btn" onClick={loginWithGoogle} style={{ maxWidth: 320 }}>
        <span>Iniciar sesión con Google</span>
      </button>
      <p style={{ marginTop: 24, fontSize: 12 }}>
        Inicia sesión para empezar a calificar restaurantes con tu grupo
      </p>
    </div>
  )
}
