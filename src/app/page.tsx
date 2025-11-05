import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RevenueChart } from "@/components/revenue-chart"
import { TrendingUp, TrendingDown, Package, Truck, Users, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Shipments",
    value: "142",
    change: "+12.5%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Fleet Vehicles",
    value: "28",
    change: "-2.3%",
    trend: "down",
    icon: Truck,
  },
  {
    title: "Total Drivers",
    value: "48",
    change: "+8.2%",
    trend: "up",
    icon: Users,
  },
]

const recentShipments = [
  { id: "SH-001", destination: "New York, NY", status: "In Transit", progress: 65 },
  { id: "SH-002", destination: "Los Angeles, CA", status: "Delivered", progress: 100 },
  { id: "SH-003", destination: "Chicago, IL", status: "Processing", progress: 20 },
  { id: "SH-004", destination: "Houston, TX", status: "In Transit", progress: 45 },
]

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your fleet.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {stat.change}
                    </span>
                    <span>from last month</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <RevenueChart />

          <Card>
            <CardHeader>
              <CardTitle>Recent Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentShipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{shipment.id}</p>
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
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {shipment.destination}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${shipment.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {shipment.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
