const subgraphUrl = args[0].toString();
const timeframe = args[1] ? parseInt(args[1].toString()) : 2;

async function main() {
    try {
        if (subgraphUrl === 'https://api.blobscan.com/stats/blocks') {
            return await fetchBlobFee();
        }

        const gasData = await getGasAverages(subgraphUrl);

        if (!gasData) {
            throw new Error('Failed to get gas data from subgraph');
        }

        let avgFee;
        if (timeframe === 1) {
            avgFee = parseInt(gasData.gas_average_daily);
        } else if (timeframe === 2) {
            avgFee = parseInt(gasData.gas_average_weekly);
        } else if (timeframe === 3) {
            avgFee = parseInt(gasData.gas_average_monthly);
        } else {
            throw new Error('Invalid timeframe. Use 1 (daily), 2 (weekly), or 3 (monthly)');
        }

        if (!avgFee || avgFee <= 0) {
            throw new Error('Invalid gas average data');
        }

        return Functions.encodeUint256(avgFee);

    } catch (e) {
        throw e;
    }
}

async function getGasAverages(url) {
    const query = `
    {
      feeAggregator(id: \\init\\) {
        gas_average_daily
        gas_average_weekly
        gas_average_monthly
        last_updated
      }
    }
  `;

    const resp = await Functions.makeHttpRequest({
        url: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: { query },
    });

    if (resp.data?.errors) {
        return null;
    }

    return resp.data?.data?.feeAggregator;
}

async function fetchBlobFee() {
    let timeFrameParam;
    if (timeframe === 1) {
        timeFrameParam = '1d';
    } else if (timeframe === 2) {
        timeFrameParam = '7d';
    } else if (timeframe === 3) {
        timeFrameParam = '30d';
    } else {
        timeFrameParam = '1d';
    }

    const url = `${subgraphUrl}?timeFrame=${timeFrameParam}`;

    const resp = await Functions.makeHttpRequest({
        url: url,
        method: 'GET',
        headers: { 'accept': 'application/json' },
    });

    if (!resp.data || !resp.data.avgBlobGasPrices || resp.data.avgBlobGasPrices.length === 0) {
        throw new Error('Invalid blob fee data');
    }

    const prices = resp.data.avgBlobGasPrices;
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const avgBlobGasPriceInWei = Math.floor(avgPrice * 1000000000);
    return Functions.encodeUint256(avgBlobGasPriceInWei);
}

async function rpcCall(method, params = []) {
    const resp = await Functions.makeHttpRequest({
        url: subgraphUrl,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: {
            jsonrpc: '2.0',
            method: method,
            params: params,
            id: 1,
        },
    });

    return resp.data;
}

return main();