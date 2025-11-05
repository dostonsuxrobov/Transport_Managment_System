import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download } from "lucide-react"

const shipments = [
  {
    id: "SH-001",
    customer: "Acme Corp",
    origin: "New York, NY",
    destination: "Los Angeles, CA",
    status: "In Transit",
    date: "2024-01-15",
    driver: "John Smith",
    revenue: "$1,250",
  },
  {
    id: "SH-002",
    customer: "TechStart Inc",
    origin: "Chicago, IL",
    destination: "Miami, FL",
    status: "Delivered",
    date: "2024-01-14",
    driver: "Sarah Johnson",
    revenue: "$890",
  },
  {
    id: "SH-003",
    customer: "Global Logistics",
    origin: "Houston, TX",
    destination: "Seattle, WA",
    status: "Processing",
    date: "2024-01-16",
    driver: "Mike Brown",
    revenue: "$2,100",
  },
  {
    id: "SH-004",
    customer: "FastShip Co",
    origin: "Boston, MA",
    destination: "Denver, CO",
    status: "In Transit",
    date: "2024-01-15",
    driver: "Emily Davis",
    revenue: "$1,450",
  },
  {
    id: "SH-005",
    customer: "QuickMove LLC",
    origin: "Phoenix, AZ",
    destination: "Portland, OR",
    status: "Delivered",
    date: "2024-01-13",
    driver: "David Wilson",
    revenue: "$1,680",
  },
]

export default function TablePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground">
            Manage and track all your shipments
          </p>
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
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search shipments..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Shipment ID
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Customer
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Route
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Driver
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Status
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Date
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map((shipment) => (
                      <tr key={shipment.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">
                          {shipment.id}
                        </td>
                        <td className="p-4 align-middle">
                          {shipment.customer}
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
                          {shipment.driver}
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
                          {shipment.date}
                        </td>
                        <td className="p-4 align-middle font-medium">
                          {shipment.revenue}
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
                Showing 1 to {shipments.length} of {shipments.length} results
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
