'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/Navbar"
import { useAccount } from 'wagmi'
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
    Plus,
    Eye,
} from "lucide-react"
import { useEffect, useState } from "react"
import {
    GET_USER_OPEN_OPTIONS,
    GET_USER_CREATED_OPTIONS,
    GET_OPTION_BY_ID,
    formatBigInt,
    getChainName,
    isOptionExpired,
    isOptionActive
} from "@/lib/queries"

interface OpenOption {
    option: {
        id: string
        isCall: boolean
        name: string
        strikePrice: string
        capPerUnit: string
        responseValue: string
        expirationDate: string
        hasToPay: boolean
        chainGasId: string
        timeframe: string
    }
    units: string
    claimed: boolean
    errorClaim: boolean
}

interface CreatedOption {
    id: string
    expirationDate: string
    premium: string
    premiumCollected: string
    units: string
    unitsLeft: string
    strikePrice: string
    responseValue: string
    countervalue: string
    capPerUnit: string
    isCall: boolean
    chainGasId: string
    timeframe: string
}

// Chain Gas ID mapping
const getOptionName = (chainGasId: string): string => {
    const chainMap: { [key: string]: string } = {
        '0': 'Blob ETH',
        '1': 'Gas ETH',
        '2': 'Base Gas',
        '3': 'Arb Gas'
    }
    return chainMap[chainGasId] || 'Unknown'
}

// Chain Gas ID to market ID mapping for icons
const getMarketId = (chainGasId: string): string => {
    const marketMap: { [key: string]: string } = {
        '0': 'eth-blob',
        '1': 'eth-gas',
        '2': 'base-gas',
        '3': 'arb-gas'
    }
    return marketMap[chainGasId] || 'eth-gas'
}

// Timeframe mapping
const getTimeframeDisplay = (timeframe: string): string => {
    const timeframeMap: { [key: string]: string } = {
        '0': '1D',
        '1': '7D',
        '2': '30D'
    }
    return timeframeMap[timeframe] || timeframe
}

