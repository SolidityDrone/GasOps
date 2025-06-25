export const GET_OPTIONS_BY_CHAIN_AND_TIMEFRAME = `
  query GetOptionsByChainAndTimeframe($chainGasId: BigInt!, $timeframe: String!) {
    options(
      where: {
        chainGasId: $chainGasId
        timeframe: $timeframe
        isActive: true
        isDeleted: false
        isErrored: false
      }
      orderBy: expirationDate
      orderDirection: asc
    ) {
      id
      writer
      isCall
      premium
      strikePrice
      expirationDate
      deadlineDate
      units
      unitsLeft
      capPerUnit
      hasToPay
      optionPrice
      countervalue
      premiumCollected
      responseValue
      chainGasId
      timeframe
      isDeleted
      isErrored
      isActive
      isPaused
    }
  }
`;

export const GET_ALL_ACTIVE_OPTIONS = `
  query GetAllActiveOptions {
    options(
      where: {
        isActive: true
        isDeleted: false
        isErrored: false
      }
      orderBy: expirationDate
      orderDirection: asc
    ) {
      id
      writer
      isCall
      premium
      strikePrice
      expirationDate
      deadlineDate
      units
      unitsLeft
      capPerUnit
      hasToPay
      optionPrice
      countervalue
      premiumCollected
      responseValue
      chainGasId
      timeframe
      isDeleted
      isErrored
      isActive
      isPaused
    }
  }
`;

// New query to get user's open options (options they've bought)
export const GET_USER_OPEN_OPTIONS = `
  query GetUserOpenOptions($userAddress: String!) {
    optionUnitsMappings(
      where: {user_contains_nocase: $userAddress}
    ) {
      option {
        id
        isCall
        strikePrice
        capPerUnit
        responseValue
        expirationDate
        hasToPay
        chainGasId
        timeframe
      }
      units
      claimed
      errorClaim
    }
  }
`;

// New query to get user's created options (options they've written)
export const GET_USER_CREATED_OPTIONS = `
  query GetUserCreatedOptions($userAddress: String!, $currentTimestamp: BigInt!) {
    options(
      where: {
        writer_contains_nocase: $userAddress
        expirationDate_gt: $currentTimestamp
        isDeleted: false
      }
    ) {
      id
      expirationDate
      premium
      premiumCollected
      units
      unitsLeft
      strikePrice
      responseValue
      countervalue
      capPerUnit
      isCall
      chainGasId
      timeframe
    }
  }
`;

// Query to get option details by ID (for open options)
export const GET_OPTION_BY_ID = `
  query GetOptionById($optionId: String!) {
    option(id: $optionId) {
      id
      writer
      isCall
      premium
      strikePrice
      expirationDate
      deadlineDate
      units
      unitsLeft
      capPerUnit
      hasToPay
      optionPrice
      countervalue
      premiumCollected
      responseValue
      chainGasId
      timeframe
      isDeleted
      isErrored
      isActive
      isPaused
    }
  }
`;

// Query to get user's total portfolio stats
export const GET_USER_PORTFOLIO_STATS = `
  query GetUserPortfolioStats($userAddress: String!) {
    user(id: $userAddress) {
      id
      options
      optionUnitsMapping {
        id
        option
        units
        claimed
        errorClaim
      }
    }
  }
`;

// Helper function to get current timestamp
export const getCurrentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

// Helper function to format timestamp to readable date
export const formatTimestamp = (timestamp: string): string => {
  return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
};

// Helper function to format BigInt to readable number
export const formatBigInt = (value: string, decimals: number = 18): string => {
  const num = parseFloat(value) / Math.pow(10, decimals);
  return num.toFixed(4);
};

// Helper function to get chain name from chainGasId
export const getChainName = (chainGasId: string): string => {
  const chainMap: { [key: string]: string } = {
    '1': 'Ethereum',
    '8453': 'Base',
    '42161': 'Arbitrum'
  };
  return chainMap[chainGasId] || 'Unknown';
};

// Helper function to get timeframe display name
export const getTimeframeDisplay = (timeframe: string): string => {
  const timeframeMap: { [key: string]: string } = {
    '1D': '1 Day',
    '7D': '7 Days',
    '30D': '30 Days',
    'Daily': '1 Day',
    'Weekly': '7 Days',
    'Monthly': '30 Days'
  };
  return timeframeMap[timeframe] || timeframe;
};

// Helper function to check if option is expired
export const isOptionExpired = (expirationDate: string | null): boolean => {
  if (!expirationDate) return false; // If no expiration date, consider it not expired
  const currentTimestamp = getCurrentTimestamp();
  return parseInt(expirationDate) < currentTimestamp;
};

// Helper function to check if option should be considered active for trading
export const isOptionActive = (option: any): boolean => {
  // Check if option is marked as active
  if (option.isActive === true) return true;

  // If not explicitly active, check if it has units left and is not deleted/errored
  if (option.isDeleted === true || option.isErrored === true) return false;

  // Check if there are units left to trade
  const unitsLeft = parseFloat(option.unitsLeft || '0');
  if (unitsLeft > 0) return true;

  return false;
}; 