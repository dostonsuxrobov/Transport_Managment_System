// Client-side storage for static GitHub Pages deployment
// This replaces the API routes and Prisma database

export interface User {
  id: string
  email: string
  name: string
  password?: string
}

export interface Shipment {
  id: string
  trackingId: string
  origin: string
  destination: string
  status: string
  weight?: number | null
  dimensions?: string | null
  description?: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

// Initialize demo data
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    // Password is "demo123" - in real app this would be hashed
    password: 'demo123',
  },
]

const DEMO_SHIPMENTS: Shipment[] = [
  {
    id: '1',
    trackingId: 'TRK001',
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    status: 'In Transit',
    weight: 25.5,
    dimensions: '12x10x8',
    description: 'Electronics Package',
    userId: '1',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    trackingId: 'TRK002',
    origin: 'Chicago, IL',
    destination: 'Miami, FL',
    status: 'Delivered',
    weight: 15.2,
    dimensions: '8x6x4',
    description: 'Documents',
    userId: '1',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: '3',
    trackingId: 'TRK003',
    origin: 'Seattle, WA',
    destination: 'Boston, MA',
    status: 'Pending',
    weight: 40.0,
    dimensions: '20x15x10',
    description: 'Furniture Parts',
    userId: '1',
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
]

// Storage keys
const STORAGE_KEYS = {
  USERS: 'tms_users',
  SHIPMENTS: 'tms_shipments',
  CURRENT_USER: 'tms_current_user',
  INITIALIZED: 'tms_initialized',
}

// Initialize storage with demo data
export function initializeStorage() {
  if (typeof window === 'undefined') return

  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)
  if (!initialized) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS))
    localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(DEMO_SHIPMENTS))
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
  }
}

// Auth functions
export function login(email: string, password: string): User | null {
  if (typeof window === 'undefined') return null

  const usersJson = localStorage.getItem(STORAGE_KEYS.USERS)
  const users: User[] = usersJson ? JSON.parse(usersJson) : DEMO_USERS

  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    const { password: _, ...userWithoutPassword } = user
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword))
    return userWithoutPassword
  }

  return null
}

export function register(email: string, password: string, name: string): User | null {
  if (typeof window === 'undefined') return null

  const usersJson = localStorage.getItem(STORAGE_KEYS.USERS)
  const users: User[] = usersJson ? JSON.parse(usersJson) : []

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return null
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    password,
    name,
  }

  users.push(newUser)
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))

  const { password: _, ...userWithoutPassword } = newUser
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword))
  return userWithoutPassword
}

export function logout() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null

  const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return userJson ? JSON.parse(userJson) : null
}

// Shipments functions
export function getShipments(): Shipment[] {
  if (typeof window === 'undefined') return []

  const currentUser = getCurrentUser()
  if (!currentUser) return []

  const shipmentsJson = localStorage.getItem(STORAGE_KEYS.SHIPMENTS)
  const allShipments: Shipment[] = shipmentsJson ? JSON.parse(shipmentsJson) : []

  return allShipments
    .filter((s) => s.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getShipment(id: string): Shipment | null {
  if (typeof window === 'undefined') return null

  const shipments = getShipments()
  return shipments.find((s) => s.id === id) || null
}

export function createShipment(data: Omit<Shipment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Shipment | null {
  if (typeof window === 'undefined') return null

  const currentUser = getCurrentUser()
  if (!currentUser) return null

  const shipmentsJson = localStorage.getItem(STORAGE_KEYS.SHIPMENTS)
  const allShipments: Shipment[] = shipmentsJson ? JSON.parse(shipmentsJson) : []

  // Check if tracking ID already exists
  if (allShipments.find((s) => s.trackingId === data.trackingId)) {
    return null
  }

  const newShipment: Shipment = {
    ...data,
    id: Date.now().toString(),
    userId: currentUser.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  allShipments.push(newShipment)
  localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(allShipments))

  return newShipment
}

export function updateShipment(id: string, data: Partial<Omit<Shipment, 'id' | 'userId' | 'createdAt'>>): Shipment | null {
  if (typeof window === 'undefined') return null

  const currentUser = getCurrentUser()
  if (!currentUser) return null

  const shipmentsJson = localStorage.getItem(STORAGE_KEYS.SHIPMENTS)
  const allShipments: Shipment[] = shipmentsJson ? JSON.parse(shipmentsJson) : []

  const index = allShipments.findIndex((s) => s.id === id && s.userId === currentUser.id)
  if (index === -1) return null

  allShipments[index] = {
    ...allShipments[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(allShipments))

  return allShipments[index]
}

export function deleteShipment(id: string): boolean {
  if (typeof window === 'undefined') return false

  const currentUser = getCurrentUser()
  if (!currentUser) return false

  const shipmentsJson = localStorage.getItem(STORAGE_KEYS.SHIPMENTS)
  const allShipments: Shipment[] = shipmentsJson ? JSON.parse(shipmentsJson) : []

  const filtered = allShipments.filter((s) => !(s.id === id && s.userId === currentUser.id))

  if (filtered.length === allShipments.length) return false

  localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(filtered))
  return true
}
