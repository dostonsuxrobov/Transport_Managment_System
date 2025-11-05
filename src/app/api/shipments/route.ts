import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET all shipments for authenticated user
export async function GET() {
  try {
    const auth = await requireAuth()

    const shipments = await prisma.shipment.findMany({
      where: {
        userId: auth.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(shipments, { status: 200 })
  } catch (error) {
    console.error('Error fetching shipments:', error)
    return NextResponse.json(
      { error: 'Unauthorized or internal server error' },
      { status: 401 }
    )
  }
}

// POST create new shipment
export async function POST(request: Request) {
  try {
    const auth = await requireAuth()
    const body = await request.json()

    const { trackingId, origin, destination, status, weight, dimensions, description } = body

    // Validate required fields
    if (!trackingId || !origin || !destination || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: trackingId, origin, destination, status' },
        { status: 400 }
      )
    }

    // Check if tracking ID already exists
    const existingShipment = await prisma.shipment.findUnique({
      where: { trackingId },
    })

    if (existingShipment) {
      return NextResponse.json(
        { error: 'Tracking ID already exists' },
        { status: 400 }
      )
    }

    // Create shipment
    const shipment = await prisma.shipment.create({
      data: {
        trackingId,
        origin,
        destination,
        status,
        weight: weight ? parseFloat(weight) : null,
        dimensions,
        description,
        userId: auth.userId,
      },
    })

    return NextResponse.json(shipment, { status: 201 })
  } catch (error) {
    console.error('Error creating shipment:', error)
    return NextResponse.json(
      { error: 'Unauthorized or internal server error' },
      { status: 401 }
    )
  }
}
