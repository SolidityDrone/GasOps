import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import {
  TrendingUp,
  Zap,
  Shield,
  Target,
  BarChart3,
  Layers,
  Wallet,
  ArrowRight,
  Cpu,
  Network,
  DollarSign,
  Activity,
  Radio,
  Power,
  Quote,
} from "lucide-react"

// Custom Gas Station Icon Component
const GasStationIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H14A2,2 0 0,0 16,20V15H17L19,13V7A1,1 0 0,0 18,6H17V4A2,2 0 0,0 15,2H14M14,4V12H6V4H14M6,14H14V20H6V14M17,8H18V12H17V8Z" />
  </svg>
)

export default function Component() {
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

      {/* Navigation - Neon Bar */}
      <Navbar />

      {/* Hero Section - Neon Cyberpunk */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Badge className="bg-black border-2 border-cyan-400 text-cyan-400 font-bold uppercase tracking-wider px-6 py-2 text-sm shadow-lg shadow-cyan-400/50">
                <GasStationIcon className="w-4 h-4 mr-2" />
                Neon Gas Derivatives
              </Badge>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-pink-400 rounded-lg blur opacity-30 animate-pulse" />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            <span className="text-white drop-shadow-lg">HEDGE AGAINST</span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse drop-shadow-2xl">
              GAS VOLATILITY
            </span>
          </h1>

          <div className="max-w-3xl mx-auto mb-12 p-6 bg-black/80 border-2 border-pink-500 rounded-lg backdrop-blur-sm shadow-lg shadow-pink-500/30">
            <p className="text-xl text-white leading-relaxed font-medium">
              <span className="text-pink-400">▶</span> Trade call and put options on weekly Ethereum gas averages
              <br />
              <span className="text-cyan-400">▶</span> Blob fees and L2 costs optimization protocol
              <br />
              <span className="text-green-400">▶</span> Designed for HFT traders | Infrastructure providers | dApp
              developers
            </p>
          </div>

          <div className="flex justify-center">
            <Link href="/markets">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 text-white border-2 border-pink-400 font-black uppercase tracking-wider px-16 py-6 text-xl shadow-2xl shadow-pink-500/50 hover:shadow-pink-500/75 transition-all duration-300 group"
              >
                <Power className="mr-4 w-8 h-8 animate-pulse" />
                Launch App
                <ArrowRight className="ml-4 w-8 h-8 group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Chainlink Integration Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            POWERED BY
            <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              {" "}
              CHAINLINK
            </span>
          </h2>
          <p className="text-xl text-cyan-300 max-w-3xl mx-auto font-medium">
            <span className="text-pink-400">▶</span> Automated options market orchestration using Chainlink Functions
            and Automation
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Chainlink Functions */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30" />
              <Card className="relative bg-black/90 border-2 border-blue-400 backdrop-blur-sm shadow-lg shadow-blue-400/30">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl font-bold">Chainlink Functions</CardTitle>
                      <CardDescription className="text-blue-400 font-medium uppercase tracking-wider text-sm">
                        Data Processing Engine
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-blue-900/20 p-4 rounded border-l-4 border-blue-400">
                      <h4 className="text-blue-400 font-bold text-sm mb-2 uppercase tracking-wide">
                        Weekly Gas Average Calculation
                      </h4>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        Fetches gas price data from multiple Ethereum nodes and calculates 7-day rolling averages. This
                        creates reliable benchmarks for option strike prices, eliminating manipulation risks from single
                        data sources.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-blue-400 font-medium text-sm">
                        <Target className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                        <span>Multi-source gas price aggregation</span>
                      </div>
                      <div className="flex items-center text-blue-400 font-medium text-sm">
                        <BarChart3 className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                        <span>Statistical outlier filtering</span>
                      </div>
                      <div className="flex items-center text-blue-400 font-medium text-sm">
                        <Shield className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                        <span>Tamper-proof computation</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chainlink Automation */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-lg blur opacity-30" />
              <Card className="relative bg-black/90 border-2 border-pink-400 backdrop-blur-sm shadow-lg shadow-pink-400/30">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/50">
                      <Power className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl font-bold">Chainlink Automation</CardTitle>
                      <CardDescription className="text-pink-400 font-medium uppercase tracking-wider text-sm">
                        Market Operations
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-pink-900/20 p-4 rounded border-l-4 border-pink-400">
                      <h4 className="text-pink-400 font-bold text-sm mb-2 uppercase tracking-wide">
                        Automated Order Book Management
                      </h4>
                      <p className="text-pink-100 text-sm leading-relaxed">
                        Triggers option settlements, updates strike prices, and rebalances liquidity pools based on
                        predefined conditions. Ensures 24/7 market operations without manual intervention, critical for
                        global gas price hedging.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-pink-400 font-medium text-sm">
                        <Radio className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                        <span>Automatic option expiry settlement</span>
                      </div>
                      <div className="flex items-center text-pink-400 font-medium text-sm">
                        <Network className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                        <span>Dynamic strike price updates</span>
                      </div>
                      <div className="flex items-center text-pink-400 font-medium text-sm">
                        <DollarSign className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                        <span>Liquidity pool rebalancing</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Process Explanation */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-pink-500 to-purple-500 rounded-2xl blur opacity-20" />
            <div className="relative bg-black/90 border-2 border-cyan-400 rounded-2xl p-8 backdrop-blur-sm shadow-lg shadow-cyan-400/30">
              <h3 className="text-3xl font-black text-white mb-6 text-center uppercase tracking-wider">How It Works</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/50 border-2 border-red-400">
                    <span className="text-white font-black text-xl">1</span>
                  </div>
                  <h4 className="text-red-400 font-bold text-lg mb-2 uppercase tracking-wide">Data Collection</h4>
                  <p className="text-red-100 text-sm leading-relaxed">
                    Chainlink Functions fetch gas prices from multiple Ethereum nodes every hour, calculating 7-day
                    rolling averages to establish fair market benchmarks.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50 border-2 border-blue-400">
                    <span className="text-white font-black text-xl">2</span>
                  </div>
                  <h4 className="text-blue-400 font-bold text-lg mb-2 uppercase tracking-wide">Strike Matching</h4>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Options are created with strike prices based on current weekly averages. Traders can buy calls
                    (betting gas goes up) or puts (betting gas goes down).
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50 border-2 border-green-400">
                    <span className="text-white font-black text-xl">3</span>
                  </div>
                  <h4 className="text-green-400 font-bold text-lg mb-2 uppercase tracking-wide">Auto Settlement</h4>
                  <p className="text-green-100 text-sm leading-relaxed">
                    Chainlink Automation triggers settlements when options expire, comparing final gas averages to
                    strike prices and distributing payouts automatically.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-purple-900/20 rounded-lg border-l-4 border-purple-400">
                <h4 className="text-purple-400 font-bold text-lg mb-3 text-center uppercase tracking-wide">
                  Why This Matters
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-purple-100 leading-relaxed mb-2">
                      <span className="text-purple-400">▶</span> <strong>Predictable Costs:</strong> Infrastructure
                      providers can hedge against gas spikes, ensuring predictable operational expenses for oracle
                      updates, L2 batching, and DAO operations.
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-100 leading-relaxed">
                      <span className="text-purple-400">▶</span> <strong>Risk Management:</strong> HFT traders and dApp
                      developers can protect their treasuries from gas volatility, enabling better budget planning and
                      user experience optimization.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Beneficiaries Cards - Neon Panels */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            BUILT FOR THE FUTURE OF
            <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              {" "}
              ETHEREUM
            </span>
          </h2>
          <p className="text-xl text-cyan-300 max-w-3xl mx-auto font-medium">
            <span className="text-pink-400">▶</span> Designed for the most demanding users in the Ethereum ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* HFT & Infrastructure */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur opacity-30" />
            <Card className="relative bg-black/90 border-2 border-red-400 backdrop-blur-sm shadow-lg shadow-red-400/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/50">
                      <Cpu className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 font-bold text-xs uppercase tracking-wider">STATUS</div>
                    <div className="text-green-400 font-bold text-xs uppercase tracking-wider animate-pulse">
                      ONLINE
                    </div>
                  </div>
                </div>
                <CardTitle className="text-white text-2xl font-black uppercase tracking-wide">
                  High Frequency Traders
                </CardTitle>
                <CardDescription className="text-red-400 font-medium uppercase tracking-wider">
                  Infrastructure Providers L1
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-red-900/20 p-4 rounded border-l-4 border-red-400 mb-4">
                  <p className="text-red-100 text-sm leading-relaxed">
                    <span className="text-red-400">▶</span> Cost average gas prices long term
                    <br />
                    <span className="text-red-400">▶</span> Sophisticated hedging strategies
                    <br />
                    <span className="text-red-400">▶</span> Exact risk parameters matching
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-red-400 font-medium text-sm">
                    <Target className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                    <span>Precision risk management</span>
                  </div>
                  <div className="flex items-center text-red-400 font-medium text-sm">
                    <BarChart3 className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                    <span>Advanced analytics suite</span>
                  </div>
                  <div className="flex items-center text-red-400 font-medium text-sm">
                    <TrendingUp className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                    <span>Long term cost averaging</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* L2 Batching */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30" />
            <Card className="relative bg-black/90 border-2 border-blue-400 backdrop-blur-sm shadow-lg shadow-blue-400/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                      <Layers className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                  </div>
                  <div className="text-right">
                    <div className="text-blue-400 font-bold text-xs uppercase tracking-wider">STATUS</div>
                    <div className="text-green-400 font-bold text-xs uppercase tracking-wider animate-pulse">
                      ACTIVE
                    </div>
                  </div>
                </div>
                <CardTitle className="text-white text-2xl font-black uppercase tracking-wide">
                  L2 Batch Operators
                </CardTitle>
                <CardDescription className="text-blue-400 font-medium uppercase tracking-wider">
                  Layer 2 Batching on L1
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-900/20 p-4 rounded border-l-4 border-blue-400 mb-4">
                  <p className="text-blue-100 text-sm leading-relaxed">
                    <span className="text-blue-400">▶</span> Hedge against L1 settlement costs
                    <br />
                    <span className="text-blue-400">▶</span> Blob fee volatility protection
                    <br />
                    <span className="text-blue-400">▶</span> Optimize batch timing predictably
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-blue-400 font-medium text-sm">
                    <Network className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                    <span>Batch optimization engine</span>
                  </div>
                  <div className="flex items-center text-blue-400 font-medium text-sm">
                    <Shield className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                    <span>Settlement protection layer</span>
                  </div>
                  <div className="flex items-center text-blue-400 font-medium text-sm">
                    <Zap className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                    <span>Blob fee hedging protocol</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* dApp Developers */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg blur opacity-30" />
            <Card className="relative bg-black/90 border-2 border-green-400 backdrop-blur-sm shadow-lg shadow-green-400/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/50">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-xs uppercase tracking-wider">STATUS</div>
                    <div className="text-green-400 font-bold text-xs uppercase tracking-wider animate-pulse">READY</div>
                  </div>
                </div>
                <CardTitle className="text-white text-2xl font-black uppercase tracking-wide">
                  dApp Developers
                </CardTitle>
                <CardDescription className="text-green-400 font-medium uppercase tracking-wider">
                  Transaction Sponsors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-900/20 p-4 rounded border-l-4 border-green-400 mb-4">
                  <p className="text-green-100 text-sm leading-relaxed">
                    <span className="text-green-400">▶</span> Sponsor tx costs embedded wallets
                    <br />
                    <span className="text-green-400">▶</span> Predictable budget management
                    <br />
                    <span className="text-green-400">▶</span> Treasury protection gas spikes
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-green-400 font-medium text-sm">
                    <DollarSign className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                    <span>Budget protection system</span>
                  </div>
                  <div className="flex items-center text-green-400 font-medium text-sm">
                    <Shield className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                    <span>Treasury hedging module</span>
                  </div>
                  <div className="flex items-center text-green-400 font-medium text-sm">
                    <Wallet className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                    <span>UX optimization focus</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Infrastructure Protocols */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg blur opacity-30" />
            <Card className="relative bg-black/90 border-2 border-yellow-400 backdrop-blur-sm shadow-lg shadow-yellow-400/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/50">
                      <Network className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold text-xs uppercase tracking-wider">STATUS</div>
                    <div className="text-green-400 font-bold text-xs uppercase tracking-wider animate-pulse">LIVE</div>
                  </div>
                </div>
                <CardTitle className="text-white text-2xl font-black uppercase tracking-wide">
                  Infrastructure Protocols
                </CardTitle>
                <CardDescription className="text-yellow-400 font-medium uppercase tracking-wider">
                  Coprocessors Oracles DAOs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-900/20 p-4 rounded border-l-4 border-yellow-400 mb-4">
                  <p className="text-yellow-100 text-sm leading-relaxed">
                    <span className="text-yellow-400">▶</span> Hedge operational transaction costs
                    <br />
                    <span className="text-yellow-400">▶</span> Oracle update frequency optimization
                    <br />
                    <span className="text-yellow-400">▶</span> DAO governance execution budgets
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-yellow-400 font-medium text-sm">
                    <Activity className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                    <span>Operational cost hedging</span>
                  </div>
                  <div className="flex items-center text-yellow-400 font-medium text-sm">
                    <Radio className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                    <span>Oracle feed optimization</span>
                  </div>
                  <div className="flex items-center text-yellow-400 font-medium text-sm">
                    <Power className="w-4 h-4 mr-3 animate-pulse flex-shrink-0" />
                    <span>Protocol sustainability</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section - Neon Grid */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            ADVANCED GAS
            <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              {" "}
              DERIVATIVES
            </span>
          </h2>
          <p className="text-xl text-cyan-300 max-w-3xl mx-auto font-medium">
            <span className="text-pink-400">▶</span> Comprehensive options trading on Ethereum critical metrics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30" />
            <Card className="relative bg-black/90 border-2 border-blue-400 backdrop-blur-sm shadow-lg shadow-blue-400/30">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/50">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg font-bold text-center uppercase tracking-wide">
                  Weekly Gas Avg
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-blue-400 text-sm font-medium">7 day rolling gas price options</p>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-30" />
            <Card className="relative bg-black/90 border-2 border-purple-400 backdrop-blur-sm shadow-lg shadow-purple-400/30">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/50">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg font-bold text-center uppercase tracking-wide">
                  Blob Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-purple-400 text-sm font-medium">EIP-4844 blob fee volatility</p>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur opacity-30" />
            <Card className="relative bg-black/90 border-2 border-red-400 backdrop-blur-sm shadow-lg shadow-red-400/30">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-500/50">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg font-bold text-center uppercase tracking-wide">
                  Call Put Options
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-red-400 text-sm font-medium">Customizable strike trading</p>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg blur opacity-30" />
            <Card className="relative bg-black/90 border-2 border-green-400 backdrop-blur-sm shadow-lg shadow-green-400/30">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-500/50">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg font-bold text-center uppercase tracking-wide">
                  Risk Management
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-green-400 text-sm font-medium">Portfolio hedging controls</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-20" />
          <div className="relative bg-black/90 border-2 border-pink-400 rounded-2xl p-12 text-center backdrop-blur-sm shadow-lg shadow-pink-400/30">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
              READY TO START
              <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                {" "}
                HEDGING?
              </span>
            </h2>
            <p className="text-xl text-cyan-300 mb-12 max-w-3xl mx-auto font-medium">
              <span className="text-pink-400">▶</span> Join the future of gas price risk management on Ethereum
            </p>
            <Link href="/markets">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 text-white border-2 border-pink-400 font-black uppercase tracking-wider px-16 py-6 text-xl shadow-2xl shadow-pink-500/50 hover:shadow-pink-500/75 transition-all duration-300 group"
              >
                <Power className="mr-4 w-8 h-8 animate-pulse" />
                Launch Protocol
                <ArrowRight className="ml-4 w-8 h-8 group-hover:translate-x-2 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Neon Testimonials Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            WHAT OUR
            <span className="bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              {" "}
              USERS
            </span>{" "}
            SAY
          </h2>
          <p className="text-xl text-cyan-300 max-w-3xl mx-auto font-medium">
            <span className="text-pink-400">▶</span> Real testimonials from satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* HFT Testimonial */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur opacity-30" />
            <Card className="relative bg-black/90 border-2 border-red-400 backdrop-blur-sm shadow-lg shadow-red-400/30">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/50">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg font-bold">Marcus T.</CardTitle>
                    <CardDescription className="text-red-400 font-medium uppercase tracking-wider text-sm">
                      Senior Quantitative Analyst
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-red-100 text-sm leading-relaxed italic">
                  "Finally, a protocol that understands our pain. Gas spikes used to destroy our quarterly P&L faster
                  than a rug pull. Now we can actually hedge our operational costs like civilized human beings instead
                  of praying to the MEV gods."
                </p>
              </CardContent>
            </Card>
          </div>

          {/* L2 Operator Testimonial */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30" />
            <Card className="relative bg-black/90 border-2 border-blue-400 backdrop-blur-sm shadow-lg shadow-blue-400/30">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg font-bold">Sarah K.</CardTitle>
                    <CardDescription className="text-blue-400 font-medium uppercase tracking-wider text-sm">
                      L2 Infrastructure Lead
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100 text-sm leading-relaxed italic">
                  "Our batch settlement costs were more volatile than my ex's mood swings. GasOps gave us the
                  predictability we needed to actually plan our operations beyond next Tuesday. Revolutionary stuff,
                  really."
                </p>
              </CardContent>
            </Card>
          </div>

          {/* dApp Developer Testimonial */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg blur opacity-30" />
            <Card className="relative bg-black/90 border-2 border-green-400 backdrop-blur-sm shadow-lg shadow-green-400/30">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/50">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg font-bold">Alex R.</CardTitle>
                    <CardDescription className="text-green-400 font-medium uppercase tracking-wider text-sm">
                      DeFi Protocol Founder
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-green-100 text-sm leading-relaxed italic">
                  "Sponsoring user transactions used to be like playing Russian roulette with our treasury. Now we can
                  budget for gas costs without having panic attacks every time Ethereum gets congested. Our CFO actually
                  smiles now."
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Oracle Provider Testimonial */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg blur opacity-30" />
            <Card className="relative bg-black/90 border-2 border-yellow-400 backdrop-blur-sm shadow-lg shadow-yellow-400/30">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/50">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg font-bold">Jamie L.</CardTitle>
                    <CardDescription className="text-yellow-400 font-medium uppercase tracking-wider text-sm">
                      Oracle Network Operator
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-100 text-sm leading-relaxed italic">
                  "Our oracle updates were costing more than a small country's GDP during gas spikes. GasOps let us
                  hedge these costs so we can focus on delivering accurate data instead of calculating if we can afford
                  the next price feed update."
                </p>
              </CardContent>
            </Card>
          </div>

          {/* DAO Treasury Manager Testimonial */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-30" />
            <Card className="relative bg-black/90 border-2 border-purple-400 backdrop-blur-sm shadow-lg shadow-purple-400/30">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg font-bold">Taylor M.</CardTitle>
                    <CardDescription className="text-purple-400 font-medium uppercase tracking-wider text-sm">
                      DAO Treasury Manager
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-purple-100 text-sm leading-relaxed italic">
                  "Governance proposals were failing because execution costs exceeded the proposal value. Now we can
                  hedge our governance operations and actually execute the will of our token holders without going
                  bankrupt."
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Infrastructure Provider Testimonial */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-30" />
            <Card className="relative bg-black/90 border-2 border-cyan-400 backdrop-blur-sm shadow-lg shadow-cyan-400/30">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg font-bold">Morgan P.</CardTitle>
                    <CardDescription className="text-cyan-400 font-medium uppercase tracking-wider text-sm">
                      Infrastructure Engineer
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-cyan-100 text-sm leading-relaxed italic">
                  "Running infrastructure on Ethereum felt like feeding quarters into a broken slot machine. GasOps gave
                  us the risk management tools we needed to run sustainable operations instead of gambling with every
                  transaction."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 font-medium text-sm italic">
            * Testimonials may contain traces of sarcasm and actual user pain points
          </p>
        </div>
      </section>

      {/* Footer - Neon Terminal */}
      <footer className="relative z-10 border-t-2 border-pink-500 bg-black/90 backdrop-blur-md shadow-lg shadow-pink-500/20">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/50 border-2 border-pink-400">
                  <GasStationIcon className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
              </div>
              <div>
                <span className="text-white font-bold text-lg bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  GasOps
                </span>
                <div className="text-xs text-green-400 font-bold uppercase tracking-wider animate-pulse">
                  System Online
                </div>
              </div>
            </div>
            <p className="text-cyan-400 text-sm font-medium text-center sm:text-right">
              © 2024 GasOps Protocol | Built for Ethereum
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
