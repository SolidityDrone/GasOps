import { NextRequest, NextResponse } from 'next/server'
import {
    GET_GAS_PRICES_BY_CHAIN,
    GET_GAS_PRICES_BY_TIME_RANGE,
    SUBGRAPH_ENDPOINTS,
    formatGasPriceData,
    getCurrentTimestamp,
    getTimestampDaysAgo,
    getPeriodFromTimeframe
} from '@/lib/gasQueries'

// New query for getting only the latest snapshot
const GET_LATEST_GAS_PRICE = `
  query GetLatestGasPrice {
    gasPriceSnapshots(
      first: 1
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      timestamp
      baseFee
      blockId
      period
    }
  }
`;

// Helper function to fetch all snapshots with pagination
async function fetchAllSnapshots(endpoint: string, baseQuery: string, variables: any) {
    let allSnapshots: any[] = []
    let skip = 0
    const pageSize = 1000 // Reduced from 1000 for better reliability
    const maxPages = 20 // Increased max pages but with smaller page size
    let pageCount = 0

    console.log(`Starting pagination for ${endpoint} with variables:`, variables)
    console.log(`Page size: ${pageSize}, Max pages: ${maxPages}`)

    while (pageCount < maxPages) {
        try {
            console.log(`Fetching page ${pageCount + 1}, skip: ${skip}, total so far: ${allSnapshots.length}`)

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: baseQuery,
                    variables: { ...variables, first: pageSize, skip }
                }),
                // Add timeout
                signal: AbortSignal.timeout(45000) // Increased to 45 seconds
            })

            if (!response.ok) {
                console.error(`HTTP error: ${response.status} ${response.statusText}`)
                throw new Error(`GraphQL request failed: ${response.status}`)
            }

            const data = await response.json()

            if (data.errors) {
                console.error('GraphQL errors:', data.errors)
                throw new Error(`GraphQL query failed: ${data.errors[0]?.message || 'Unknown error'}`)
            }

            const page = data.data?.gasPriceSnapshots || []
            console.log(`Page ${pageCount + 1} returned ${page.length} snapshots`)

            if (page.length === 0) {
                console.log(`Empty page received, stopping pagination`)
                break
            }

            allSnapshots = allSnapshots.concat(page)

            // If we got less than pageSize, we've reached the end
            if (page.length < pageSize) {
                console.log(`Reached end of data after ${pageCount + 1} pages`)
                break
            }

            skip += pageSize
            pageCount++

            // Add a longer delay for Base subgraph
            const delay = endpoint.includes('base') ? 200 : 100
            await new Promise(resolve => setTimeout(resolve, delay))

        } catch (error) {
            console.error(`Error fetching page ${pageCount + 1}:`, error)

            // If we have some data, return what we have
            if (allSnapshots.length > 0) {
                console.log(`Returning ${allSnapshots.length} snapshots despite error`)
                return allSnapshots
            }

            throw error
        }
    }

    if (pageCount >= maxPages) {
        console.log(`Reached max pages (${maxPages}), returning ${allSnapshots.length} snapshots`)
    }

    console.log(`Total snapshots fetched: ${allSnapshots.length}`)
    return allSnapshots
}

