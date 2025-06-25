import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/Navbar"
import {
    TrendingUp,
    TrendingDown,
    BarChart3,
    DollarSign,
    Activity,
    Clock,
    Target,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    Shield,
    Users,
    PieChart,
    LineChart,
    Calendar,
} from "lucide-react"

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Neon Grid Background */}
            <div className="absolute inset-0 opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
            linear-gradient(rgba(255, 0, 255, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.5) 1px, transparent 1px)
          `,
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            {/* Neon Glowing Orbs */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" />

            {/* Navigation */}
            <Navbar />

            {/* Header Section */}
            <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <Badge className="bg-black border-2 border-pink-400 text-pink-400 font-bold uppercase tracking-wider px-6 py-2 text-sm shadow-lg shadow-pink-400/50 mb-6">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Trading Dashboard
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                        <span className="text-white drop-shadow-lg">TRADING</span>
                        <br />
                        <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse drop-shadow-2xl">
                            DASHBOARD
                        </span>
                    </h1>

                    <p className="text-xl text-cyan-300 max-w-2xl mx-auto font-medium">
                        Monitor your gas hedging positions, track performance, and manage your portfolio in real-time
                    </p>
                </div>
            </section>

            {/* Stats Overview */}
            <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Portfolio Value */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg blur opacity-30" />
                        <Card className="relative bg-black/90 border-2 border-green-400 backdrop-blur-sm shadow-lg shadow-green-400/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-400 text-sm font-medium uppercase tracking-wider">Portfolio Value</p>
                                        <p className="text-white text-2xl font-bold">$124,567</p>
                                        <div className="flex items-center text-green-400 text-sm mt-2">
                                            <ArrowUpRight className="w-4 h-4 mr-1" />
                                            <span>+12.5%</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/50">
                                        <DollarSign className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Active Positions */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-30" />
                        <Card className="relative bg-black/90 border-2 border-blue-400 backdrop-blur-sm shadow-lg shadow-blue-400/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-400 text-sm font-medium uppercase tracking-wider">Active Positions</p>
                                        <p className="text-white text-2xl font-bold">8</p>
                                        <div className="flex items-center text-blue-400 text-sm mt-2">
                                            <Activity className="w-4 h-4 mr-1" />
                                            <span>3 expiring soon</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Total P&L */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-30" />
                        <Card className="relative bg-black/90 border-2 border-purple-400 backdrop-blur-sm shadow-lg shadow-purple-400/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-400 text-sm font-medium uppercase tracking-wider">Total P&L</p>
                                        <p className="text-white text-2xl font-bold">$23,456</p>
                                        <div className="flex items-center text-green-400 text-sm mt-2">
                                            <ArrowUpRight className="w-4 h-4 mr-1" />
                                            <span>+18.7%</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Win Rate */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg blur opacity-30" />
                        <Card className="relative bg-black/90 border-2 border-yellow-400 backdrop-blur-sm shadow-lg shadow-yellow-400/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-yellow-400 text-sm font-medium uppercase tracking-wider">Win Rate</p>
                                        <p className="text-white text-2xl font-bold">78.5%</p>
                                        <div className="flex items-center text-yellow-400 text-sm mt-2">
                                            <Shield className="w-4 h-4 mr-1" />
                                            <span>Last 30 days</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/50">
                                        <PieChart className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Charts and Detailed Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* P&L Chart */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-30" />
                        <Card className="relative bg-black/90 border-2 border-cyan-400 backdrop-blur-sm shadow-lg shadow-cyan-400/30">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                                        <LineChart className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-xl font-bold">P&L Performance</CardTitle>
                                        <CardDescription className="text-cyan-400 font-medium uppercase tracking-wider text-sm">
                                            Last 30 Days
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-400/30 flex items-center justify-center">
                                    <div className="text-center">
                                        <LineChart className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                                        <p className="text-cyan-400 font-medium">Interactive Chart</p>
                                        <p className="text-gray-400 text-sm">P&L visualization coming soon</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Trades */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-30" />
                        <Card className="relative bg-black/90 border-2 border-pink-400 backdrop-blur-sm shadow-lg shadow-pink-400/30">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/50">
                                        <Activity className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-xl font-bold">Recent Trades</CardTitle>
                                        <CardDescription className="text-pink-400 font-medium uppercase tracking-wider text-sm">
                                            Last 24 Hours
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-pink-900/20 rounded border-l-4 border-green-400">
                                        <div>
                                            <p className="text-white font-medium">ETH Gas Call</p>
                                            <p className="text-pink-400 text-sm">Strike: 25 Gwei</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-green-400 font-bold">+$1,234</p>
                                            <p className="text-gray-400 text-sm">2h ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-pink-900/20 rounded border-l-4 border-red-400">
                                        <div>
                                            <p className="text-white font-medium">Base Gas Put</p>
                                            <p className="text-pink-400 text-sm">Strike: 0.001 ETH</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-red-400 font-bold">-$567</p>
                                            <p className="text-gray-400 text-sm">4h ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-pink-900/20 rounded border-l-4 border-green-400">
                                        <div>
                                            <p className="text-white font-medium">Blob Fees Call</p>
                                            <p className="text-pink-400 text-sm">Strike: 0.0001 ETH</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-green-400 font-bold">+$890</p>
                                            <p className="text-gray-400 text-sm">6h ago</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Active Positions Table */}
                <div className="mt-12">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg blur opacity-30" />
                        <Card className="relative bg-black/90 border-2 border-green-400 backdrop-blur-sm shadow-lg shadow-green-400/30">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/50">
                                        <Target className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-xl font-bold">Active Positions</CardTitle>
                                        <CardDescription className="text-green-400 font-medium uppercase tracking-wider text-sm">
                                            Manage your open options
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-green-400/30">
                                                <th className="text-left py-3 px-4 text-green-400 font-medium uppercase tracking-wider">Option</th>
                                                <th className="text-left py-3 px-4 text-green-400 font-medium uppercase tracking-wider">Type</th>
                                                <th className="text-left py-3 px-4 text-green-400 font-medium uppercase tracking-wider">Strike</th>
                                                <th className="text-left py-3 px-4 text-green-400 font-medium uppercase tracking-wider">P&L</th>
                                                <th className="text-left py-3 px-4 text-green-400 font-medium uppercase tracking-wider">Expiry</th>
                                                <th className="text-left py-3 px-4 text-green-400 font-medium uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-green-400/20">
                                            <tr>
                                                <td className="py-3 px-4 text-white font-medium">ETH Gas Weekly Call</td>
                                                <td className="py-3 px-4"><Badge className="bg-green-900/50 border-green-400 text-green-400">CALL</Badge></td>
                                                <td className="py-3 px-4 text-white">25 Gwei</td>
                                                <td className="py-3 px-4 text-green-400 font-bold">+$2,345</td>
                                                <td className="py-3 px-4 text-cyan-400">3 days</td>
                                                <td className="py-3 px-4"><Button size="sm" className="bg-green-500 hover:bg-green-400 text-white">Close</Button></td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 text-white font-medium">Base Gas Weekly Put</td>
                                                <td className="py-3 px-4"><Badge className="bg-red-900/50 border-red-400 text-red-400">PUT</Badge></td>
                                                <td className="py-3 px-4 text-white">0.001 ETH</td>
                                                <td className="py-3 px-4 text-red-400 font-bold">-$890</td>
                                                <td className="py-3 px-4 text-cyan-400">5 days</td>
                                                <td className="py-3 px-4"><Button size="sm" className="bg-red-500 hover:bg-red-400 text-white">Close</Button></td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 px-4 text-white font-medium">Blob Fees Weekly Call</td>
                                                <td className="py-3 px-4"><Badge className="bg-green-900/50 border-green-400 text-green-400">CALL</Badge></td>
                                                <td className="py-3 px-4 text-white">0.0001 ETH</td>
                                                <td className="py-3 px-4 text-green-400 font-bold">+$1,567</td>
                                                <td className="py-3 px-4 text-cyan-400">1 day</td>
                                                <td className="py-3 px-4"><Button size="sm" className="bg-green-500 hover:bg-green-400 text-white">Close</Button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
} 