'use client'

import { useEffect, useRef, useState } from 'react'
// @ts-ignore
import { createChart, CandlestickSeries } from "lightweight-charts"
import { getChainDisplayName } from '@/lib/gasQueries'

interface TradingViewChartProps {
    chain: string
    timeRange: string
    height?: number
}

interface GasPriceData {
    time: number
    open: number
    high: number
    low: number
    close: number
    volume: number
}

// Function to group data points into hourly candles
function groupToHourlyCandles(data: GasPriceData[]): GasPriceData[] {
    if (!data.length) return [];

    // Sort by time ascending
    const sorted = [...data].sort((a, b) => a.time - b.time);
    const hourly: GasPriceData[] = [];

    // Group by hour (3600 seconds)
    const hourlyMap = new Map<number, GasPriceData[]>();

    for (const point of sorted) {
        // Round down to the nearest hour
        const hourTimestamp = Math.floor(point.time / 3600) * 3600;

        if (!hourlyMap.has(hourTimestamp)) {
            hourlyMap.set(hourTimestamp, []);
        }
        hourlyMap.get(hourTimestamp)!.push(point);
    }

    // Convert grouped data to candlesticks
    for (const [hourTimestamp, points] of hourlyMap) {
        if (points.length === 0) continue;

        const open = points[0].open;
        const close = points[points.length - 1].close;
        const high = Math.max(...points.map(p => p.high));
        const low = Math.min(...points.map(p => p.low));
        const volume = points.reduce((sum, p) => sum + p.volume, 0);

        hourly.push({
            time: hourTimestamp,
            open,
            high,
            low,
            close,
            volume
        });
    }

    // Sort by time and return
    return hourly.sort((a, b) => a.time - b.time);
}

function unixToDateString(unix: number | string): string {
    const date = new Date(Number(unix) * 1000);
    return date.toISOString().slice(0, 10);
}

