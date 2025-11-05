"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Filter, Download, Plus, Pencil, Trash2 } from "lucide-react"
import { initializeStorage, getShipments, createShipment, updateShipment, deleteShipment, getCurrentUser } from "@/lib/clientStorage"

interface Shipment {
  id: string
  trackingId: string
  origin: string
  destination: string
  status: string
  weight?: number | null
  dimensions?: string | null
  description?: string | null
  createdAt: string
  updatedAt: string
}

export default function TablePage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Form states
  const [formData, setFormData] = useState({
    trackingId: "",
    origin: "",
    destination: "",
    status: "Processing",
    weight: "",
    dimensions: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch shipments
  const fetchShipments = () => {
    try {
      setError("")
      initializeStorage()

      // Check if user is logged in
      const currentUser = getCurrentUser()
      if (!currentUser) {
        window.location.href = "/login"
        return
      }

      const data = getShipments()
      setShipments(data)
      setError("")
    } catch (error) {
      console.error("Error fetching shipments:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch shipments"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchShipments()
  }, [])

  // Handle create
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const newShipment = createShipment({
        trackingId: formData.trackingId,
        origin: formData.origin,
        destination: formData.destination,
        status: formData.status,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions || null,
        description: formData.description || null,
      })

      if (!newShipment) {
        setError("Failed to create shipment. Tracking ID might already exist.")
        setIsSubmitting(false)
        return
      }

      setIsCreateOpen(false)
      setFormData({
        trackingId: "",
        origin: "",
        destination: "",
        status: "Processing",
        weight: "",
        dimensions: "",
        description: "",
      })
      fetchShipments()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingShipment) return

    setError("")
    setIsSubmitting(true)

    try {
      const updated = updateShipment(editingShipment.id, {
        trackingId: formData.trackingId,
        origin: formData.origin,
        destination: formData.destination,
        status: formData.status,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions || null,
        description: formData.description || null,
      })

      if (!updated) {
        setError("Failed to update shipment")
        setIsSubmitting(false)
        return
      }

      setIsEditOpen(false)
      setEditingShipment(null)
      fetchShipments()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this shipment?")) return

    try {
      const success = deleteShipment(id)
      if (success) {
        fetchShipments()
      } else {
        console.error("Failed to delete shipment")
      }
    } catch (err) {
      console.error("Error deleting shipment:", err)
    }
  }

  // Open edit dialog
  const openEditDialog = (shipment: Shipment) => {
    setEditingShipment(shipment)
    setFormData({
      trackingId: shipment.trackingId,
      origin: shipment.origin,
      destination: shipment.destination,
      status: shipment.status,
      weight: shipment.weight?.toString() || "",
      dimensions: shipment.dimensions || "",
      description: shipment.description || "",
    })
    setError("")
    setIsEditOpen(true)
  }

  // Filter shipments
  const filteredShipments = shipments.filter((shipment) =>
    shipment.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const ShipmentForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void, isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="trackingId" className="text-sm font-medium">Tracking ID *</label>
        <Input
          id="trackingId"
          value={formData.trackingId}
          onChange={(e) => setFormData({ ...formData, trackingId: e.target.value })}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="origin" className="text-sm font-medium">Origin *</label>
        <Input
          id="origin"
          value={formData.origin}
          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="destination" className="text-sm font-medium">Destination *</label>
        <Input
          id="destination"
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">Status *</label>
        <select
          id="status"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          required
          disabled={isSubmitting}
        >
          <option value="Processing">Processing</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="weight" className="text-sm font-medium">Weight (kg)</label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="dimensions" className="text-sm font-medium">Dimensions</label>
          <Input
            id="dimensions"
            value={formData.dimensions}
            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
            placeholder="e.g., 20x10x5"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isSubmitting}
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Shipment" : "Create Shipment")}
        </Button>
      </DialogFooter>
    </form>
  )
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
            <p className="text-muted-foreground">
              Manage and track all your shipments
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Shipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Shipment</DialogTitle>
                <DialogDescription>
                  Add a new shipment to the system
                </DialogDescription>
              </DialogHeader>
              <ShipmentForm onSubmit={handleCreate} />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Shipments</CardTitle>
                <CardDescription>
                  A list of all shipments including their status and details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Display */}
            {error && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium">Error loading shipments</p>
                  <p className="mt-1">{error}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setError("")
                    setIsLoading(true)
                    fetchShipments()
                  }}
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search shipments..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="text-center py-8">Loading shipments...</div>
            ) : error ? (
              <div className="text-center py-8 text-muted-foreground">
                Unable to load shipments. Please try again.
              </div>
            ) : filteredShipments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {shipments.length === 0 ? "No shipments yet. Create your first shipment!" : "No shipments found matching your search."}
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Tracking ID
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Route
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Status
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Weight
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredShipments.map((shipment) => (
                          <tr key={shipment.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4 align-middle font-medium">
                              {shipment.trackingId}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {shipment.origin}
                                </span>
                                <span className="text-xs">→</span>
                                <span className="text-xs text-muted-foreground">
                                  {shipment.destination}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <Badge
                                variant={
                                  shipment.status === "Delivered"
                                    ? "default"
                                    : shipment.status === "In Transit"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {shipment.status}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle text-muted-foreground">
                              {shipment.weight ? `${shipment.weight} kg` : "-"}
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(shipment)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(shipment.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredShipments.length} of {shipments.length} results
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Shipment</DialogTitle>
            <DialogDescription>
              Update shipment information
            </DialogDescription>
          </DialogHeader>
          <ShipmentForm onSubmit={handleEdit} isEdit />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
