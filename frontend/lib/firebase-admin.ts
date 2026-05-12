const firebaseProjectId = process.env.FIREBASE_PROJECT_ID
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
const firebaseStorageBucket = process.env.FIREBASE_STORAGE_BUCKET

export function isFirebaseConfigured() {
  return Boolean(firebaseProjectId && firebaseClientEmail && firebasePrivateKey)
}

async function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured.")
  }

  const { cert, getApps, initializeApp } = await import("firebase-admin/app")
  const existingApp = getApps()[0]

  if (existingApp) {
    return existingApp
  }

  return initializeApp({
    credential: cert({
      projectId: firebaseProjectId,
      clientEmail: firebaseClientEmail,
      privateKey: firebasePrivateKey,
    }),
    storageBucket: firebaseStorageBucket,
  })
}

export async function getFirebaseDb() {
  const { getFirestore } = await import("firebase-admin/firestore")

  return getFirestore(await getFirebaseApp())
}

export async function getFirebaseBucket() {
  if (!firebaseStorageBucket) {
    return undefined
  }

  const { getStorage } = await import("firebase-admin/storage")

  return getStorage(await getFirebaseApp()).bucket()
}
