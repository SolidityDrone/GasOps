export const GET_GAS_PRICES_BY_CHAIN = `
  query GetGasPrices($first: Int!, $skip: Int!) {
    gasPriceSnapshots(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: asc
    ) {
      id
      timestamp
      baseFee
      blockId
      period
    }
  }
`;


export const GET_GAS_PRICES_BY_TIME_RANGE = `
  query GetGasPricesByTimeRange($first: Int!, $startTime: BigInt!, $endTime: BigInt!, $period: String!) {
    gasPriceSnapshots(
      first: $first
      where: {
        timestamp_gte: $startTime
        timestamp_lte: $endTime
        period: $period
      }
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

export const GET_FEE_AGGREGATOR = `
  query GetFeeAggregator {
    feeAggregators(first: 1) {
      id
      gas_average_daily
      gas_average_weekly
      gas_average_monthly
      last_updated
    }
  }
`;

// Helper function to get current timestamp
export const getCurrentTimestamp = (): number => {
    return Math.floor(Date.now() / 1000);
};

// Helper function to get timestamp for X days ago
export const getTimestampDaysAgo = (days: number): number => {
    return Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000);
};

// Helper function to format gas price data for TradingView
export const formatGasPriceData = (data: any[]): any[] => {
    return data.map((item, index) => {
        const baseFee = parseFloat(item.baseFee);

        // Create realistic candlestick data by adding some variation
        // Use the baseFee as the close price
        const close = baseFee;

        // Create some variation for open, high, low based on the baseFee
        const variation = baseFee * 0.05; // 5% variation
        const open = baseFee + (Math.random() - 0.5) * variation;
        const high = Math.max(open, close) + Math.random() * variation * 0.5;
        const low = Math.min(open, close) - Math.random() * variation * 0.5;

        return {
            time: parseInt(item.timestamp),
            open: open,
            high: high,
            low: low,
            close: close,
            volume: 0 // Gas price data doesn't have volume
        };
    }).reverse(); // TradingView expects ascending order
};

// Helper function to get period string from timeframe
export const getPeriodFromTimeframe = (timeframe: string): string => {
    const periodMap: { [key: string]: string } = {
        '1D': 'daily',
        '7D': 'weekly',
        '30D': 'monthly'
    };
    return periodMap[timeframe] || 'daily';
};

// Subgraph endpoints
export const SUBGRAPH_ENDPOINTS = {
    'eth': 'https://api.studio.thegraph.com/query/114674/eth-gas-avg/version/latest',
    'arb': 'https://api.studio.thegraph.com/query/114674/arb-gas-avg/version/latest',
    'base': 'https://api.studio.thegraph.com/query/114674/base-gas-avg/version/latest'
};

// Chain display names
export const getChainDisplayName = (chain: string): string => {
    const chainMap: { [key: string]: string } = {
        'eth': 'Ethereum Gas',
        'arb': 'Arbitrum Gas',
        'base': 'Base Gas'
    };
    return chainMap[chain] || chain;
}; 