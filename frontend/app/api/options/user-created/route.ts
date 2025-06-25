import { NextRequest, NextResponse } from 'next/server'
import { GET_USER_CREATED_OPTIONS } from '@/lib/queries'

const GASHEDGER_ENDPOINT = 'https://api.studio.thegraph.com/query/114706/gashedger/version/latest'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { userAddress } = body

        if (!userAddress) {
            return NextResponse.json(
                { error: 'User address is required' },
                { status: 400 }
            )
        }

        console.log(`Fetching created options for user: ${userAddress}`)

        // Get current timestamp
        const currentTimestamp = Math.floor(Date.now() / 1000).toString()

        // Fetch user's created options
        const response = await fetch(GASHEDGER_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: GET_USER_CREATED_OPTIONS,
                variables: {
                    userAddress,
                    currentTimestamp
                }
            }),
            signal: AbortSignal.timeout(30000)
        })

        if (!response.ok) {
            throw new Error(`GraphQL request failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.errors) {
            console.error('GraphQL errors:', data.errors)
            throw new Error(`GraphQL query failed: ${data.errors[0]?.message || 'Unknown error'}`)
        }

        const createdOptions = data.data?.options || []
        console.log(`Found ${createdOptions.length} created options for user`)
        console.log('Created options data:', JSON.stringify(data.data, null, 2))

        return NextResponse.json({
            success: true,
            data: createdOptions,
            count: createdOptions.length
        })

    } catch (error) {
        console.error('API route error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
} 