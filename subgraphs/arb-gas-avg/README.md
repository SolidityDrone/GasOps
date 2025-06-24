# Gas Price Indexer Subgraph

This subgraph indexes gas prices from Ethereum blocks and calculates averages over multiple time ranges (daily, weekly, monthly).

## Features

- **Multiple Time Ranges**: Calculates gas price averages for daily, weekly, and monthly periods
- **Efficient Indexing**: Only processes every 10th event to reduce load
- **Real-time Updates**: Continuously updates averages as new blocks are indexed
- **Flexible Queries**: Query gas prices for any time range

## Setup

### 1. Deploy the GasPriceOracle Contract

```bash
# Deploy to Ethereum mainnet
npx hardhat run scripts/deploy-oracle.js --network mainnet
```

### 2. Update Subgraph Configuration

Update the contract address in `subgraph.yaml`:
```yaml
source:
  address: "YOUR_DEPLOYED_CONTRACT_ADDRESS"
```

### 3. Generate and Build

```bash
# Install dependencies
yarn install

# Generate types
yarn codegen

# Build the subgraph
yarn build
```

### 4. Deploy the Subgraph

```bash
# Deploy to The Graph's hosted service
yarn deploy

# Or deploy to a local Graph node
yarn deploy:local
```

## Usage

### Trigger Gas Price Updates

Call the `updateGasPrice()` function on the deployed contract to emit gas price events:

```javascript
// Using ethers.js
const oracle = new ethers.Contract(address, abi, signer);
await oracle.updateGasPrice();
```

### Query Gas Price Averages

```graphql
# Get current averages for all time ranges
{
  feeAggregator(id: "init") {
    gas_average_daily
    gas_average_weekly
    gas_average_monthly
    last_updated
  }
}

# Get gas price snapshots for a specific period
{
  gasPriceSnapshots(where: { period: "daily" }, orderBy: timestamp, orderDirection: desc, first: 10) {
    id
    baseFee
    timestamp
    period
  }
}

# Get blocks with gas prices
{
  blocks(orderBy: timestamp, orderDirection: desc, first: 10) {
    id
    baseFee
    timestamp
    blockId
  }
}
```

## Time Ranges

- **Daily**: Last 24 hours
- **Weekly**: Last 7 days  
- **Monthly**: Last 30 days

## Architecture

1. **GasPriceOracle Contract**: Emits events with current gas prices
2. **Subgraph Indexer**: Processes events and calculates averages
3. **FeeAggregator Entity**: Stores calculated averages for all time ranges
4. **GasPriceSnapshot Entity**: Stores individual gas price snapshots

## Customization

You can modify the time ranges by changing the constants in `gas-price-indexer.ts`:

```typescript
const DAY: BigInt = BigInt.fromI32(24 * 60 * 60);
const WEEK: BigInt = BigInt.fromI32(7 * 24 * 60 * 60);
const MONTH: BigInt = BigInt.fromI32(30 * 24 * 60 * 60);
```

## Performance

- **Indexing Frequency**: Processes every 10th event (configurable)
- **Memory Usage**: Automatically filters out old blocks
- **Query Performance**: Optimized for time-range queries 