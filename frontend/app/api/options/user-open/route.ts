import { NextRequest, NextResponse } from 'next/server'
import { GET_USER_OPEN_OPTIONS } from '@/lib/queries'

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

        console.log(`Fetching open options for user: ${userAddress}`)

        // Fetch user's open options with the new query format
        const response = await fetch(GASHEDGER_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: GET_USER_OPEN_OPTIONS,
                variables: { userAddress }
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

        console.log('Full GraphQL response:', JSON.stringify(data, null, 2))

        const openOptions = data.data?.optionUnitsMappings || []
        console.log(`Found ${openOptions.length} open options for user`)

        // Log the raw data structure
        console.log('Raw optionUnitsMappings data:', JSON.stringify(data.data, null, 2))
        console.log('First option mapping (if exists):', openOptions.length > 0 ? JSON.stringify(openOptions[0], null, 2) : 'No options found')

        return NextResponse.json({
            success: true,
            data: openOptions,
            count: openOptions.length
        })

    } catch (error) {
        console.error('API route error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
} 