'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import { Clock, Filter, TrendingUp, TrendingDown } from 'lucide-react'
import {
    formatTimestamp,
    formatBigInt,
    getChainName,
    getTimeframeDisplay,
    isOptionExpired,
    isOptionActive
} from '@/lib/queries'

// Type definitions
interface Option {
    id: string
    writer: string
    isCall: boolean
    premium: string
    strikePrice: string
    expirationDate: string
    deadlineDate: string
    units: string
    unitsLeft: string | null
    capPerUnit: string
    hasToPay: boolean | null
    optionPrice: string | null
    countervalue: string
    premiumCollected: string | null
    responseValue: string | null
    chainGasId: string
    timeframe: string
    isDeleted: boolean | null
    isErrored: boolean | null
    isActive: boolean | null
    isPaused: boolean | null
}

// Market data
const markets = [
    { id: 'eth-blob', name: 'Blob ETH', icon: '/logos/eth.png', color: 'cyan' },
    { id: 'eth-gas', name: 'Gas ETH', icon: '/logos/eth.png', color: 'cyan' },
    { id: 'base-gas', name: 'Gas Base', icon: '/logos/base.png', color: 'blue' },
    { id: 'arb-gas', name: 'Gas Arbitrum', icon: '/logos/arb.png', color: 'purple' }
]

// Timeframe options
const timeframes = [
    { id: '1D', name: '1 Day' },
    { id: '7D', name: '7 Days' },
    { id: '30D', name: '30 Days' }
]

// Option type options
const optionTypes = [
    { id: 'call', name: 'Call' },
    { id: 'put', name: 'Put' }
]

// Price filter options
const priceFilters = [
    { id: 'all', name: 'All Prices' },
    { id: 'low', name: 'Low (< 0.1 ETH)' },
    { id: 'medium', name: 'Medium (0.1-1 ETH)' },
    { id: 'high', name: 'High (> 1 ETH)' }
]

// Mock options data for demonstration
const mockOptions: Option[] = [
    {
        id: '1',
        writer: '0x1234...5678',
        isCall: true,
        premium: '1000000000000000000', // 1 ETH
        strikePrice: '50000000000000000000', // 50 ETH
        expirationDate: '1704067200', // Jan 1, 2024
        deadlineDate: '1703980800',
        units: '1000000000000000000',
        unitsLeft: '500000000000000000',
        capPerUnit: '1000000000000000000',
        hasToPay: false,
        optionPrice: '1000000000000000000',
        countervalue: '50000000000000000000',
        premiumCollected: '500000000000000000',
        responseValue: '0',
        chainGasId: '1',
        timeframe: '1D',
        isDeleted: false,
        isErrored: false,
        isActive: true,
        isPaused: false
    },
    {
        id: '2',
        writer: '0x8765...4321',
        isCall: false,
        premium: '2000000000000000000', // 2 ETH
        strikePrice: '30000000000000000000', // 30 ETH
        expirationDate: '1704153600', // Jan 2, 2024
        deadlineDate: '1704067200',
        units: '2000000000000000000',
        unitsLeft: '1000000000000000000',
        capPerUnit: '2000000000000000000',
        hasToPay: true,
        optionPrice: '2000000000000000000',
        countervalue: '60000000000000000000',
        premiumCollected: '1000000000000000000',
        responseValue: '0',
        chainGasId: '8453',
        timeframe: '7D',
        isDeleted: false,
        isErrored: false,
        isActive: true,
        isPaused: false
    }
]

const getColorClasses = (color: string) => {
    const colors = {
        cyan: {
            gradient: 'from-cyan-500 to-blue-500',
            border: 'border-cyan-400'
        },
        blue: {
            gradient: 'from-blue-500 to-indigo-500',
            border: 'border-blue-400'
        },
        purple: {
            gradient: 'from-purple-500 to-pink-500',
            border: 'border-purple-400'
        }
    }
    return colors[color as keyof typeof colors] || colors.cyan
}

// Chain ID mapping
const getChainId = (marketId: string): string => {
    const chainMap: { [key: string]: string } = {
        'eth-blob': '1',
        'eth-gas': '1',
        'base-gas': '8453',
        'arb-gas': '42161'
    }
    return chainMap[marketId] || '1'
}

