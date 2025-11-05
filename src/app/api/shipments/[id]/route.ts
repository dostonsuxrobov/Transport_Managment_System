import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// GET single shipment
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth()
    const { id } = await params

    const shipment = await prisma.shipment.findFirst({
      where: {
        id,
        userId: auth.userId,
      },
    })

    if (!shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(shipment, { status: 200 })
  } catch (error) {
    console.error('Error fetching shipment:', error)

    // Check if it's an authentication error
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please log in to view shipment' },
        { status: 401 }
      )
    }

    // Log detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Detailed error:', errorMessage)

    // Other errors - include more details in development
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to fetch shipment',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

// PUT update shipment
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth()
    const { id } = await params
    const body = await request.json()

    // Check if shipment exists and belongs to user
    const existingShipment = await prisma.shipment.findFirst({
      where: {
        id,
        userId: auth.userId,
      },
    })

    if (!existingShipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    const { trackingId, origin, destination, status, weight, dimensions, description } = body

    // If tracking ID is being changed, check it doesn't already exist
    if (trackingId && trackingId !== existingShipment.trackingId) {
      const duplicateTrackingId = await prisma.shipment.findUnique({
        where: { trackingId },
      })

      if (duplicateTrackingId) {
        return NextResponse.json(
          { error: 'Tracking ID already exists' },
          { status: 400 }
        )
      }
    }

    // Update shipment
    const shipment = await prisma.shipment.update({
      where: { id },
      data: {
        ...(trackingId && { trackingId }),
        ...(origin && { origin }),
        ...(destination && { destination }),
        ...(status && { status }),
        ...(weight !== undefined && { weight: weight ? parseFloat(weight) : null }),
        ...(dimensions !== undefined && { dimensions }),
        ...(description !== undefined && { description }),
      },
    })

    return NextResponse.json(shipment, { status: 200 })
  } catch (error) {
    console.error('Error updating shipment:', error)

    // Check if it's an authentication error
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please log in to update shipment' },
        { status: 401 }
      )
    }

    // Log detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Detailed error:', errorMessage)

    // Other errors - include more details in development
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to update shipment',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

// DELETE shipment
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth()
    const { id } = await params

    // Check if shipment exists and belongs to user
    const existingShipment = await prisma.shipment.findFirst({
      where: {
        id,
        userId: auth.userId,
      },
    })

    if (!existingShipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    // Delete shipment
    await prisma.shipment.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Shipment deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting shipment:', error)

    // Check if it's an authentication error
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please log in to delete shipment' },
        { status: 401 }
      )
    }

    // Log detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Detailed error:', errorMessage)

    // Other errors - include more details in development
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to delete shipment',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
