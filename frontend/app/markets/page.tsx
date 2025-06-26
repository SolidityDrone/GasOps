'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/Navbar'
import TradingViewChart from '@/components/TradingViewChart'
import Image from 'next/image'
import { Clock, Filter, TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react'
import { formatGwei } from 'viem'
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
        'eth-blob': '0',
        'eth-gas': '1',
        'base-gas': '8453',
        'arb-gas': '42161'
    }
    return chainMap[marketId] || '1'
}

// Helper function to format timestamp with seconds
const formatTimestampWithSeconds = (timestamp: string): string => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
};

// Helper function to get countdown to deadline
const getDeadlineCountdown = (deadlineDate: string): string => {
    const now = Math.floor(Date.now() / 1000);
    const deadline = parseInt(deadlineDate);
    const diff = deadline - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
};

// Helper function to get countdown to expiration
const getExpirationCountdown = (expirationDate: string): string => {
    const now = Math.floor(Date.now() / 1000);
    const expiration = parseInt(expirationDate);
    const diff = expiration - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
};

export default function MarketsPage() {
    const [selectedMarket, setSelectedMarket] = useState('eth-gas')
    const [selectedTimeframe, setSelectedTimeframe] = useState('1D')
    const [selectedOptionType, setSelectedOptionType] = useState('call')
    const [options, setOptions] = useState<Option[]>(mockOptions)
    const [loading, setLoading] = useState(false)
    const [countdownUpdate, setCountdownUpdate] = useState(0)
    const [sortField, setSortField] = useState<string>('')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>({})

    // Update countdown every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdownUpdate(prev => prev + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    // Handle input change with validation
    const handleInputChange = (optionId: string, value: string, maxUnits: number) => {
        const numValue = parseInt(value) || 0
        const clampedValue = Math.min(numValue, maxUnits)
        setInputValues(prev => ({
            ...prev,
            [optionId]: clampedValue.toString()
        }))
    }

    // Sorting function
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

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

        return matchesOptionType
    })

    // Sort options
    const sortedOptions = [...filteredOptions].sort((a, b) => {
        if (!sortField) return 0

        let aValue: any
        let bValue: any

        switch (sortField) {
            case 'premium':
                aValue = parseFloat(formatGwei(BigInt(a.premium)))
                bValue = parseFloat(formatGwei(BigInt(b.premium)))
                break
            case 'strikePrice':
                aValue = parseFloat(formatGwei(BigInt(a.strikePrice)))
                bValue = parseFloat(formatGwei(BigInt(b.strikePrice)))
                break
            case 'capPerUnit':
                aValue = parseFloat(formatGwei(BigInt(a.capPerUnit)))
                bValue = parseFloat(formatGwei(BigInt(b.capPerUnit)))
                break
            case 'expirationDate':
                aValue = parseInt(a.expirationDate)
                bValue = parseInt(b.expirationDate)
                break
            case 'deadlineDate':
                aValue = parseInt(a.deadlineDate)
                bValue = parseInt(b.deadlineDate)
                break
            default:
                return 0
        }

        if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1
        } else {
            return aValue < bValue ? 1 : -1
        }
    })

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

            <Navbar />

            {/* Market Selection Bar */}
            <section className="relative z-10 container mx-auto px-4 sm:px-6 py-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg backdrop-blur-sm p-2">
                    <h2 className="text-lg font-bold text-white mb-2 text-center">
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
                                        ? `bg-white text-black`
                                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                                        } border border-gray-600 font-medium transition-all duration-300 p-3 h-auto`}
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        {market.icon.startsWith('/') ? (
                                            <div className={`w-12 h-12 ${isSelected ? 'bg-gray-200' : 'bg-gray-600'} rounded-lg flex items-center justify-center`}>
                                                <Image
                                                    src={market.icon}
                                                    alt={market.name}
                                                    width={36}
                                                    height={36}
                                                    className="rounded"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-lg">{market.icon}</span>
                                        )}
                                        <span className="text-sm font-medium">{market.name}</span>
                                    </div>
                                </Button>
                            )
                        })}

                        {/* Soon More Card - Inline */}
                        <Card className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm h-full">
                            <CardContent className="p-3 text-center flex flex-col items-center justify-center h-full">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-gray-300 font-medium text-sm">Soon more...</span>
                                </div>
                                <p className="text-gray-400 text-xs">Additional markets coming soon</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Trading View Chart and Order Book Side by Side */}
            <section className="relative z-10 container mx-auto px-4 sm:px-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Trading View Chart - Left Side */}
                    <div className="w-full lg:w-2/5">
                        <TradingViewChart
                            chain={selectedMarket === 'eth-blob' ? 'eth-blob' : selectedMarket === 'eth-gas' ? 'eth' : selectedMarket === 'base-gas' ? 'base' : 'arb'}
                            timeRange={selectedTimeframe}
                            height={480}
                        />
                    </div>

                    {/* Order Book - Right Side */}
                    <div className="w-full lg:w-3/5">
                        <div className="bg-gray-900/50 border border-gray-800 rounded-lg backdrop-blur-sm p-4 h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white">Order Book</h3>
                                {loading && (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                        <span className="text-gray-400 text-sm">Loading...</span>
                                    </div>
                                )}
                            </div>

                            {/* Trading Interface Filters */}
                            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-4">
                                <div className="flex flex-wrap gap-4 items-center">
                                    {/* Timeframe Filter */}
                                    <div className="flex items-center space-x-2">
                                        <span className="text-white font-semibold text-sm">Average Format:</span>
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
                                        <span className="text-white font-semibold text-sm">Type:</span>
                                        <div className="flex space-x-1">
                                            {optionTypes.map((type) => (
                                                <Button
                                                    key={type.id}
                                                    onClick={() => setSelectedOptionType(type.id)}
                                                    variant={selectedOptionType === type.id ? 'default' : 'outline'}
                                                    size="sm"
                                                    className={`text-xs ${selectedOptionType === type.id
                                                        ? type.id === 'call'
                                                            ? 'bg-green-600 hover:bg-green-700 border-green-500'
                                                            : 'bg-red-600 hover:bg-red-700 border-red-500'
                                                        : ''
                                                        }`}
                                                >
                                                    {type.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto max-h-76 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-gray-900/90">
                                        <tr className="border-b border-gray-700">
                                            <th
                                                className="text-left py-2 px-2 text-gray-300 cursor-pointer hover:text-white transition-colors text-xs"
                                                onClick={() => handleSort('premium')}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Premium</span>
                                                    {sortField === 'premium' && (
                                                        <span className="text-xs">
                                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left py-2 px-2 text-gray-300 cursor-pointer hover:text-white transition-colors text-xs"
                                                onClick={() => handleSort('strikePrice')}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Strike</span>
                                                    {sortField === 'strikePrice' && (
                                                        <span className="text-xs">
                                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left py-2 px-2 text-gray-300 cursor-pointer hover:text-white transition-colors text-xs"
                                                onClick={() => handleSort('capPerUnit')}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Cap/Unit</span>
                                                    {sortField === 'capPerUnit' && (
                                                        <span className="text-xs">
                                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left py-2 px-2 text-gray-300 cursor-pointer hover:text-white transition-colors text-xs"
                                                onClick={() => handleSort('expirationDate')}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Exp</span>
                                                    {sortField === 'expirationDate' && (
                                                        <span className="text-xs">
                                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left py-2 px-2 text-gray-300 cursor-pointer hover:text-white transition-colors text-xs"
                                                onClick={() => handleSort('deadlineDate')}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Deadline</span>
                                                    {sortField === 'deadlineDate' && (
                                                        <span className="text-xs">
                                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                Units
                                            </th>
                                            <th className="text-left py-2 px-2 text-gray-300 text-xs">
                                                Buy
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedOptions.map((option) => (
                                            <tr key={option.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                                <td className="py-2 px-1 text-white text-xs">
                                                    {formatGwei(BigInt(option.premium))}
                                                </td>
                                                <td className="py-2 px-1 text-white text-xs">
                                                    {formatGwei(BigInt(option.strikePrice))}
                                                </td>
                                                <td className="py-2 px-1 text-white text-xs">
                                                    {formatGwei(BigInt(option.capPerUnit))}
                                                </td>
                                                <td className="py-2 px-1 text-gray-300 text-xs">
                                                    <div className="flex flex-col">
                                                        <span>{formatTimestampWithSeconds(option.expirationDate)}</span>
                                                        <span className="text-xs text-red-400">
                                                            {getExpirationCountdown(option.expirationDate)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-1 text-gray-300 text-xs">
                                                    <div className="flex flex-col">
                                                        <span>{formatTimestampWithSeconds(option.deadlineDate)}</span>
                                                        <span className="text-xs text-yellow-400">
                                                            {getDeadlineCountdown(option.deadlineDate)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-2 px-1 text-white text-xs">
                                                    {option.unitsLeft || '0'}/{option.units}
                                                </td>
                                                <td className="py-2 px-1">
                                                    <div className="flex">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={parseInt(option.unitsLeft || '0')}
                                                            placeholder="Units"
                                                            className="bg-gray-800 border border-gray-600 rounded-l px-1 py-1 text-white text-xs w-12 focus:outline-none focus:border-gray-400"
                                                        />
                                                        <button
                                                            className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-2 py-1 rounded-r border border-gray-600 transition-colors"
                                                        >
                                                            Buy
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {sortedOptions.length === 0 && !loading && (
                                    <div className="text-center py-8 text-gray-400 text-sm">
                                        No options found matching the selected criteria
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}