export default function DashboardPage() {
    const [openOptions, setOpenOptions] = useState<OpenOption[]>([])
    const [createdOptions, setCreatedOptions] = useState<CreatedOption[]>([])
    const [loading, setLoading] = useState(true)
    const { address } = useAccount()

    const fetchUserData = async () => {
        if (!address) {
            setLoading(false)
            return
        }

        setLoading(true)
        try {
            // Fetch user's open options
            const openOptionsResponse = await fetch('/api/options/user-open', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userAddress: address })
            })

            if (openOptionsResponse.ok) {
                const openData = await openOptionsResponse.json()
                console.log('Dashboard received open options data:', JSON.stringify(openData, null, 2))
                setOpenOptions(openData.data || [])
            }

            // Fetch user's created options
            const createdOptionsResponse = await fetch('/api/options/user-created', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userAddress: address })
            })

            if (createdOptionsResponse.ok) {
                const createdData = await createdOptionsResponse.json()
                setCreatedOptions(createdData.data || [])
            }

        } catch (error) {
            console.error('Error fetching user data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [address])

    const formatTimestamp = (timestamp: string): string => {
        return new Date(parseInt(timestamp) * 1000).toLocaleDateString()
    }

    const getExpirationStatus = (expirationDate: string): { text: string; color: string } => {
        const now = Math.floor(Date.now() / 1000)
        const expTime = parseInt(expirationDate)
        const diff = expTime - now

        if (diff < 0) {
            return { text: 'Expired', color: 'text-red-400' }
        } else if (diff < 86400) { // Less than 24 hours
            return { text: 'Expires today', color: 'text-orange-400' }
        } else if (diff < 604800) { // Less than 7 days
            return { text: `${Math.ceil(diff / 86400)} days left`, color: 'text-yellow-400' }
        } else {
            return { text: `${Math.ceil(diff / 86400)} days left`, color: 'text-green-400' }
        }
    }

    const handleCounter = (expirationDate: string) => {
        const now = Math.floor(Date.now() / 1000)
        const expTime = parseInt(expirationDate)
        const diff = Math.max(0, expTime - now)

        const days = Math.floor(diff / 86400)
        const hours = Math.floor((diff % 86400) / 3600)
        const minutes = Math.floor((diff % 3600) / 60)
        const seconds = diff % 60

        return { days, hours, minutes, seconds }
    }

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


            {/* Dashboard Content */}
            <section className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                            <span className="text-gray-400">Loading your portfolio...</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Portfolio Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Total Options Owned */}
                            <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm h-32">
                                <CardContent className="p-6 h-full flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm font-medium">Options Owned</p>
                                            <p className="text-white text-2xl font-bold">{openOptions.length}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                                            <Eye className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Total Options Created */}
                            <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm h-32">
                                <CardContent className="p-6 h-full flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm font-medium">Options Created</p>
                                            <p className="text-white text-2xl font-bold">{createdOptions.length}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                                            <Plus className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Total Premium Collected */}
                            <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm h-32">
                                <CardContent className="p-6 h-full flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm font-medium">Premium Collected</p>
                                            <p className="text-white text-2xl font-bold">
                                                {createdOptions.reduce((total, option) => {
                                                    const premium = parseInt(option.premiumCollected || '0') / 1e9
                                                    return total + premium
                                                }, 0).toFixed(5).replace(/\.?0+$/, '') || '0'}
                                            </p>
                                            <p className="text-gray-300 text-xs">Gwei</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                                            <DollarSign className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Active Options */}
                            <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm h-32">
                                <CardContent className="p-6 h-full flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm font-medium">Active Options</p>
                                            <p className="text-white text-2xl font-bold">
                                                {openOptions.filter(option => {
                                                    const expTime = parseInt(option.option?.expirationDate || '0')
                                                    return expTime > Math.floor(Date.now() / 1000)
                                                }).length}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                                            <Activity className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Open Options Table */}
                        <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                                            <Eye className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-white text-xl font-bold">Open Options</CardTitle>
                                            <CardDescription className="text-gray-400 font-medium text-sm">
                                                Options you've purchased
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge className="bg-gray-800/50 border-gray-700 text-gray-300">
                                        {openOptions.length} positions
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {openOptions.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                                        <p className="text-gray-400 font-medium">No open options</p>
                                        <p className="text-gray-400 text-sm">You haven't purchased any options yet</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto max-h-76 overflow-y-auto">
                                        <table className="w-full text-sm">
                                            <thead className="sticky top-0 bg-gray-900/90">
                                                <tr className="border-b border-gray-700">
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Asset
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Type
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Units
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Strike Price
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Max Profit
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Expiry
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Response
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Timeframe
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {openOptions.map((mapping, index) => {
                                                    const optionName = getOptionName(mapping.option?.chainGasId || '')
                                                    const marketId = getMarketId(mapping.option?.chainGasId || '')
                                                    const iconPath = `/logos/${marketId.split('-')[1] || 'eth'}.png`

                                                    console.log(`Option ${index}:`, {
                                                        chainGasId: mapping.option?.chainGasId,
                                                        optionName,
                                                        marketId,
                                                        fullMapping: mapping
                                                    })

                                                    return (
                                                        <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                                                            <td className="py-2 px-1 text-white text-xs">
                                                                <div className="flex items-center space-x-2">
                                                                    <img
                                                                        src={iconPath}
                                                                        alt={optionName}
                                                                        className="w-6 h-6 rounded-full"
                                                                        onError={(e) => {
                                                                            e.currentTarget.src = '/logos/eth.png'
                                                                        }}
                                                                    />
                                                                    <div>
                                                                        <div className="font-medium">{optionName}</div>
                                                                        <div className="text-gray-400 text-xs">#{mapping.option?.id?.slice(-6) || 'N/A'}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-1 text-white text-xs">
                                                                <div className="flex items-center">
                                                                    {mapping.option?.isCall ? (
                                                                        <>
                                                                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                                                                            Call
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                                                                            Put
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-1 text-white text-xs">
                                                                {mapping.units || '0'}
                                                            </td>
                                                            <td className="py-2 px-1 text-white text-xs">
                                                                {mapping.option?.strikePrice ?
                                                                    (parseInt(mapping.option.strikePrice) / 1e9).toFixed(5).replace(/\.?0+$/, '') : '0'} Gwei
                                                            </td>
                                                            <td className="py-2 px-1 text-white text-xs">
                                                                {mapping.option?.capPerUnit && mapping.units ?
                                                                    ((parseInt(mapping.option.capPerUnit) * parseInt(mapping.units)) / 1e9).toFixed(5).replace(/\.?0+$/, '') : '0'} Gwei
                                                            </td>
                                                            <td className="py-2 px-1 text-gray-300 text-xs">
                                                                <div className="flex flex-col">
                                                                    <span>{mapping.option?.expirationDate ? formatTimestamp(mapping.option.expirationDate) : 'N/A'}</span>
                                                                    <span className="text-xs text-red-400">
                                                                        {mapping.option?.expirationDate ? getExpirationStatus(mapping.option.expirationDate).text : 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-1 text-white text-xs">
                                                                {mapping.option?.responseValue ?
                                                                    `${(parseInt(mapping.option.responseValue) / 1e9).toFixed(5).replace(/\.?0+$/, '')} Gwei` : "-"}
                                                            </td>
                                                            <td className="py-2 px-1 text-gray-300 text-xs">
                                                                {mapping.option?.timeframe ?
                                                                    (mapping.option.timeframe === '0' ? '1D' :
                                                                        mapping.option.timeframe === '1' ? '7D' :
                                                                            mapping.option.timeframe === '2' ? '30D' :
                                                                                mapping.option.timeframe) : 'N/A'}
                                                            </td>
                                                            <td className="py-2 px-1">
                                                                {!mapping.claimed && mapping.option?.hasToPay && (
                                                                    <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white text-xs">
                                                                        Claim
                                                                    </Button>
                                                                )}
                                                                {mapping.claimed && (
                                                                    <Button size="sm" className="bg-gray-500 text-white text-xs" disabled>
                                                                        Claimed
                                                                    </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Created Options Table */}
                        <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                                            <Plus className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-white text-xl font-bold">Created Options</CardTitle>
                                            <CardDescription className="text-gray-400 font-medium text-sm">
                                                Options you've written
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge className="bg-gray-800/50 border-gray-700 text-gray-300">
                                        {createdOptions.length} positions
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {createdOptions.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                                        <p className="text-gray-400 font-medium">No created options</p>
                                        <p className="text-gray-400 text-sm">You haven't written any options yet</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto max-h-76 overflow-y-auto">
                                        <table className="w-full text-sm">
                                            <thead className="sticky top-0 bg-gray-900/90">
                                                <tr className="border-b border-gray-700">
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Asset
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Type
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Units Left
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Strike Price
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Premium Collected
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Expiry
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Response
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Timeframe
                                                    </th>
                                                    <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {createdOptions.map((option, index) => {
                                                    const optionName = getOptionName(option.chainGasId || '')
                                                    const marketId = getMarketId(option.chainGasId || '')
                                                    const iconPath = `/logos/${marketId.split('-')[1] || 'eth'}.png`
                                                    const expiryStatus = getExpirationStatus(option.expirationDate)

                                                    return (
                                                        <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                                                            <td className="py-2 px-1 text-white text-xs">
                                                                <div className="flex items-center space-x-2">
                                                                    <img
                                                                        src={iconPath}
                                                                        alt={optionName}
                                                                        className="w-6 h-6 rounded-full"
                                                                        onError={(e) => {
                                                                            e.currentTarget.src = '/logos/eth.png'
                                                                        }}
                                                                    />
                                                                    <div>
                                                                        <div className="font-medium">{optionName}</div>
                                                                        <div className="text-gray-400 text-xs">#{option.id?.slice(-6) || 'N/A'}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-1 text-white text-xs">
                                                                <div className="flex items-center">
                                                                    {option.isCall ? (
                                                                        <>
                                                                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                                                                            Call
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                                                                            Put
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-1 text-white text-xs">
                                                                {option.unitsLeft || '0'} / {option.units || '0'}
                                                            </td>
                                                            <td className="py-2 px-1 text-white text-xs">
                                                                {option.strikePrice ?
                                                                    (parseInt(option.strikePrice) / 1e9).toFixed(5).replace(/\.?0+$/, '') : '0'} Gwei
                                                            </td>
                                                            <td className="py-2 px-1 text-white text-xs">
                                                                {option.premiumCollected ?
                                                                    (parseInt(option.premiumCollected) / 1e9).toFixed(5).replace(/\.?0+$/, '') : '0'} Gwei
                                                            </td>
                                                            <td className="py-2 px-1 text-gray-300 text-xs">
                                                                <div className="flex flex-col">
                                                                    <span>{option.expirationDate ? formatTimestamp(option.expirationDate) : 'N/A'}</span>
                                                                    <span className="text-xs text-red-400">
                                                                        {option.expirationDate ? expiryStatus.text : 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-1 text-white text-xs">
                                                                {option.responseValue ?
                                                                    `${(parseInt(option.responseValue) / 1e9).toFixed(5).replace(/\.?0+$/, '')} Gwei` : "-"}
                                                            </td>
                                                            <td className="py-2 px-1 text-gray-300 text-xs">
                                                                {option.timeframe ?
                                                                    (option.timeframe === '0' ? '1D' :
                                                                        option.timeframe === '1' ? '7D' :
                                                                            option.timeframe === '2' ? '30D' :
                                                                                option.timeframe) : 'N/A'}
                                                            </td>
                                                            <td className="py-2 px-1">
                                                                <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white text-xs">
                                                                    Manage
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </section>
        </div>
    )
} 