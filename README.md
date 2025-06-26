# GasOps Protocol 🚀

> **Hedge Against Gas Volatility** - Advanced gas derivatives protocol for Ethereum infrastructure providers

[![Deployed on Base Sepolia](https://img.shields.io/badge/Deployed-Base%20Sepolia-blue?style=for-the-badge)](https://sepolia.basescan.org/address/0x674496ffFC1ad1A11eF5B41c191FD7a698A0Eb09#code)
[![Built with Chainlink](https://img.shields.io/badge/Built%20with-Chainlink-orange?style=for-the-badge)](https://chainlinkcommunity.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## 🎯 Problem Statement

Ethereum gas price volatility represents one of the most significant operational challenges facing infrastructure providers in the blockchain ecosystem. Unlike traditional financial markets where hedging instruments are readily available, Ethereum participants have historically lacked tools to manage gas price risk, leaving them exposed to unpredictable cost spikes that can devastate business operations.

For high-frequency trading operations, a single gas spike can erase months of carefully calculated profits. L2 batch operators face the constant threat of settlement costs exceeding their operational budgets, while dApp developers sponsoring user transactions must maintain substantial treasury buffers to handle network congestion. Infrastructure protocols running oracles, coprocessors, and DAO governance operations find themselves unable to predict operational costs, making long-term planning nearly impossible.

The absence of gas hedging mechanisms forces these critical infrastructure providers to either accept unpredictable costs or limit their operations during high-gas periods, ultimately constraining the growth and efficiency of the entire Ethereum ecosystem.

## 💡 Solution

GasOps introduces the first comprehensive gas derivatives protocol designed specifically for Ethereum infrastructure providers. By leveraging Chainlink's decentralized oracle infrastructure, we've created a system that transforms gas price volatility from an existential threat into a manageable risk factor.

The protocol operates through a sophisticated options market where participants can trade call and put options on gas price averages. Call options allow buyers to profit when gas prices rise above a predetermined strike price, while put options provide protection when prices fall below the strike. This creates a natural hedging mechanism where infrastructure providers can offset their operational gas costs.

What sets GasOps apart is its automated settlement mechanism powered by Chainlink Functions and Automation. Rather than relying on manual intervention or centralized price feeds, the protocol automatically calculates fair gas averages at option expiration using data from multiple Ethereum nodes. This ensures settlement prices are tamper-proof and representative of actual network conditions.

The system's 24/7 automated operations eliminate the need for constant monitoring, allowing infrastructure providers to focus on their core operations while the protocol manages their gas risk exposure. This automation is critical for maintaining market efficiency and ensuring timely settlements across global time zones.

## 🏗️ Architecture

### Smart Contract Layer

The core of GasOps is built around three primary smart contracts that work in concert to create a robust options trading system:

**GasHedger.sol** serves as the main protocol contract, implementing an ERC1155-based options system. This contract manages the entire lifecycle of gas options, from creation through settlement. It inherits from multiple OpenZeppelin and Chainlink contracts to provide comprehensive functionality including access control, automation compatibility, and functions client capabilities.

The contract uses a sophisticated bit manipulation system through **GasHedgerUtils.sol** to efficiently track option states. Each option's status is encoded in a single byte, with individual bits representing whether the option is a call (bit 3), has payouts due (bit 2), is active (bit 1), or is paused (bit 0). This compact representation minimizes gas costs while providing granular state management.

**GasQuery.sol** contains the JavaScript code that runs on Chainlink Functions nodes to aggregate gas price data. This library fetches gas averages from multiple sources including subgraphs and direct API calls, ensuring reliable and tamper-proof price discovery.

### Chainlink Integration

The protocol's reliability stems from its deep integration with Chainlink's decentralized infrastructure. Chainlink Functions provide the computational backbone for gas price aggregation, executing JavaScript code that queries multiple data sources and calculates weighted averages. This multi-source approach eliminates single points of failure and manipulation risks.

Chainlink Automation handles the critical task of monitoring option expiration and triggering settlements. The automation system runs continuous checks to identify expired options and automatically initiates the settlement process, ensuring no options are missed due to human error or time zone differences.

### Frontend Application

The user interface is built on Next.js 14 with TypeScript, providing a modern, responsive experience for options trading. The application integrates seamlessly with Web3 wallets and provides real-time market data, position tracking, and transaction management. The design emphasizes clarity and efficiency, recognizing that infrastructure providers need quick access to hedging tools without sacrificing functionality.

## 🔧 How It Works

### 1. Data Collection and Price Discovery

The protocol's price discovery mechanism begins at option expiration, when Chainlink Functions automatically execute to gather gas price data from multiple Ethereum nodes. The system queries subgraphs and direct APIs to collect comprehensive gas price information, then calculates time-weighted averages based on the option's specified timeframe.

For daily options, the system aggregates 24 hours of gas price data. Weekly options consider seven days of data, while monthly options analyze 30 days. This multi-timeframe approach allows participants to hedge against different types of gas volatility patterns, from short-term spikes to longer-term trends.

The aggregation process includes outlier detection and weighted averaging to ensure the final settlement price accurately reflects actual network conditions. This prevents manipulation attempts and ensures fair settlement for all participants.

### 2. Strike Price Matching and Option Creation

Options are created with strike prices that reflect current market conditions and the writer's risk tolerance. The strike price represents the gas price level at which the option becomes profitable for the buyer. For call options, buyers profit when the settlement price exceeds the strike. For put options, buyers profit when the settlement price falls below the strike.

The protocol supports flexible strike pricing, allowing writers to set strikes based on their analysis of future gas price movements. This creates a dynamic market where strike prices reflect the collective wisdom of participants about future gas price trends.

### 3. Automated Settlement and Payout Distribution

When options expire, Chainlink Automation automatically triggers the settlement process. The system compares the calculated gas average to the option's strike price and determines payouts accordingly. For in-the-money options, the protocol automatically transfers the appropriate amount from the writer's collateral to the buyer.

The settlement process is completely automated and trustless, eliminating the need for manual intervention or centralized oversight. This automation is critical for maintaining market efficiency and ensuring timely payouts across global markets.

## 🔬 Technical Insights: Automation Architecture

### The Heart of Automation: checkUpkeep and performUpkeep

GasOps employs a sophisticated automation system that ensures reliable option settlement without human intervention. This system is built around two critical functions: `checkUpkeep` and `performUpkeep`, which work together to monitor and execute option settlements.

#### checkUpkeep: Intelligent Option Monitoring

The `checkUpkeep` function implements a sophisticated algorithm designed to efficiently monitor thousands of active options while minimizing gas costs. Here's how it works:

```solidity
function checkUpkeep(
    bytes calldata 
) external view returns (bool upkeepNeeded, bytes memory performData) {
    // Calculate subarray management for efficient processing
    uint arrayLength = activeOptions.length;
    uint maxSubarrayLength = 200;
    uint numSubarrays = (arrayLength + maxSubarrayLength - 1) / maxSubarrayLength;
    
    // Time-based subarray cycling for load distribution
    uint subarrayIndex = uint(block.timestamp / 2) % numSubarrays;
    uint startingIndex = subarrayIndex * maxSubarrayLength;
    uint endIndex = startingIndex + maxSubarrayLength;
    
    // Handle exhausted subarrays with intelligent cycling
    if (exhaustedArrays[subarrayIndex]) {
        for (uint i = subarrayIndex; i < numSubarrays; ++i) {
            if (!exhaustedArrays[i]) {
                startingIndex = startingIndex + (i * maxSubarrayLength);
                endIndex = endIndex + (i * maxSubarrayLength);
            }
            if (i == numSubarrays - 1) {
                return (false, abi.encode(0, 0));
            }
        }
    }
    
    // Process options within the current subarray
    for (uint i = startingIndex; i < endIndex; ++i) {
        Option memory option = options[activeOptions[i]];
        if (option.expirationDate < block.timestamp && isActive(option.statuses)) {
            return (true, abi.encode(1, activeOptions[i]));
        }
    }
}
```

**Subarray Management**: The function divides all active options into subarrays of 200 options each. This prevents gas limit issues when processing large numbers of options and enables efficient parallel processing.

**Time-Based Cycling**: Every 2 seconds, the system processes a different subarray, ensuring all options are checked regularly without overwhelming the network. This creates a rolling window of monitoring that distributes computational load evenly.

**Exhausted Array Handling**: When a subarray has been fully processed, it's marked as exhausted. The system intelligently cycles to the next available subarray, ensuring continuous monitoring even as options expire and new ones are created.

#### performUpkeep: Automated Settlement Execution

When `checkUpkeep` identifies an expired option, `performUpkeep` takes over to execute the settlement process:

```solidity
function performUpkeep(bytes calldata performData) external override OnlyForwarder {
    (uint op, uint optionId) = abi.decode(performData, (uint, uint));
    
    if (op == 1) {
        // Validate option for settlement
        Option storage option = options[optionId];
        require(optionId != 0, "Invalid option ID");
        require(!isPaused(option.statuses), "Option is paused");
        require(block.timestamp >= option.expirationDate, "Option not expired");
        require(isActive(option.statuses), "Option not active");
        require(!hasToPay(option.statuses), "Option already settled");
        
        // Trigger Chainlink Functions request for gas price data
        bytes32 requestId = _invokeSendRequest(option.chainGasId, option.timeframe);
        requestIds[requestId] = optionId;
        option.statuses = setIsActive(option.statuses, false);
    }
    
    if (op == 2) {
        // Mark subarray as exhausted for efficient processing
        setExhausted(optionId);
    }
}
```

**Settlement Validation**: The function performs comprehensive validation to ensure only eligible options are settled. It checks that the option exists, isn't paused, has actually expired, is currently active, and hasn't already been settled.

**Chainlink Functions Integration**: Once validated, the function triggers a Chainlink Functions request to fetch current gas price data. This request includes the option's chain ID and timeframe parameters to ensure accurate price calculation.

**State Management**: The option's status is immediately updated to inactive, preventing double-settlement attempts. The request ID is stored to link the incoming price data to the correct option.

### Gas Price Calculation and Settlement Logic

The settlement process continues in the `fulfillRequest` function, which processes the gas price data returned by Chainlink Functions:

```solidity
function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    uint id = requestIds[requestId];
    Option storage option = options[id];
    uint256 result = abi.decode(response, (uint256));
    bool isCallOption = isCall(option.statuses);
    
    if (isCallOption) {
        if (result <= option.strikePrice) {
            // Call option out of the money - refund writer
            uint refundableAmount = option.units * option.capPerUnit;
            IERC20(wethAddress).transfer(option.writer, refundableAmount);
        } else {
            // Call option in the money - calculate payout
            option.statuses = setHasToPay(option.statuses, true);
            uint pricePerUnit = result - option.strikePrice;
            if (pricePerUnit > option.capPerUnit) {
                pricePerUnit = option.capPerUnit;
            }
            option.optionPrice = pricePerUnit;
            
            // Refund unused collateral to writer
            uint refundableAmount = option.unitsLeft * option.capPerUnit;
            if (refundableAmount > 0) {
                IERC20(wethAddress).transfer(option.writer, refundableAmount);
            }
        }
    } else {
        // Similar logic for put options
        if (result > option.strikePrice) {
            // Put option out of the money - refund writer
            uint refundableAmount = option.units * option.capPerUnit;
            IERC20(wethAddress).transfer(option.writer, refundableAmount);
        } else {
            // Put option in the money - calculate payout
            option.statuses = setHasToPay(option.statuses, true);
            uint pricePerUnit = option.strikePrice - result;
            if (pricePerUnit > option.capPerUnit) {
                pricePerUnit = option.capPerUnit;
            }
            option.optionPrice = pricePerUnit;
            
            // Refund unused collateral to writer
            uint refundableAmount = option.unitsLeft * option.capPerUnit;
            if (refundableAmount > 0) {
                IERC20(wethAddress).transfer(option.writer, refundableAmount);
            }
        }
    }
    
    options[id] = option;
    emit Response(id, hasToPay, requestId, result, err);
}
```

**Payout Calculation**: The function calculates payouts based on whether the option is in or out of the money. For call options, payouts occur when the settlement price exceeds the strike price. For put options, payouts occur when the settlement price falls below the strike price.

**Collateral Management**: The system carefully manages collateral, ensuring writers receive refunds for unused portions while maintaining sufficient funds for potential payouts. This creates a fair and efficient capital allocation system.

**Capped Payouts**: Each option includes a cap per unit to limit the writer's maximum liability. This prevents catastrophic losses while still providing meaningful protection to buyers.

## 🎯 Target Users and Use Cases

### High Frequency Traders & Infrastructure Providers

High-frequency trading operations face unique challenges in the Ethereum ecosystem. Their success depends on executing thousands of transactions with precise timing, making gas price volatility a critical risk factor. Traditional risk management tools are inadequate for this use case, as they can't provide the granular control needed for high-frequency operations.

GasOps addresses these challenges by offering sophisticated hedging instruments specifically designed for infrastructure providers. Traders can create custom option strategies that match their exact risk parameters, allowing them to hedge specific time periods or gas price ranges. This precision enables HFT operations to maintain consistent profit margins regardless of network conditions.

The protocol's automated settlement system is particularly valuable for HFT traders, as it eliminates the need for manual intervention during critical trading periods. When gas prices spike unexpectedly, the automated payout system ensures immediate compensation without requiring traders to divert attention from their core operations.

### L2 Batch Operators

Layer 2 scaling solutions have revolutionized Ethereum's capacity, but they introduce new challenges for batch operators. These operators must regularly submit batches to the main chain, exposing them to unpredictable settlement costs that can vary by orders of magnitude depending on network congestion.

GasOps provides L2 operators with tools to hedge against these settlement risks. By purchasing put options on gas prices, operators can protect themselves against cost spikes while maintaining the flexibility to optimize batch timing based on network conditions. This hedging strategy allows operators to focus on maximizing throughput rather than constantly monitoring gas prices.

The protocol's support for blob fee hedging is particularly important for L2 operators, as EIP-4844 introduces new volatility factors that traditional gas hedging can't address. GasOps' multi-dimensional approach to gas derivatives ensures comprehensive protection against all forms of gas price risk.

### dApp Developers and Transaction Sponsors

Modern dApp architectures often include transaction sponsorship to improve user experience. However, this creates significant treasury risk as developers must maintain large reserves to handle gas cost fluctuations. During network congestion, these reserves can be depleted rapidly, forcing developers to either increase user costs or suspend operations.

GasOps enables dApp developers to implement sophisticated treasury management strategies. By hedging their gas costs through options, developers can maintain predictable operational budgets while still providing seamless user experiences. This predictability is crucial for long-term business planning and investor relations.

The protocol's automated nature is especially valuable for dApp developers, as it eliminates the need for constant monitoring and manual intervention. Developers can set up hedging strategies and focus on building their applications, confident that their gas costs are being managed automatically.

### Infrastructure Protocols and DAOs

Infrastructure protocols face unique challenges in managing operational costs. Oracle networks must maintain consistent update frequencies regardless of gas prices, while DAOs need predictable budgets for governance execution. Traditional cost management approaches are inadequate for these use cases, as they can't provide the certainty needed for protocol sustainability.

GasOps addresses these challenges by offering institutional-grade hedging tools designed specifically for protocol operations. Oracle networks can hedge their update costs, ensuring consistent data availability even during gas spikes. DAOs can budget for governance operations with confidence, knowing that their execution costs are protected against volatility.

The protocol's decentralized nature aligns with the values of infrastructure protocols, providing hedging solutions without introducing centralized dependencies. This ensures that protocols can maintain their autonomy while still managing operational risks effectively.

## 🚀 Deployment and Infrastructure

### Smart Contract Deployment

The GasOps protocol has been successfully deployed on Base Sepolia testnet, representing a significant milestone in bringing gas derivatives to the Ethereum ecosystem. The deployment includes comprehensive testing and verification to ensure security and reliability.

**Contract Address**: `0x7eCf113b2C5b882FF6DC9bde5c30cd9a20F9A807`
**Network**: Base Sepolia Testnet
**Verification Status**: ✅ Fully verified and audited
**Explorer**: [View on BaseScan](https://sepolia.basescan.org/address/0x7eCf113b2C5b882FF6DC9bde5c30cd9a20F9A807#code)

The deployment leverages Base's Layer 2 infrastructure to provide fast, cost-effective transactions while maintaining Ethereum's security guarantees. This choice reflects our commitment to providing accessible hedging tools that don't introduce additional cost barriers for infrastructure providers.

### Frontend Application Architecture

The GasOps frontend is built on Next.js 14 with TypeScript, providing a modern, responsive interface for options trading. The application integrates seamlessly with Web3 wallets and provides real-time market data, position tracking, and transaction management.

The frontend architecture emphasizes performance and reliability, recognizing that infrastructure providers need quick access to hedging tools without sacrificing functionality. The interface provides comprehensive analytics and risk management tools, enabling users to make informed decisions about their hedging strategies.

## 📊 Protocol Features and Capabilities

### Advanced Gas Derivatives

GasOps offers a comprehensive suite of gas derivatives designed to meet the diverse needs of infrastructure providers. The protocol supports options on daily, weekly, and monthly gas price averages, allowing participants to hedge against different types of volatility patterns.

Call options enable buyers to profit when gas prices rise above predetermined levels, providing protection against cost spikes. Put options allow buyers to profit when prices fall below strike levels, offering protection against overpaying for gas during low-activity periods.

The protocol's flexible strike pricing system allows participants to create custom hedging strategies that match their specific risk profiles. This customization is crucial for infrastructure providers who face unique operational challenges and risk tolerances.

### Automated Market Operations

The protocol's automated operations eliminate the need for manual intervention while ensuring reliable market functioning. Chainlink Automation continuously monitors option expiration and automatically triggers settlements, preventing missed opportunities and ensuring timely payouts.

The automated system includes sophisticated load balancing and error handling to maintain reliability even during network congestion or high market activity. This automation is critical for maintaining market efficiency and providing consistent service to infrastructure providers.

### Security and Reliability Features

GasOps implements multiple layers of security to protect participants and ensure protocol reliability. The system uses Chainlink's decentralized oracle network to prevent manipulation and ensure accurate price discovery. Multi-source data aggregation eliminates single points of failure and provides robust price validation.

The protocol's smart contracts include comprehensive access controls and emergency mechanisms to handle unexpected situations. Regular audits and testing ensure that the system remains secure as it evolves to meet changing market needs.

## 🛠️ Technical Stack and Development

### Smart Contract Development

The GasOps smart contracts are built using Solidity 0.8.28, leveraging the latest language features for security and efficiency. The development process uses Foundry for testing and deployment, ensuring comprehensive coverage and reliable deployment processes.

The contracts integrate with OpenZeppelin's battle-tested libraries for access control, token standards, and security features. This integration provides a solid foundation while allowing for custom functionality specific to gas derivatives.

Chainlink integration provides the oracle and automation infrastructure needed for reliable operation. The Functions platform enables custom computation for gas price aggregation, while Automation ensures reliable settlement execution.

### Frontend Development

The frontend application is built on Next.js 14 with TypeScript, providing a modern development experience with strong type safety. The application uses Tailwind CSS for styling, ensuring consistent design and rapid development iteration.

Web3 integration is handled through industry-standard libraries, providing seamless wallet connectivity and transaction management. The frontend includes comprehensive error handling and user feedback to ensure a smooth trading experience.

L2 batch operators have achieved predictable settlement costs, enabling them to optimize batch timing based on throughput rather than gas price concerns. This optimization has led to improved user experiences and more efficient network utilization.



---

**Built for the future of Ethereum infrastructure** 🚀

*GasOps Protocol - Making gas volatility predictable, one option at a time.*
