# 🍴 Foodie Crew

App PWA mobile-first para que un grupo de amigos registre, califique y rankee restaurantes. Construida con **React + Vite + Firebase**, instalable en iPhone y Android.

## ✨ Funcionalidades

- Login con Google
- Registro de restaurantes (nombre, ciudad, ubicación de referencia, tipo de comida, fecha, notas, nivel de precio)
- Subida de fotos (hasta 10 por restaurante)
- Calificación por 5 categorías: comida, servicio, ambiente, precio, relación calidad/precio
- Comentario opcional por usuario
- Promedios grupales y opiniones individuales
- Rankings (mejores y peores) con filtros por ciudad y tipo de comida
- Búsqueda por nombre
- Lista de deseos personal (restaurantes por visitar)
- PWA instalable, ícono propio, funcionamiento offline básico

## 📁 Estructura

```
foodie-crew/
├── public/                 # Iconos y favicon
├── src/
│   ├── components/         # BottomNav, RestaurantCard, StarRating, PhotoUploader
│   ├── contexts/           # AuthContext (Google login)
│   ├── pages/              # Login, Home, AddRestaurant, RestaurantDetail, Rankings, Wishlist, Profile
│   ├── services/           # restaurants.js (CRUD Firestore + Storage)
│   ├── firebase.js         # Inicialización de Firebase
│   ├── App.jsx             # Rutas
│   ├── main.jsx            # Entry point
│   └── index.css           # Estilos globales (mobile-first, dark theme)
├── firestore.rules         # Reglas de seguridad Firestore
├── storage.rules           # Reglas de seguridad Storage
├── vite.config.js          # Configuración Vite + PWA
├── .env.example            # Variables de entorno de ejemplo
└── package.json
```

---

## 🚀 Paso 1: Configurar Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com/) y crea un proyecto nuevo (ej: `foodie-crew`).
2. Una vez creado, en el menú izquierdo:

### a) Authentication
- Entra a **Build → Authentication → Get started**.
- En la pestaña **Sign-in method**, habilita **Google**.
- Pon un nombre de proyecto público y un correo de soporte.

### b) Firestore Database
- Entra a **Build → Firestore Database → Create database**.
- Elige modo **Producción** y la región más cercana (ej: `nam5` o `southamerica-east1`).
- Cuando se cree, ve a la pestaña **Rules** y pega el contenido del archivo `firestore.rules` de este repo. Publica.

### c) Storage
- Entra a **Build → Storage → Get started**.
- Acepta las reglas por defecto (las cambiamos en seguida).
- Ve a la pestaña **Rules** y pega el contenido del archivo `storage.rules`. Publica.

### d) Registrar la app web
- En el panel principal del proyecto, haz click en el ícono **`</>`** (Web) para registrar una nueva app web.
- Pon un nombre (ej: `foodie-crew-web`) y registra (no necesitas Hosting por ahora).
- Firebase te mostrará un objeto `firebaseConfig` con valores. **Cópialos**, los necesitas en el siguiente paso.

### e) Autorizar dominios
- En **Authentication → Settings → Authorized domains**, agrega `localhost` (ya viene) y luego tu dominio de Vercel cuando lo despliegues (ej: `foodie-crew.vercel.app`).

---

## 💻 Paso 2: Correr en local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env con tus credenciales de Firebase
cp .env.example .env
# Edita .env y pega los valores del firebaseConfig que te dio Firebase

# 3. Correr en modo desarrollo
npm run dev
```

Abre `http://localhost:5173` en tu navegador. Inicia sesión con Google y empieza a agregar restaurantes.

---

## 🌍 Paso 3: Desplegar en Vercel

1. Sube el código a un repositorio de GitHub.
2. Ve a [vercel.com](https://vercel.com/) y haz **Import Project** desde GitHub.
3. Vercel detecta automáticamente que es Vite. **No cambies nada** del build command.
4. En **Environment Variables**, agrega las mismas 6 variables de tu archivo `.env`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Click en **Deploy**. En 1-2 minutos tendrás tu URL pública.
6. **Importante:** vuelve a Firebase → Authentication → Settings → Authorized domains, y agrega tu dominio de Vercel.

---

## 📱 Paso 4: Instalar en el celular (PWA)

### iPhone (Safari)
1. Abre la URL de Vercel en **Safari** (no Chrome).
2. Toca el ícono de **compartir** (cuadrado con flecha hacia arriba).
3. Desplázate y toca **"Agregar a pantalla de inicio"**.
4. Confirma el nombre y toca **Agregar**.
5. La app aparece como un ícono nativo en tu pantalla de inicio.

### Android (Chrome)
1. Abre la URL en **Chrome**.
2. Aparecerá un banner que dice **"Instalar app"** (o ve al menú ⋮ → "Instalar app" / "Agregar a pantalla principal").
3. Confirma. Listo, queda como app nativa.

---

## 👥 Paso 5: Compartir con tus 3 amigos

Solo comparte la URL de Vercel. Cada uno entra, inicia sesión con Google y ya queda registrado en el grupo. Todos ven los mismos restaurantes y todos pueden calificar.

> **Nota:** Las reglas actuales permiten a cualquier usuario autenticado leer y escribir. Si quieres restringirlo solo a tus 4 amigos, edita `firestore.rules` y `storage.rules` agregando una whitelist de UIDs:
>
> ```javascript
> function isAllowedUser() {
>   return request.auth.uid in [
>     'UID_USUARIO_1',
>     'UID_USUARIO_2',
>     'UID_USUARIO_3',
>     'UID_USUARIO_4'
>   ];
> }
> ```
>
> Y reemplaza `isAuth()` por `isAllowedUser()` en cada regla. Los UIDs los encuentras en Firebase → Authentication → Users después de que cada uno haya iniciado sesión por primera vez.

---

## 🛠 Stack

- **React 18** + **Vite 5**
- **React Router 6** para navegación
- **Firebase 10** (Auth, Firestore, Storage)
- **vite-plugin-pwa** para el service worker y manifest
- CSS puro mobile-first con variables CSS y dark theme

## 📝 Notas finales

- El diseño está pensado mobile-first; en desktop se centra a 600px.
- Las fotos se comprimen del lado del cliente solo si las subes ya optimizadas. Si quieres compresión automática puedes agregar `browser-image-compression` (1 línea de cambio en `PhotoUploader.jsx`).
- El cache offline funciona para la UI y las imágenes ya cargadas. Para crear restaurantes sí necesitas conexión.
- Si quieres más miembros más adelante, no necesitas cambiar nada del código: el sistema escala automáticamente.

---

¡Buen provecho! 🍴