// Helper function to fetch only the latest snapshot
async function fetchLatestSnapshot(endpoint: string) {
    try {
        console.log(`Fetching latest snapshot from ${endpoint}`)

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: GET_LATEST_GAS_PRICE
            }),
            signal: AbortSignal.timeout(10000) // 10 second timeout for single query
        })

        if (!response.ok) {
            throw new Error(`GraphQL request failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.errors) {
            throw new Error(`GraphQL query failed: ${data.errors[0]?.message || 'Unknown error'}`)
        }

        const snapshots = data.data?.gasPriceSnapshots || []
        console.log(`Latest snapshot query returned ${snapshots.length} snapshots`)

        return snapshots.length > 0 ? snapshots[0] : null
    } catch (error) {
        console.error('Error fetching latest snapshot:', error)
        throw error
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const chain = searchParams.get('chain') // 'eth', 'arb', 'base'
        const timeRange = searchParams.get('timeRange') // '1D', '7D', '30D'
        const latest = searchParams.get('latest') // 'true' to get only latest snapshot

        if (!chain || !SUBGRAPH_ENDPOINTS[chain as keyof typeof SUBGRAPH_ENDPOINTS]) {
            return NextResponse.json(
                { error: 'Invalid chain parameter. Must be eth, arb, or base' },
                { status: 400 }
            )
        }

        const endpoint = SUBGRAPH_ENDPOINTS[chain as keyof typeof SUBGRAPH_ENDPOINTS]

        // If latest=true, fetch only the latest snapshot
        if (latest === 'true') {
            try {
                const latestSnapshot = await fetchLatestSnapshot(endpoint)

                if (latestSnapshot) {
                    const formattedData = formatGasPriceData([latestSnapshot])
                    return NextResponse.json({
                        success: true,
                        data: formattedData,
                        chain,
                        latest: true,
                        count: 1
                    })
                } else {
                    return NextResponse.json({
                        success: false,
                        error: 'No latest snapshot found',
                        chain
                    })
                }
            } catch (error) {
                console.error('Error fetching latest snapshot:', error)
                return NextResponse.json(
                    { error: 'Failed to fetch latest snapshot', details: error instanceof Error ? error.message : 'Unknown error' },
                    { status: 500 }
                )
            }
        }

        // Original logic for fetching historical data
        let query: string
        let variables: any

        if (timeRange) {
            // Get data for specific time range
            const now = getCurrentTimestamp()
            let startTime: number

            switch (timeRange) {
                case '1D':
                    startTime = getTimestampDaysAgo(1)
                    break
                case '7D':
                    startTime = getTimestampDaysAgo(7)
                    break
                case '30D':
                    startTime = getTimestampDaysAgo(30)
                    break
                default:
                    startTime = getTimestampDaysAgo(7) // default to 7 days
            }

            query = GET_GAS_PRICES_BY_TIME_RANGE
            variables = {
                startTime: startTime.toString(),
                endTime: now.toString(),
                period: getPeriodFromTimeframe(timeRange)
            }
        } else {
            // Get latest data
            query = GET_GAS_PRICES_BY_CHAIN
            variables = {}
        }

        // Fetch all data with pagination
        let gasPrices: any[] = []
        let limited = false

        try {
            gasPrices = await fetchAllSnapshots(endpoint, query, variables)
        } catch (error) {
            console.error('Primary pagination failed:', error)

            // For Base subgraph, try a fallback with simpler query
            if (chain === 'base') {
                console.log('Trying fallback query for Base subgraph...')
                try {
                    // Use a simpler query with just the latest data
                    const fallbackQuery = GET_GAS_PRICES_BY_CHAIN
                    const fallbackVariables = { first: 5000, skip: 0 }

                    gasPrices = await fetchAllSnapshots(endpoint, fallbackQuery, fallbackVariables)
                    console.log('Fallback query successful, got', gasPrices.length, 'snapshots')
                } catch (fallbackError) {
                    console.error('Fallback query also failed:', fallbackError)
                    throw error // Throw the original error
                }
            } else {
                throw error
            }
        }

        // Limit data if we have too much to prevent performance issues
        const maxDataPoints = 10000
        let limitedGasPrices = gasPrices
        if (gasPrices.length > maxDataPoints) {
            console.log(`Limiting data from ${gasPrices.length} to ${maxDataPoints} points for performance`)
            limitedGasPrices = gasPrices.slice(-maxDataPoints) // Take the most recent data
            limited = true
        }

        const formattedData = formatGasPriceData(limitedGasPrices)

        console.log(`Fetched ${gasPrices.length} raw snapshots, limited to ${limitedGasPrices.length}, formatted into ${formattedData.length} data points`)

        return NextResponse.json({
            success: true,
            data: formattedData,
            chain,
            timeRange: timeRange || 'latest',
            count: formattedData.length,
            rawCount: gasPrices.length,
            limited: limited
        })

    } catch (error) {
        console.error('API route error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { chain, timeRange } = body

        if (!chain || !SUBGRAPH_ENDPOINTS[chain as keyof typeof SUBGRAPH_ENDPOINTS]) {
            return NextResponse.json(
                { error: 'Invalid chain parameter. Must be eth, arb, or base' },
                { status: 400 }
            )
        }

        const endpoint = SUBGRAPH_ENDPOINTS[chain as keyof typeof SUBGRAPH_ENDPOINTS]
        let query: string
        let variables: any

        if (timeRange) {
            // Get data for specific time range
            const now = getCurrentTimestamp()
            let startTime: number

            switch (timeRange) {
                case '1D':
                    startTime = getTimestampDaysAgo(1)
                    break
                case '7D':
                    startTime = getTimestampDaysAgo(7)
                    break
                case '30D':
                    startTime = getTimestampDaysAgo(30)
                    break
                default:
                    startTime = getTimestampDaysAgo(7) // default to 7 days
            }

            query = GET_GAS_PRICES_BY_TIME_RANGE
            variables = {
                startTime: startTime.toString(),
                endTime: now.toString(),
                period: getPeriodFromTimeframe(timeRange)
            }
        } else {
            // Get latest data
            query = GET_GAS_PRICES_BY_CHAIN
            variables = {}
        }

        // Fetch all data with pagination
        let gasPrices: any[] = []
        let limited = false

        try {
            gasPrices = await fetchAllSnapshots(endpoint, query, variables)
        } catch (error) {
            console.error('Primary pagination failed:', error)

            // For Base subgraph, try a fallback with simpler query
            if (chain === 'base') {
                console.log('Trying fallback query for Base subgraph...')
                try {
                    // Use a simpler query with just the latest data
                    const fallbackQuery = GET_GAS_PRICES_BY_CHAIN
                    const fallbackVariables = { first: 5000, skip: 0 }

                    gasPrices = await fetchAllSnapshots(endpoint, fallbackQuery, fallbackVariables)
                    console.log('Fallback query successful, got', gasPrices.length, 'snapshots')
                } catch (fallbackError) {
                    console.error('Fallback query also failed:', fallbackError)
                    throw error // Throw the original error
                }
            } else {
                throw error
            }
        }

        // Limit data if we have too much to prevent performance issues
        const maxDataPoints = 10000
        let limitedGasPrices = gasPrices
        if (gasPrices.length > maxDataPoints) {
            console.log(`Limiting data from ${gasPrices.length} to ${maxDataPoints} points for performance`)
            limitedGasPrices = gasPrices.slice(-maxDataPoints) // Take the most recent data
            limited = true
        }

        const formattedData = formatGasPriceData(limitedGasPrices)

        console.log(`Fetched ${gasPrices.length} raw snapshots, limited to ${limitedGasPrices.length}, formatted into ${formattedData.length} data points`)

        return NextResponse.json({
            success: true,
            data: formattedData,
            chain,
            timeRange: timeRange || 'latest',
            count: formattedData.length,
            rawCount: gasPrices.length,
            limited: limited
        })

    } catch (error) {
        console.error('API route error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
} 