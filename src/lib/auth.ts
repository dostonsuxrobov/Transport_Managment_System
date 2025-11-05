import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this-in-production'
)

export interface JWTPayload {
  userId: string
  email: string
}

export async function verifyAuth(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as JWTPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export async function requireAuth(): Promise<JWTPayload> {
  const auth = await verifyAuth()

  if (!auth) {
    throw new Error('Unauthorized')
  }

  return auth
}
