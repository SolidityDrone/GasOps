// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library GasQuery {
    string constant query = "const subgraphUrl = args[0].toString();"
"const timeframe = args[1] ? parseInt(args[1].toString()) : 2;"
""
"async function main() {"
"    try {"
"        console.log(`Debug: subgraphUrl = ${subgraphUrl}, timeframe = ${timeframe}`);"
"        "
"        if (subgraphUrl === 'https://api.blobscan.com/stats/blocks') {"
"            return await fetchBlobFee(timeframe);"
"        }"
""
"        const gasData = await getGasAverages(subgraphUrl);"
"        console.log('Debug: gasData received:', JSON.stringify(gasData, null, 2));"
""
"        if (!gasData) {"
"            throw new Error('Failed to get gas data from subgraph - gasData is null/undefined');"
"        }"
""
"        let avgFee;"
"        if (timeframe === 1) {"
"            avgFee = parseInt(gasData.gas_average_daily);"
"        } else if (timeframe === 2) {"
"            avgFee = parseInt(gasData.gas_average_weekly);"
"        } else if (timeframe === 3) {"
"            avgFee = parseInt(gasData.gas_average_monthly);"
"        } else {"
"            throw new Error('Invalid timeframe. Use 1 (daily), 2 (weekly), or 3 (monthly)');"
"        }"
""
"        console.log(`Debug: avgFee = ${avgFee}`);"
""
"        if (!avgFee || avgFee <= 0) {"
"            throw new Error(`Invalid gas average data: ${avgFee}`);"
"        }"
""
"        return Functions.encodeUint256(avgFee);"
""
"    } catch (e) {"
"        console.error('Error in main():', e);"
"        throw e;"
"    }"
"}"
""
"async function getGasAverages(url) {"
"    const query = `"
"    {"
'      feeAggregator(id: "init") {'
"        gas_average_daily"
"        gas_average_weekly"
"        gas_average_monthly"
"        last_updated"
"      }"
"    }"
"  `;"
""
"    try {"
"        console.log(`Debug: Making GraphQL request to ${url}`);"
"        "
"        const resp = await Functions.makeHttpRequest({"
"            url: url,"
"            method: 'POST',"
"            headers: {"
"                'Content-Type': 'application/json',"
"                'Accept': 'application/json'"
"            },"
"            data: { query },"
"        });"
""
"        console.log('Debug: GraphQL response:', JSON.stringify(resp, null, 2));"
""
"        if (resp.error) {"
"            console.error('HTTP request error:', resp.error);"
"            return null;"
"        }"
""
"        if (resp.data?.errors) {"
"            console.error('GraphQL errors:', resp.data.errors);"
"            return null;"
"        }"
""
"        if (!resp.data?.data?.feeAggregator) {"
"            console.error('No feeAggregator data found in response');"
"            return null;"
"        }"
""
"        return resp.data.data.feeAggregator;"
"        "
"    } catch (error) {"
"        console.error('Exception in getGasAverages:', error);"
"        return null;"
"    }"
"}"
""
"async function fetchBlobFee(timeframeParam) {"
"    let timeFrameParam;"
"    if (timeframeParam === 1) {"
"        timeFrameParam = '1d';"
"    } else if (timeframeParam === 2) {"
"        timeFrameParam = '7d';"
"    } else if (timeframeParam === 3) {"
"        timeFrameParam = '30d';"
"    } else {"
"        timeFrameParam = '1d';"
"    }"
""
"    const url = `${subgraphUrl}?timeFrame=${timeFrameParam}`;"
"    console.log(`Debug: Fetching blob fee from ${url}`);"
""
"    try {"
"        const resp = await Functions.makeHttpRequest({"
"            url: url,"
"            method: 'GET',"
"            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },"
"        });"
""
"        console.log('Debug: Blob fee response:', JSON.stringify(resp, null, 2));"
""
"        if (resp.error) {"
"            throw new Error(`HTTP request failed: ${resp.error}`);"
"        }"
""
"        if (!resp.data || !resp.data.avgBlobGasPrices || resp.data.avgBlobGasPrices.length === 0) {"
"            throw new Error('Invalid blob fee data structure');"
"        }"
""
"        const prices = resp.data.avgBlobGasPrices;"
"        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;"
"        const avgBlobGasPriceInWei = Math.floor(avgPrice * 1000000000);"
"        "
"        console.log(`Debug: avgPrice = ${avgPrice}, avgBlobGasPriceInWei = ${avgBlobGasPriceInWei}`);"
"        "
"        return Functions.encodeUint256(avgBlobGasPriceInWei);"
"        "
"    } catch (error) {"
"        console.error('Exception in fetchBlobFee:', error);"
"        throw error;"
"    }"
"}"
""
"async function rpcCall(method, params = []) {"
"    const resp = await Functions.makeHttpRequest({"
"        url: subgraphUrl,"
"        method: 'POST',"
"        headers: {"
"            'Content-Type': 'application/json',"
"            'Accept': 'application/json'"
"        },"
"        data: {"
"            jsonrpc: '2.0',"
"            method: method,"
"            params: params,"
"            id: 1,"
"        },"
"    });"
""
"    return resp.data;"
"}"
""
"return main();";

}