export default function TradingViewChart({
    chain,
    timeRange,
    height = 400
}: TradingViewChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<any>(null)
    const seriesRef = useRef<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<GasPriceData[]>([])
    const [isMounted, setIsMounted] = useState(false)

    // Track component mount
    useEffect(() => {
        setIsMounted(true)
        return () => setIsMounted(false)
    }, [])

    // Fetch gas price data
    const fetchGasPriceData = async () => {
        if (!isMounted) return;

        try {
            setLoading(true)
            setError(null)

            console.log(`Fetching data for chain: ${chain}`)

            // Use different API endpoints based on chain type
            let apiUrl: string
            if (chain === 'eth-blob') {
                apiUrl = `/api/blob-prices?timeRange=${timeRange}`
            } else {
                apiUrl = `/api/gas-prices?chain=${chain}&timeRange=${timeRange}`
            }

            const response = await fetch(apiUrl, {
                // Add timeout for the request
                signal: AbortSignal.timeout(60000) // 60 second timeout
            })

            if (!isMounted) return;

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (!isMounted) return;

            if (result.success && result.data) {
                console.log('Data received:', result.data)
                console.log('Data length:', result.data.length)
                console.log('Raw count:', result.rawCount)
                console.log('Source:', result.source)
                setData(result.data)
            } else {
                throw new Error(result.error || 'Failed to fetch data')
            }
        } catch (err) {
            if (!isMounted) return;

            console.error('Error fetching data:', err)
            if (err instanceof Error && err.name === 'TimeoutError') {
                setError('Request timed out. Please try again.')
            } else {
                setError(err instanceof Error ? err.message : 'Failed to fetch data')
            }
        } finally {
            if (isMounted) {
                setLoading(false)
            }
        }
    }

    // Initialize chart
    useEffect(() => {
        if (!isMounted || loading) {
            console.log('Chart initialization skipped - mounted:', isMounted, 'loading:', loading)
            return
        }

        console.log('Chart initialization - container ref:', chartContainerRef.current)
        if (!chartContainerRef.current) {
            console.log('No chart container ref found, will retry')
            return
        }

        // Add a small delay to ensure container is properly sized
        const timer = setTimeout(() => {
            console.log('Creating chart with dimensions:', {
                width: chartContainerRef.current?.clientWidth,
                height: height
            })

            if (!chartContainerRef.current) return

            // Create chart
            const chart = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: height,
                layout: {
                    background: { color: '#000000' },
                    textColor: '#ffffff',
                },
                grid: {
                    vertLines: { color: '#2B2B43' },
                    horzLines: { color: '#2B2B43' },
                },
                crosshair: {
                    mode: 1,
                },
                rightPriceScale: {
                    borderColor: '#2B2B43',
                    formatter: {
                        format: (price: number) => {
                            const gweiPrice = price / 1e9
                            return gweiPrice.toFixed(4) + ' Gwei'
                        }
                    }
                },
                timeScale: {
                    borderColor: '#2B2B43',
                    timeVisible: true,
                    secondsVisible: false, // Hide seconds for hourly view
                    ...(chain === 'eth-blob' && {
                        timeVisible: true,
                        secondsVisible: false,
                        // For blob data, we want to show days more prominently
                        tickMarkFormatter: (time: number) => {
                            const date = new Date(time * 1000)
                            return date.toLocaleDateString()
                        }
                    })
                },
            })

            console.log('Chart created successfully:', chart)

            // Create candlestick series
            const candlestickSeries = chart.addSeries(CandlestickSeries, {
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
            })

            seriesRef.current = candlestickSeries

            // Use real data if available, otherwise use fallback data
            let formattedData;

            if (data.length > 0) {
                if (chain === 'eth-blob') {
                    // Blob data is already daily, no need to group into hourly candles
                    formattedData = data;
                    console.log('Using blob data directly, data length:', formattedData.length)
                    console.log('First 5 blob data points:', formattedData.slice(0, 5))
                    console.log('Last 5 blob data points:', formattedData.slice(-5))
                } else {
                    // Group the real data into hourly candles for gas data
                    formattedData = groupToHourlyCandles(data);
                    console.log('Real data grouped into hourly candles, first 5:', formattedData.slice(0, 5))
                }
            } else {
                // Fallback data - create hourly candles
                const now = Math.floor(Date.now() / 1000)
                formattedData = Array.from({ length: 24 }, (_, i) => {
                    const basePrice = 20 + Math.sin(i / 3) * 5 + Math.random() * 2
                    const open = basePrice
                    const close = basePrice + (Math.random() - 0.5) * 2
                    const high = Math.max(open, close) + Math.random() * 1
                    const low = Math.min(open, close) - Math.random() * 1
                    return {
                        time: now - (23 - i) * 3600, // Hourly timestamps
                        open: open,
                        high: high,
                        low: low,
                        close: close,
                        volume: 0
                    }
                })
                console.log('Using fallback hourly data, first 5:', formattedData.slice(0, 5))
            }

            // Sort data by time in ascending order and remove duplicates
            formattedData = formattedData
                .sort((a: any, b: any) => a.time - b.time)
                .filter((item: any, index: number, array: any[]) => {
                    if (index === 0) return true;
                    return item.time !== array[index - 1].time;
                });

            console.log('Final formatted data, first 5:', formattedData.slice(0, 5))
            console.log('Final formatted data, last 5:', formattedData.slice(-5))
            console.log('Total data points:', formattedData.length)

            if (formattedData.length > 0) {
                candlestickSeries.setData(formattedData)
                chart.timeScale().fitContent()
                console.log(`${chain === 'eth-blob' ? 'Daily' : 'Hourly'} candlestick data set successfully, data length:`, formattedData.length)
            } else {
                console.log('No data to set')
            }

            // Store chart reference
            chartRef.current = chart

            // Handle resize
            const handleResize = () => {
                if (chartContainerRef.current && chartRef.current) {
                    chartRef.current.applyOptions({
                        width: chartContainerRef.current.clientWidth
                    })
                }
            }

            // Add ResizeObserver for container size changes
            const resizeObserver = new ResizeObserver(() => {
                handleResize()
            })

            if (chartContainerRef.current) {
                resizeObserver.observe(chartContainerRef.current)
            }

            window.addEventListener('resize', handleResize)

            return () => {
                console.log('Cleaning up chart')
                window.removeEventListener('resize', handleResize)
                resizeObserver.disconnect()
                if (chartRef.current) {
                    chartRef.current.remove()
                }
            }
        }, 100) // 100ms delay to ensure container is sized

        return () => {
            clearTimeout(timer)
        }
    }, [isMounted, loading, data, height])

    // Fetch data when chain changes (not timeframe since we always show hourly)
    useEffect(() => {
        if (!isMounted) return;

        let isMountedRef = true;

        const fetchData = async () => {
            if (!isMountedRef) return;
            await fetchGasPriceData();
        };

        fetchData();

        return () => {
            isMountedRef = false;
        };
    }, [chain, isMounted]) // Added isMounted dependency

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
                    <span className="text-gray-400">
                        {chain === 'eth-blob' ? 'Loading Blob data...' :
                            chain === 'base' ? 'Loading Base data (this may take a moment)...' :
                                'Loading chart data...'}
                    </span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
                <div className="text-center">
                    <div className="text-red-400 mb-2">Error loading chart</div>
                    <div className="text-gray-400 text-sm">{error}</div>
                    <button
                        onClick={fetchGasPriceData}
                        className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    if (!loading && data.length === 0) {
        return (
            <div className="bg-black/80 border-2 border-green-500 rounded-lg backdrop-blur-sm shadow-lg shadow-green-500/30 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">
                        {getChainDisplayName(chain)} - {timeRange}
                    </h3>
                </div>
                <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
                    <div className="text-center">
                        <div className="text-gray-400 mb-2">No real data available</div>
                        <div className="text-gray-500 text-sm">Showing fallback data for demonstration</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-black/80 border-2 border-green-500 rounded-lg backdrop-blur-sm shadow-lg shadow-green-500/30 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                    {chain === 'eth-blob' ? 'Ethereum Blob Chart' :
                        `${getChainDisplayName(chain)} - Hourly Chart`}
                </h3>
                <div className="text-sm text-gray-400">
                    {chain === 'eth-blob' ?
                        `${data.length} daily blob data points` :
                        `${data.length} data points → ${groupToHourlyCandles(data).length} hourly candles`}
                </div>
            </div>
            <div
                ref={chartContainerRef}
                className="w-full"
                style={{ height: `${height}px` }}
            />
        </div>
    )
} 