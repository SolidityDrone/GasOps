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
    Settings,
    Download,
    RefreshCw,
} from "lucide-react"

export default function PortfolioPage() {
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
                    <Badge className="bg-black border-2 border-purple-400 text-purple-400 font-bold uppercase tracking-wider px-6 py-2 text-sm shadow-lg shadow-purple-400/50 mb-6">
                        <Wallet className="w-4 h-4 mr-2" />
                        Portfolio Management
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                        <span className="text-white drop-shadow-lg">MY</span>
                        <br />
                        <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse drop-shadow-2xl">
                            PORTFOLIO
                        </span>
                    </h1>

                    <p className="text-xl text-cyan-300 max-w-2xl mx-auto font-medium">
                        Comprehensive portfolio overview with detailed analytics, risk management, and performance tracking
                    </p>
                </div>
            </section>

            {/* Portfolio Overview */}
            <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Total Value */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg blur opacity-30" />
                        <Card className="relative bg-black/90 border-2 border-emerald-400 backdrop-blur-sm shadow-lg shadow-emerald-400/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider">Total Value</p>
                                        <p className="text-white text-2xl font-bold">$156,789</p>
                                        <div className="flex items-center text-emerald-400 text-sm mt-2">
                                            <ArrowUpRight className="w-4 h-4 mr-1" />
                                            <span>+15.3%</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/50">
                                        <DollarSign className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Total P&L */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-30" />
                        <Card className="relative bg-black/90 border-2 border-cyan-400 backdrop-blur-sm shadow-lg shadow-cyan-400/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-cyan-400 text-sm font-medium uppercase tracking-wider">Total P&L</p>
                                        <p className="text-white text-2xl font-bold">$34,567</p>
                                        <div className="flex items-center text-cyan-400 text-sm mt-2">
                                            <TrendingUp className="w-4 h-4 mr-1" />
                                            <span>+28.2%</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                                        <BarChart3 className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Risk Score */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg blur opacity-30" />
                        <Card className="relative bg-black/90 border-2 border-yellow-400 backdrop-blur-sm shadow-lg shadow-yellow-400/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-yellow-400 text-sm font-medium uppercase tracking-wider">Risk Score</p>
                                        <p className="text-white text-2xl font-bold">Medium</p>
                                        <div className="flex items-center text-yellow-400 text-sm mt-2">
                                            <Shield className="w-4 h-4 mr-1" />
                                            <span>Balanced</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/50">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Win Rate */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-30" />
                        <Card className="relative bg-black/90 border-2 border-pink-400 backdrop-blur-sm shadow-lg shadow-pink-400/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-pink-400 text-sm font-medium uppercase tracking-wider">Win Rate</p>
                                        <p className="text-white text-2xl font-bold">82.4%</p>
                                        <div className="flex items-center text-pink-400 text-sm mt-2">
                                            <Target className="w-4 h-4 mr-1" />
                                            <span>Last 90 days</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/50">
                                        <PieChart className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Portfolio Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Asset Allocation */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-30" />
                        <Card className="relative bg-black/90 border-2 border-indigo-400 backdrop-blur-sm shadow-lg shadow-indigo-400/30">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/50">
                                            <PieChart className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-white text-xl font-bold">Asset Allocation</CardTitle>
                                            <CardDescription className="text-indigo-400 font-medium uppercase tracking-wider text-sm">
                                                Portfolio Distribution
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button size="sm" className="bg-indigo-500 hover:bg-indigo-400 text-white">
                                        <RefreshCw className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-indigo-900/20 rounded border-l-4 border-green-400">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                            <span className="text-white font-medium">Call Options</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-bold">45.2%</p>
                                            <p className="text-indigo-400 text-sm">$70,890</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-indigo-900/20 rounded border-l-4 border-red-400">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                            <span className="text-white font-medium">Put Options</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-bold">32.8%</p>
                                            <p className="text-indigo-400 text-sm">$51,456</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-indigo-900/20 rounded border-l-4 border-blue-400">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                            <span className="text-white font-medium">Cash</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-bold">22.0%</p>
                                            <p className="text-indigo-400 text-sm">$34,443</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Chart */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-30" />
                        <Card className="relative bg-black/90 border-2 border-cyan-400 backdrop-blur-sm shadow-lg shadow-cyan-400/30">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                                            <LineChart className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-white text-xl font-bold">Performance</CardTitle>
                                            <CardDescription className="text-cyan-400 font-medium uppercase tracking-wider text-sm">
                                                Last 12 Months
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-white">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-400/30 flex items-center justify-center">
                                    <div className="text-center">
                                        <LineChart className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                                        <p className="text-cyan-400 font-medium">Performance Chart</p>
                                        <p className="text-gray-400 text-sm">Interactive visualization coming soon</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg blur opacity-30" />
                    <Card className="relative bg-black/90 border-2 border-green-400 backdrop-blur-sm shadow-lg shadow-green-400/30">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/50">
                                        <Activity className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white text-xl font-bold">Transaction History</CardTitle>
                                        <CardDescription className="text-green-400 font-medium uppercase tracking-wider text-sm">
                                            Recent portfolio activity
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button size="sm" className="bg-green-500 hover:bg-green-400 text-white">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export
                                    </Button>
                                    <Button size="sm" className="bg-green-500 hover:bg-green-400 text-white">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-green-400/30">
                                            <th className="text-left py-3 px-4 text-green-400 font-medium uppercase tracking-wider">Date</th>
                                            <th className="text-left py-3 px-4 text-green-400 font-medium uppercase tracking-wider">Type</th>
                                            <th className="text-left py-3 px-4 text-green-400 font-medium uppercase tracking-wider">Asset</th>
                                            <th className="text-left py-3 px-4 text-green-400 font-medium uppercase tracking-wider">Amount</th>
                                            <th className="text-left py-3 px-4 text-green-400 font-medium uppercase tracking-wider">Price</th>
                                            <th className="text-left py-3 px-4 text-green-400 font-medium uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-green-400/20">
                                        <tr>
                                            <td className="py-3 px-4 text-white">2024-01-15</td>
                                            <td className="py-3 px-4"><Badge className="bg-green-900/50 border-green-400 text-green-400">BUY</Badge></td>
                                            <td className="py-3 px-4 text-white">ETH Gas Call</td>
                                            <td className="py-3 px-4 text-white">0.5 ETH</td>
                                            <td className="py-3 px-4 text-white">$2,450</td>
                                            <td className="py-3 px-4"><Badge className="bg-green-900/50 border-green-400 text-green-400">Completed</Badge></td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4 text-white">2024-01-14</td>
                                            <td className="py-3 px-4"><Badge className="bg-red-900/50 border-red-400 text-red-400">SELL</Badge></td>
                                            <td className="py-3 px-4 text-white">Base Gas Put</td>
                                            <td className="py-3 px-4 text-white">0.3 ETH</td>
                                            <td className="py-3 px-4 text-white">$1,890</td>
                                            <td className="py-3 px-4"><Badge className="bg-green-900/50 border-green-400 text-green-400">Completed</Badge></td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4 text-white">2024-01-13</td>
                                            <td className="py-3 px-4"><Badge className="bg-green-900/50 border-green-400 text-green-400">BUY</Badge></td>
                                            <td className="py-3 px-4 text-white">Blob Fees Call</td>
                                            <td className="py-3 px-4 text-white">0.2 ETH</td>
                                            <td className="py-3 px-4 text-white">$1,234</td>
                                            <td className="py-3 px-4"><Badge className="bg-green-900/50 border-green-400 text-green-400">Completed</Badge></td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4 text-white">2024-01-12</td>
                                            <td className="py-3 px-4"><Badge className="bg-red-900/50 border-red-400 text-red-400">SELL</Badge></td>
                                            <td className="py-3 px-4 text-white">L2 Gas Put</td>
                                            <td className="py-3 px-4 text-white">0.4 ETH</td>
                                            <td className="py-3 px-4 text-white">$2,100</td>
                                            <td className="py-3 px-4"><Badge className="bg-yellow-900/50 border-yellow-400 text-yellow-400">Pending</Badge></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
} 