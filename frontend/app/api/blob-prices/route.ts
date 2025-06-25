import { NextRequest, NextResponse } from 'next/server'

interface BlobData {
    days: string[]
    avgBlobGasPrices: number[]
}

// Helper function to convert blob data to candlestick format
function formatBlobDataToCandlesticks(blobData: BlobData) {
    interface Candlestick {
        time: number
        open: number
        high: number
        low: number
        close: number
        volume: number
        avgBlobGasPrice: number
    }

    const candlesticks: Candlestick[] = []

    console.log('Processing blob data:', {
        daysCount: blobData.days.length,
        avgBlobGasPricesCount: blobData.avgBlobGasPrices.length,
        firstDay: blobData.days[0],
        lastDay: blobData.days[blobData.days.length - 1]
    })

    for (let i = 0; i < blobData.days.length; i++) {
        const date = new Date(blobData.days[i])
        const timestamp = Math.floor(date.getTime() / 1000)

        // Use avgBlobGasPrices as the main metric for the candlestick
        const avgBlobGasPrice = blobData.avgBlobGasPrices[i]

        // Convert wei to gwei and handle edge cases
        let basePrice: number
        if (avgBlobGasPrice <= 1) {
            // If value is 1 or less, it might be a placeholder or error
            basePrice = 0.001 // Default to 0.001 gwei
        } else {
            // Convert from wei to gwei (1 gwei = 10^9 wei)
            basePrice = avgBlobGasPrice / 1e9
        }

        // Add some variation to create OHLC data
        const variation = Math.max(basePrice * 0.05, 0.001) // Minimum 0.001 gwei variation

        let open, close, high, low

        if (i === 0) {
            // First candle: use basePrice as open
            open = basePrice + (Math.random() - 0.5) * variation
            close = basePrice + (Math.random() - 0.5) * variation
        } else {
            // Subsequent candles: use previous close as open
            open = candlesticks[i - 1].close
            close = basePrice + (Math.random() - 0.5) * variation
        }

        // Calculate high and low based on open and close
        high = Math.max(open, close) + Math.random() * variation * 0.5
        low = Math.min(open, close) - Math.random() * variation * 0.5

        // Ensure low is never negative
        low = Math.max(low, 0.0001)

        candlesticks.push({
            time: timestamp,
            open: open,
            high: high,
            low: low,
            close: close,
            volume: avgBlobGasPrice, // Keep original wei value for volume
            avgBlobGasPrice: avgBlobGasPrice
        })

        // Log first few entries for debugging
        if (i < 5) {
            console.log(`Day ${i + 1}:`, {
                date: blobData.days[i],
                timestamp,
                avgBlobGasPriceWei: avgBlobGasPrice,
                basePriceGwei: basePrice,
                open,
                close,
                high,
                low
            })
        }
    }

    console.log(`Created ${candlesticks.length} candlesticks`)
    console.log('First 3 candlesticks:', candlesticks.slice(0, 3))

    return candlesticks
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const timeRange = searchParams.get('timeRange') // '1D', '7D', '30D'

        console.log('Blob API called with timeRange:', timeRange)

        // Always use 365d to get full year of data, regardless of UI selection
        const timeFrame = '365d'

        console.log(`Fetching blob data for timeFrame: ${timeFrame} from Blobscan API`)

        const response = await fetch(`https://api.blobscan.com/stats/blocks?timeFrame=${timeFrame}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Add timeout
            signal: AbortSignal.timeout(30000) // 30 second timeout
        })

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.')
            }
            throw new Error(`Blobscan API request failed: ${response.status}`)
        }

        const blobData: BlobData = await response.json()

        console.log(`Received blob data with ${blobData.days.length} days from Blobscan API`)
        console.log('First 3 days:', blobData.days.slice(0, 3))
        console.log('Last 3 days:', blobData.days.slice(-3))
        console.log('First 3 avgBlobGasPrices:', blobData.avgBlobGasPrices.slice(0, 3))

        // Convert to candlestick format
        const formattedData = formatBlobDataToCandlesticks(blobData)

        console.log(`Formatted ${formattedData.length} candlesticks from blob data`)

        return NextResponse.json({
            success: true,
            data: formattedData,
            chain: 'eth-blob',
            timeRange: timeRange || '365d',
            count: formattedData.length,
            rawCount: blobData.days.length,
            source: 'blobscan-api',
            timeFrame: timeFrame
        })

    } catch (error) {
        console.error('Blob API route error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { timeRange } = body

        // Always use 365d to get full year of data, regardless of UI selection
        const timeFrame = '365d'

        console.log(`Fetching blob data for timeFrame: ${timeFrame} from Blobscan API`)

        const response = await fetch(`https://api.blobscan.com/stats/blocks?timeFrame=${timeFrame}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Add timeout
            signal: AbortSignal.timeout(30000) // 30 second timeout
        })

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.')
            }
            throw new Error(`Blobscan API request failed: ${response.status}`)
        }

        const blobData: BlobData = await response.json()

        console.log(`Received blob data with ${blobData.days.length} days from Blobscan API`)

        // Convert to candlestick format
        const formattedData = formatBlobDataToCandlesticks(blobData)

        console.log(`Formatted ${formattedData.length} candlesticks from blob data`)

        return NextResponse.json({
            success: true,
            data: formattedData,
            chain: 'eth-blob',
            timeRange: timeRange || '365d',
            count: formattedData.length,
            rawCount: blobData.days.length,
            source: 'blobscan-api',
            timeFrame: timeFrame
        })

    } catch (error) {
        console.error('Blob API route error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
} 