export default function MarketsPage() {
    const [selectedMarket, setSelectedMarket] = useState('eth-gas')
    const [selectedTimeframe, setSelectedTimeframe] = useState('1D')
    const [selectedOptionType, setSelectedOptionType] = useState('call')
    const [selectedPriceFilter, setSelectedPriceFilter] = useState('all')
    const [options, setOptions] = useState<Option[]>(mockOptions)
    const [loading, setLoading] = useState(false)

    // Function to fetch options from our API route
    const fetchOptions = async (chainGasId: string, timeframe: string) => {
        setLoading(true)
        try {
            const response = await fetch(`/api/options?chainGasId=${chainGasId}&timeframe=${timeframe}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (result.success && result.data) {
                setOptions(result.data)
            } else {
                console.error('API returned error:', result.error)
                // Fallback to mock data
                setOptions(mockOptions)
            }
        } catch (error) {
            console.error('Error fetching options:', error)
            // Fallback to mock data
            setOptions(mockOptions)
        } finally {
            setLoading(false)
        }
    }

    // Fetch options when market or timeframe changes
    useEffect(() => {
        const chainId = getChainId(selectedMarket)
        fetchOptions(chainId, selectedTimeframe)
    }, [selectedMarket, selectedTimeframe])

    // Filter options based on selected criteria
    const filteredOptions = options.filter(option => {
        // Filter out expired options
        if (isOptionExpired(option.expirationDate)) {
            return false
        }

        // Filter out inactive options
        if (!isOptionActive(option)) {
            return false
        }

        const matchesOptionType = selectedOptionType === 'all' ||
            (selectedOptionType === 'call' && option.isCall) ||
            (selectedOptionType === 'put' && !option.isCall)

        const premium = parseFloat(formatBigInt(option.premium))
        const matchesPriceFilter = selectedPriceFilter === 'all' ||
            (selectedPriceFilter === 'low' && premium < 0.1) ||
            (selectedPriceFilter === 'medium' && premium >= 0.1 && premium <= 1) ||
            (selectedPriceFilter === 'high' && premium > 1)

        return matchesOptionType && matchesPriceFilter
    })

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

            <Navbar />

            {/* Market Selection Bar */}
            <section className="relative z-10 container mx-auto px-4 sm:px-6 py-6">
                <div className="bg-black/80 border-2 border-pink-500 rounded-lg backdrop-blur-sm shadow-lg shadow-pink-500/30 p-2">
                    <h2 className="text-lg font-black text-white mb-2 text-center uppercase tracking-wider">
                        Select Market
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2">
                        {markets.map((market) => {
                            const colors = getColorClasses(market.color)
                            const isSelected = selectedMarket === market.id
                            return (
                                <Button
                                    key={market.id}
                                    onClick={() => setSelectedMarket(market.id)}
                                    className={`${isSelected
                                        ? `bg-gradient-to-r ${colors.gradient} shadow-lg shadow-${market.color}-500/75`
                                        : 'bg-gray-800 hover:bg-gray-700'
                                        } text-white border-2 ${isSelected ? colors.border : 'border-gray-600'
                                        } font-bold uppercase tracking-wider transition-all duration-300 p-1 h-auto`}
                                >
                                    <div className="flex flex-col items-center space-y-0">
                                        {market.icon.startsWith('/') ? (
                                            <div className={`w-4 h-4 ${isSelected ? 'bg-white/20' : 'bg-gray-600'} rounded-lg flex items-center justify-center`}>
                                                <Image
                                                    src={market.icon}
                                                    alt={market.name}
                                                    width={12}
                                                    height={12}
                                                    className="rounded"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-sm">{market.icon}</span>
                                        )}
                                        <span className="text-xs font-bold">{market.name}</span>
                                    </div>
                                </Button>
                            )
                        })}

                        {/* Soon More Card - Inline */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg blur opacity-30" />
                            <Card className="relative bg-black/90 border-2 border-gray-400 backdrop-blur-sm shadow-lg shadow-gray-400/30 h-full">
                                <CardContent className="p-1 text-center flex flex-col items-center justify-center h-full">
                                    <div className="flex items-center space-x-1 mb-0">
                                        <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg flex items-center justify-center shadow-lg shadow-gray-500/50">
                                            <Clock className="w-2 h-2 text-white" />
                                        </div>
                                        <span className="text-gray-300 font-bold text-xs">Soon more...</span>
                                    </div>
                                    <p className="text-gray-400 text-xs">Additional markets coming soon</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trading Interface Filters */}
            <section className="relative z-10 container mx-auto px-4 sm:px-6 mb-8">
                <div className="bg-black/80 border-2 border-cyan-500 rounded-lg backdrop-blur-sm shadow-lg shadow-cyan-500/30 p-4">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Timeframe Filter */}
                        <div className="flex items-center space-x-2">
                            <span className="text-white font-semibold">Timeframe:</span>
                            <div className="flex space-x-1">
                                {timeframes.map((timeframe) => (
                                    <Button
                                        key={timeframe.id}
                                        onClick={() => setSelectedTimeframe(timeframe.id)}
                                        variant={selectedTimeframe === timeframe.id ? 'default' : 'outline'}
                                        size="sm"
                                        className="text-xs"
                                    >
                                        {timeframe.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Option Type Filter */}
                        <div className="flex items-center space-x-2">
                            <span className="text-white font-semibold">Type:</span>
                            <div className="flex space-x-1">
                                {optionTypes.map((type) => (
                                    <Button
                                        key={type.id}
                                        onClick={() => setSelectedOptionType(type.id)}
                                        variant={selectedOptionType === type.id ? 'default' : 'outline'}
                                        size="sm"
                                        className="text-xs"
                                    >
                                        {type.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="flex items-center space-x-2">
                            <span className="text-white font-semibold">Price:</span>
                            <select
                                value={selectedPriceFilter}
                                onChange={(e) => setSelectedPriceFilter(e.target.value)}
                                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-xs"
                            >
                                {priceFilters.map((filter) => (
                                    <option key={filter.id} value={filter.id}>
                                        {filter.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trading View Chart Placeholder */}
            <section className="relative z-10 container mx-auto px-4 sm:px-6 mb-8">
                <div className="bg-black/80 border-2 border-green-500 rounded-lg backdrop-blur-sm shadow-lg shadow-green-500/30 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Trading Chart</h3>
                    <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">Chart component will be integrated here</span>
                    </div>
                </div>
            </section>

            {/* Order Book */}
            <section className="relative z-10 container mx-auto px-4 sm:px-6 mb-8">
                <div className="bg-black/80 border-2 border-purple-500 rounded-lg backdrop-blur-sm shadow-lg shadow-purple-500/30 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Order Book</h3>
                        {loading && (
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                                <span className="text-gray-400 text-sm">Loading...</span>
                            </div>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-2 px-2 text-gray-300">Type</th>
                                    <th className="text-left py-2 px-2 text-gray-300">Premium</th>
                                    <th className="text-left py-2 px-2 text-gray-300">Strike Price</th>
                                    <th className="text-left py-2 px-2 text-gray-300">Expiration</th>
                                    <th className="text-left py-2 px-2 text-gray-300">Units Left</th>
                                    <th className="text-left py-2 px-2 text-gray-300">Writer</th>
                                    <th className="text-left py-2 px-2 text-gray-300">Chain</th>
                                    <th className="text-left py-2 px-2 text-gray-300">Timeframe</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOptions.map((option) => (
                                    <tr key={option.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="py-2 px-2">
                                            <Badge variant={option.isCall ? 'default' : 'secondary'}>
                                                {option.isCall ? 'Call' : 'Put'}
                                            </Badge>
                                        </td>
                                        <td className="py-2 px-2 text-white">
                                            {formatBigInt(option.premium)} ETH
                                        </td>
                                        <td className="py-2 px-2 text-white">
                                            {formatBigInt(option.strikePrice)} ETH
                                        </td>
                                        <td className="py-2 px-2 text-gray-300">
                                            {formatTimestamp(option.expirationDate)}
                                        </td>
                                        <td className="py-2 px-2 text-white">
                                            {formatBigInt(option.unitsLeft || '0')}
                                        </td>
                                        <td className="py-2 px-2 text-gray-300">
                                            {option.writer.slice(0, 6)}...{option.writer.slice(-4)}
                                        </td>
                                        <td className="py-2 px-2 text-gray-300">
                                            {getChainName(option.chainGasId)}
                                        </td>
                                        <td className="py-2 px-2 text-gray-300">
                                            {getTimeframeDisplay(option.timeframe)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredOptions.length === 0 && !loading && (
                            <div className="text-center py-8 text-gray-400">
                                No options found matching the selected criteria
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
} 