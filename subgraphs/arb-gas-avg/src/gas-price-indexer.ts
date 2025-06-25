import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Block, FeeAggregator, GasPriceSnapshot } from "../generated/schema";

const DAY: BigInt = BigInt.fromI32(24 * 60 * 60);
const WEEK: BigInt = BigInt.fromI32(7 * 24 * 60 * 60);
const MONTH: BigInt = BigInt.fromI32(30 * 24 * 60 * 60);

// Index every 25th block to reduce indexing load while still capturing gas price trends
const INDEXING_FREQUENCY = 150;

export function handleBlock(block: ethereum.Block): void {
    // Only process every N blocks to reduce indexing load
    if (block.number.toI32() % INDEXING_FREQUENCY !== 0) {
        return;
    }

    let blockNumber = block.number;
    let timestamp = block.timestamp;
    let baseFeePerGas = block.baseFeePerGas;

    // Skip if no base fee
    if (!baseFeePerGas) {
        return;
    }

    // Create unique block ID
    let blockId = blockNumber.toString();

    // Check if block already exists
    let blockEntity = Block.load(blockId);
    if (!blockEntity) {
        // Create new block entity
        blockEntity = new Block(blockId);
        blockEntity.baseFee = baseFeePerGas;
        blockEntity.blockId = blockNumber;
        blockEntity.timestamp = timestamp;
        blockEntity.save();

        // Create gas price snapshot
        createGasPriceSnapshot(blockId, baseFeePerGas, timestamp);

        // Update fee aggregator with multiple time ranges
        updateFeeAggregator(timestamp, baseFeePerGas, blockId);
    }
}

function createGasPriceSnapshot(blockId: string, baseFee: BigInt, timestamp: BigInt): void {
    // Create snapshots for different periods
    let dailySnapshot = new GasPriceSnapshot(blockId + "-daily");
    dailySnapshot.blockId = blockId;
    dailySnapshot.baseFee = baseFee;
    dailySnapshot.timestamp = timestamp;
    dailySnapshot.period = "daily";
    dailySnapshot.save();

    let weeklySnapshot = new GasPriceSnapshot(blockId + "-weekly");
    weeklySnapshot.blockId = blockId;
    weeklySnapshot.baseFee = baseFee;
    weeklySnapshot.timestamp = timestamp;
    weeklySnapshot.period = "weekly";
    weeklySnapshot.save();

    let monthlySnapshot = new GasPriceSnapshot(blockId + "-monthly");
    monthlySnapshot.blockId = blockId;
    monthlySnapshot.baseFee = baseFee;
    monthlySnapshot.timestamp = timestamp;
    monthlySnapshot.period = "monthly";
    monthlySnapshot.save();
}

function updateFeeAggregator(timestamp: BigInt, baseFee: BigInt, blockId: string): void {
    // Load or create fee aggregator
    let feeAggregator = FeeAggregator.load("init");
    if (!feeAggregator) {
        feeAggregator = new FeeAggregator("init");
        feeAggregator.daily = [];
        feeAggregator.weekly = [];
        feeAggregator.monthly = [];
        feeAggregator.gas_average_daily = BigInt.fromI32(0);
        feeAggregator.gas_average_weekly = BigInt.fromI32(0);
        feeAggregator.gas_average_monthly = BigInt.fromI32(0);
        feeAggregator.last_updated = BigInt.fromI32(0);
    }

    // Add current block ID to all time range arrays
    feeAggregator.daily = feeAggregator.daily!.concat([blockId]);
    feeAggregator.weekly = feeAggregator.weekly!.concat([blockId]);
    feeAggregator.monthly = feeAggregator.monthly!.concat([blockId]);

    // Filter and calculate averages for each time range
    feeAggregator.daily = filterBlocksByTimeRange(feeAggregator.daily!, timestamp, DAY);
    feeAggregator.weekly = filterBlocksByTimeRange(feeAggregator.weekly!, timestamp, WEEK);
    feeAggregator.monthly = filterBlocksByTimeRange(feeAggregator.monthly!, timestamp, MONTH);

    // Calculate averages for each time range
    feeAggregator.gas_average_daily = calculateAverage(feeAggregator.daily!);
    feeAggregator.gas_average_weekly = calculateAverage(feeAggregator.weekly!);
    feeAggregator.gas_average_monthly = calculateAverage(feeAggregator.monthly!);

    feeAggregator.last_updated = timestamp;
    feeAggregator.save();
}

function filterBlocksByTimeRange(blockIds: string[], currentTimestamp: BigInt, timeRange: BigInt): string[] {
    let thresholdTimestamp = currentTimestamp.minus(timeRange);
    let filteredBlocks: string[] = [];

    for (let i = 0; i < blockIds.length; i++) {
        let blockId = blockIds[i];
        let blockEntity = Block.load(blockId);
        if (blockEntity && blockEntity.timestamp.ge(thresholdTimestamp)) {
            filteredBlocks = filteredBlocks.concat([blockId]);
        }
    }

    return filteredBlocks;
}

function calculateAverage(blockIds: string[]): BigInt {
    if (blockIds.length === 0) {
        return BigInt.fromI32(0);
    }

    let totalBaseFee = BigInt.fromI32(0);
    let validBlocks = 0;

    for (let i = 0; i < blockIds.length; i++) {
        let blockId = blockIds[i];
        let blockEntity = Block.load(blockId);
        if (blockEntity) {
            totalBaseFee = totalBaseFee.plus(blockEntity.baseFee);
            validBlocks++;
        }
    }

    if (validBlocks > 0) {
        return totalBaseFee.div(BigInt.fromI32(validBlocks));
    }

    return BigInt.fromI32(0);
} 