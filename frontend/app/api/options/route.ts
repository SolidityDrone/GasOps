import { NextRequest, NextResponse } from 'next/server'
import { GET_OPTIONS_BY_CHAIN_AND_TIMEFRAME, GET_ALL_ACTIVE_OPTIONS } from '@/lib/queries'

const GRAPH_ENDPOINT = 'https://api.studio.thegraph.com/query/114706/gashedger/version/latest'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const chainGasId = searchParams.get('chainGasId')
        const timeframe = searchParams.get('timeframe')
        const all = searchParams.get('all')

        let query: string
        let variables: any

        if (all === 'true') {
            // Get all active options
            query = GET_ALL_ACTIVE_OPTIONS
            variables = {}
        } else if (chainGasId && timeframe) {
            // Get options filtered by chain and timeframe
            query = GET_OPTIONS_BY_CHAIN_AND_TIMEFRAME
            variables = {
                chainGasId: chainGasId,
                timeframe: timeframe
            }
        } else {
            return NextResponse.json(
                { error: 'Missing required parameters: chainGasId and timeframe, or all=true' },
                { status: 400 }
            )
        }

        const response = await fetch(GRAPH_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            })
        })

        if (!response.ok) {
            throw new Error(`GraphQL request failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.errors) {
            console.error('GraphQL errors:', data.errors)
            return NextResponse.json(
                { error: 'GraphQL query failed', details: data.errors },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: data.data?.options || []
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
        const { chainGasId, timeframe, all } = body

        let query: string
        let variables: any

        if (all === true) {
            // Get all active options
            query = GET_ALL_ACTIVE_OPTIONS
            variables = {}
        } else if (chainGasId && timeframe) {
            // Get options filtered by chain and timeframe
            query = GET_OPTIONS_BY_CHAIN_AND_TIMEFRAME
            variables = {
                chainGasId: chainGasId,
                timeframe: timeframe
            }
        } else {
            return NextResponse.json(
                { error: 'Missing required parameters: chainGasId and timeframe, or all=true' },
                { status: 400 }
            )
        }

        const response = await fetch(GRAPH_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            })
        })

        if (!response.ok) {
            throw new Error(`GraphQL request failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.errors) {
            console.error('GraphQL errors:', data.errors)
            return NextResponse.json(
                { error: 'GraphQL query failed', details: data.errors },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: data.data?.options || []
        })

    } catch (error) {
        console.error('API route error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
} 