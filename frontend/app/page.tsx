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
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-8 flex justify-center">
            <Badge className="bg-gray-900 border border-gray-700 text-gray-300 font-medium px-6 py-2 text-sm">
              <GasStationIcon className="w-4 h-4 mr-2" />
              Gas Derivatives Protocol
            </Badge>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            <span className="text-white">HEDGE AGAINST</span>
            <br />
            <span className="text-gray-400">GAS VOLATILITY</span>
          </h1>

          <div className="max-w-3xl mx-auto mb-12 p-6 bg-gray-900/50 border border-gray-800 rounded-lg backdrop-blur-sm">
            <p className="text-xl text-gray-300 leading-relaxed">
              <span className="text-white">•</span> Trade call and put options on weekly Ethereum gas averages
              <br />
              <span className="text-white">•</span> Blob fees and L2 costs optimization protocol
              <br />
              <span className="text-white">•</span> Designed for HFT traders | Infrastructure providers | dApp
              developers
            </p>
          </div>

          <div className="flex justify-center">
            <Link href="/markets">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-100 text-black border border-gray-300 font-bold px-16 py-6 text-xl transition-all duration-300 group"
              >
                <Power className="mr-4 w-6 h-6" />
                Launch App
                <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-1 transition-transform" />
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
            <span className="text-gray-400"> CHAINLINK</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Automated options market orchestration using Chainlink Functions and Automation
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Chainlink Functions */}
            <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl font-bold">Chainlink Functions</CardTitle>
                    <CardDescription className="text-gray-400 font-medium">Data Processing Engine</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 rounded border-l-4 border-gray-600">
                    <h4 className="text-gray-300 font-bold text-sm mb-2">Expiration Settlement Calculation</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      At option expiration, fetches gas price data from multiple Ethereum nodes and calculates Daily,
                      Weekly, or Monthly averages based on the option's timeframe. This creates reliable settlement
                      benchmarks, eliminating manipulation risks from single data sources.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Target className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span>Multi-source gas price aggregation</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <BarChart3 className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span>Daily/Weekly/Monthly average options</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Shield className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span>Tamper-proof computation</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chainlink Automation */}
            <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Power className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl font-bold">Chainlink Automation</CardTitle>
                    <CardDescription className="text-gray-400 font-medium">Market Operations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 rounded border-l-4 border-gray-600">
                    <h4 className="text-gray-300 font-bold text-sm mb-2">Automated Order Book Management</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Triggers option settlements, updates strike prices, and rebalances liquidity pools based on
                      predefined conditions. Efficiently manages the queue ensuring Functions execution is made on
                      point. Ensures 24/7 market operations without manual intervention, critical for global gas price
                      hedging.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Radio className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span>Automatic option expiry settlement</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Network className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span>Dynamic strike price updates</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <DollarSign className="w-4 h-4 mr-3 flex-shrink-0" />
                      <span>Liquidity pool rebalancing</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Process Explanation */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl font-black text-white mb-6 text-center">How It Works</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h4 className="text-gray-300 font-bold text-lg mb-2">Data Collection</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  At option expiration, Chainlink Functions fetch gas prices from multiple Ethereum nodes, calculating
                  Daily, Weekly, or Monthly averages based on the option's timeframe to establish fair settlement
                  benchmarks.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h4 className="text-gray-300 font-bold text-lg mb-2">Strike Matching</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Options are created with strike prices based on current weekly averages. Traders can buy calls
                  (betting gas goes up) or puts (betting gas goes down).
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h4 className="text-gray-300 font-bold text-lg mb-2">Auto Settlement</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Chainlink Automation triggers settlements when options expire, comparing final gas averages to strike
                  prices and distributing payouts automatically.
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-800/50 rounded-lg border-l-4 border-gray-600">
              <h4 className="text-gray-300 font-bold text-lg mb-3 text-center">Why This Matters</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 leading-relaxed mb-2">
                    <span className="text-white">•</span> <strong>Predictable Costs:</strong> Infrastructure providers
                    can hedge against gas spikes, ensuring predictable operational expenses for oracle updates, L2
                    batching, and DAO operations.
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 leading-relaxed">
                    <span className="text-white">•</span> <strong>Risk Management:</strong> HFT traders and dApp
                    developers can protect their treasuries from gas volatility, enabling better budget planning and
                    user experience optimization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Beneficiaries Cards */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            BUILT FOR THE FUTURE OF
            <span className="text-gray-400"> ETHEREUM</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Designed for the most demanding users in the Ethereum ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* HFT & Infrastructure */}
          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-gray-400 font-medium text-xs">STATUS</div>
                  <div className="text-green-400 font-medium text-xs">ONLINE</div>
                </div>
              </div>
              <CardTitle className="text-white text-2xl font-bold">High Frequency Traders</CardTitle>
              <CardDescription className="text-gray-400 font-medium">Infrastructure Providers L1</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800/50 p-4 rounded border-l-4 border-gray-600 mb-4">
                <p className="text-gray-400 text-sm leading-relaxed">
                  • Cost average gas prices long term
                  <br />• Sophisticated hedging strategies
                  <br />• Exact risk parameters matching
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-400 text-sm">
                  <Target className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Precision risk management</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <BarChart3 className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Advanced analytics suite</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <TrendingUp className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Long term cost averaging</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* L2 Batching */}
          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-gray-400 font-medium text-xs">STATUS</div>
                  <div className="text-green-400 font-medium text-xs">ACTIVE</div>
                </div>
              </div>
              <CardTitle className="text-white text-2xl font-bold">L2 Batch Operators</CardTitle>
              <CardDescription className="text-gray-400 font-medium">Layer 2 Batching on L1</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800/50 p-4 rounded border-l-4 border-gray-600 mb-4">
                <p className="text-gray-400 text-sm leading-relaxed">
                  • Hedge against L1 settlement costs
                  <br />• Blob fee volatility protection
                  <br />• Optimize batch timing predictably
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-400 text-sm">
                  <Network className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Batch optimization engine</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Shield className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Settlement protection layer</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Zap className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Blob fee hedging protocol</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* dApp Developers */}
          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-gray-400 font-medium text-xs">STATUS</div>
                  <div className="text-green-400 font-medium text-xs">READY</div>
                </div>
              </div>
              <CardTitle className="text-white text-2xl font-bold">dApp Developers</CardTitle>
              <CardDescription className="text-gray-400 font-medium">Transaction Sponsors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800/50 p-4 rounded border-l-4 border-gray-600 mb-4">
                <p className="text-gray-400 text-sm leading-relaxed">
                  • Sponsor tx costs embedded wallets
                  <br />• Predictable budget management
                  <br />• Treasury protection gas spikes
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-400 text-sm">
                  <DollarSign className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Budget protection system</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Shield className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Treasury hedging module</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Wallet className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>UX optimization focus</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Infrastructure Protocols */}
          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Network className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-gray-400 font-medium text-xs">STATUS</div>
                  <div className="text-green-400 font-medium text-xs">LIVE</div>
                </div>
              </div>
              <CardTitle className="text-white text-2xl font-bold">Infrastructure Protocols</CardTitle>
              <CardDescription className="text-gray-400 font-medium">Coprocessors Oracles DAOs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800/50 p-4 rounded border-l-4 border-gray-600 mb-4">
                <p className="text-gray-400 text-sm leading-relaxed">
                  • Hedge operational transaction costs
                  <br />• Oracle update frequency optimization
                  <br />• DAO governance execution budgets
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-400 text-sm">
                  <Activity className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Operational cost hedging</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Radio className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Oracle feed optimization</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Power className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>Protocol sustainability</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            ADVANCED GAS
            <span className="text-gray-400"> DERIVATIVES</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive options trading on Ethereum critical metrics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white text-lg font-bold text-center">Gas Averages</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-gray-400 text-sm">Daily/Weekly/Monthly gas price options</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white text-lg font-bold text-center">Blob Fees</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-gray-400 text-sm">EIP-4844 blob fee volatility</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white text-lg font-bold text-center">Call Put Options</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-gray-400 text-sm">Customizable strike trading</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center pb-3">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white text-lg font-bold text-center">Risk Management</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-gray-400 text-sm">Portfolio hedging controls</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center backdrop-blur-sm">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
            READY TO START
            <span className="text-gray-400"> HEDGING?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Join the future of gas price risk management on Ethereum
          </p>
          <Link href="/markets">
            <Button
              size="lg"
              className="bg-white hover:bg-gray-100 text-black border border-gray-300 font-bold px-16 py-6 text-xl transition-all duration-300 group"
            >
              <Power className="mr-4 w-6 h-6" />
              Launch Protocol
              <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            WHAT OUR
            <span className="text-gray-400"> USERS</span> SAY
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">Real testimonials from satisfied customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* HFT Testimonial */}
          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Quote className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg font-bold">Marcus T.</CardTitle>
                  <CardDescription className="text-gray-400 font-medium text-sm">
                    Senior Quantitative Analyst
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                "Finally, a protocol that understands our pain. Gas spikes used to destroy our quarterly P&L faster than
                a rug pull. Now we can actually hedge our operational costs like civilized human beings instead of
                praying to the MEV gods."
              </p>
            </CardContent>
          </Card>

          {/* L2 Operator Testimonial */}
          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Quote className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg font-bold">Sarah K.</CardTitle>
                  <CardDescription className="text-gray-400 font-medium text-sm">
                    L2 Infrastructure Lead
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                "Our batch settlement costs were more volatile than my ex's mood swings. GasOps gave us the
                predictability we needed to actually plan our operations beyond next Tuesday. Revolutionary stuff,
                really."
              </p>
            </CardContent>
          </Card>

          {/* dApp Developer Testimonial */}
          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Quote className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg font-bold">Alex R.</CardTitle>
                  <CardDescription className="text-gray-400 font-medium text-sm">DeFi Protocol Founder</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                "Sponsoring user transactions used to be like playing Russian roulette with our treasury. Now we can
                budget for gas costs without having panic attacks every time Ethereum gets congested. Our CFO actually
                smiles now."
              </p>
            </CardContent>
          </Card>

          {/* Oracle Provider Testimonial */}
          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Quote className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg font-bold">Jamie L.</CardTitle>
                  <CardDescription className="text-gray-400 font-medium text-sm">
                    Oracle Network Operator
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                "Our oracle updates were costing more than a small country's GDP during gas spikes. GasOps let us hedge
                these costs so we can focus on delivering accurate data instead of calculating if we can afford the next
                price feed update."
              </p>
            </CardContent>
          </Card>

          {/* DAO Treasury Manager Testimonial */}
          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Quote className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg font-bold">Taylor M.</CardTitle>
                  <CardDescription className="text-gray-400 font-medium text-sm">DAO Treasury Manager</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                "Governance proposals were failing because execution costs exceeded the proposal value. Now we can hedge
                our governance operations and actually execute the will of our token holders without going bankrupt."
              </p>
            </CardContent>
          </Card>

          {/* Infrastructure Provider Testimonial */}
          <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Quote className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-lg font-bold">Morgan P.</CardTitle>
                  <CardDescription className="text-gray-400 font-medium text-sm">
                    Infrastructure Engineer
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm leading-relaxed italic">
                "Running infrastructure on Ethereum felt like feeding quarters into a broken slot machine. GasOps gave
                us the risk management tools we needed to run sustainable operations instead of gambling with every
                transaction."
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 font-medium text-sm italic">
            * Testimonials may contain traces of sarcasm and actual user pain points
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 bg-gray-900/50 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <GasStationIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-lg">GasOps</span>
                <div className="text-xs text-green-400 font-medium">System Online</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm text-center sm:text-right">
              © 2024 GasOps Protocol | Built for Ethereum
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
