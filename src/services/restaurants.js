import {
  collection, addDoc, getDocs, doc, getDoc, updateDoc,
  deleteDoc, query, orderBy, setDoc
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase'

const COL = 'restaurants'

export async function createRestaurant(data) {
  const docRef = await addDoc(collection(db, COL), {
    ...data,
    createdAt: new Date().toISOString(),
    photos: data.photos || [],
    ratings: {}
  })
  return docRef.id
}

export async function listRestaurants() {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getRestaurant(id) {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function updateRestaurant(id, data) {
  await updateDoc(doc(db, COL, id), data)
}

export async function deleteRestaurant(id) {
  await deleteDoc(doc(db, COL, id))
}

export async function rateRestaurant(restaurantId, userId, rating) {
  const ref = doc(db, COL, restaurantId)
  await updateDoc(ref, {
    [`ratings.${userId}`]: {
      ...rating,
      updatedAt: new Date().toISOString()
    }
  })
}

export async function uploadPhoto(restaurantId, file) {
  const filename = `${Date.now()}_${file.name}`
  const path = `restaurants/${restaurantId}/${filename}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return { url, path }
}

export async function addPhotoToRestaurant(restaurantId, photo) {
  const restaurant = await getRestaurant(restaurantId)
  const photos = [...(restaurant.photos || []), photo]
  await updateRestaurant(restaurantId, { photos })
}

export function calculateAverages(ratings) {
  const ratingValues = Object.values(ratings || {})
  if (ratingValues.length === 0) {
    return { food: 0, service: 0, atmosphere: 0, price: 0, value: 0, overall: 0, count: 0 }
  }
  const sum = ratingValues.reduce((acc, r) => ({
    food: acc.food + (r.food || 0),
    service: acc.service + (r.service || 0),
    atmosphere: acc.atmosphere + (r.atmosphere || 0),
    price: acc.price + (r.price || 0),
    value: acc.value + (r.value || 0)
  }), { food: 0, service: 0, atmosphere: 0, price: 0, value: 0 })

  const count = ratingValues.length
  const avg = {
    food: +(sum.food / count).toFixed(1),
    service: +(sum.service / count).toFixed(1),
    atmosphere: +(sum.atmosphere / count).toFixed(1),
    price: +(sum.price / count).toFixed(1),
    value: +(sum.value / count).toFixed(1),
    count
  }
  avg.overall = +(((avg.food + avg.service + avg.atmosphere + avg.price + avg.value) / 5).toFixed(1))
  return avg
}

// Wishlist
export async function addToWishlist(userId, item) {
  const wishRef = doc(db, 'wishlists', userId)
  const snap = await getDoc(wishRef)
  const items = snap.exists() ? snap.data().items || [] : []
  items.push({ ...item, id: Date.now().toString(), createdAt: new Date().toISOString() })
  await setDoc(wishRef, { items })
}

export async function getWishlist(userId) {
  const wishRef = doc(db, 'wishlists', userId)
  const snap = await getDoc(wishRef)
  if (!snap.exists()) return []
  return snap.data().items || []
}

export async function removeFromWishlist(userId, itemId) {
  const wishRef = doc(db, 'wishlists', userId)
  const snap = await getDoc(wishRef)
  if (!snap.exists()) return
  const items = (snap.data().items || []).filter(i => i.id !== itemId)
  await setDoc(wishRef, { items })
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
