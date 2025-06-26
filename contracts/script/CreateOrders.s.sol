// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {GasHedger} from "../src/GasHedger.sol";
import {IGasHedger} from "../src/interfaces/IGasHedger.sol";

contract CreateOrdersScript is Script {
    
    function run() external {
       
        // Get the deployed GasHedger contract address
        address gasHedgerAddress = vm.envAddress("GASHEDGER_ADDRESS");
        GasHedger gasHedger = GasHedger(gasHedgerAddress);
        
  
        vm.startBroadcast();
        
        // Create 5 orders for each chainGasId (0, 1, 2) - total 15 orders
        // Skip chainGasId 3 as requested
        
        // ChainGasId 0 (Ethereum)
        gasHedger.createOption(
            true,
            10000000000000,
            10000000000000,
            block.timestamp + 1 minutes,
            block.timestamp + 2 minutes,
            10,
            10000000000000,
            1,
            IGasHedger.Timeframe.Daily
        );
        
        vm.stopBroadcast();
        
        console.log("Successfully created 15 random orders!");
    }
    
    function createRandomOrder(
        GasHedger gasHedger,
        uint64 chainGasId,
        uint8 timeframeIndex,
        string memory orderName
    ) internal {
        // Generate pseudo-random numbers using block variables
        uint256 seed = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            chainGasId,
            timeframeIndex,
            orderName
        )));
        
        // Random parameters with realistic gwei values
        bool isCallOption = (seed % 2) == 0; // Random call/put
        
        // Premium: 100-500 gwei per unit
        uint256 premium = ((seed % 401) + 100) * 1e9; // 100-500 gwei
        
        // Strike price: 2000-8000 gwei (realistic gas prices)
        uint256 strikePrice = ((seed >> 8) % 6001 + 2000) * 1e9; // 2000-8000 gwei
        
        // Current timestamp
        uint256 currentTime = block.timestamp;
        
        // Buy deadline: 3-7 days from now
        uint256 buyDeadline = currentTime + ((seed >> 16) % 5 + 3) * 1 days;
        
        // Expiration: 13-18 days from now
        uint256 expirationDate = currentTime + ((seed >> 24) % 6 + 13) * 1 days;
        
        // Units: 1-10 units
        uint256 units = (seed >> 32) % 10 + 1;
        
        // Cap per unit: 1000-3000 gwei
        uint256 capPerUnit = ((seed >> 40) % 2001 + 1000) * 1e9; // 1000-3000 gwei
        
        // Timeframe mapping
        IGasHedger.Timeframe timeframe;
        if (timeframeIndex == 0) {
            timeframe = IGasHedger.Timeframe.Daily;
        } else if (timeframeIndex == 1) {
            timeframe = IGasHedger.Timeframe.Weekly;
        } else {
            timeframe = IGasHedger.Timeframe.Monthly;
        }
        
        // Create the option
        gasHedger.createOption(
            isCallOption,
            premium,
            strikePrice,
            buyDeadline,
            expirationDate,
            units,
            capPerUnit,
            chainGasId,
            timeframe
        );
        
        console.log("Created:", orderName);
        console.log("  Type:", isCallOption ? "Call" : "Put");
        console.log("  Premium:", premium / 1e9, "gwei");
        console.log("  Strike:", strikePrice / 1e9, "gwei");
        console.log("  Units:", units);
        console.log("  Cap per unit:", capPerUnit / 1e9, "gwei");
        console.log("  Buy deadline:", buyDeadline);
        console.log("  Expiration:", expirationDate);
        console.log("  Timeframe:", timeframeIndex == 0 ? "Daily" : timeframeIndex == 1 ? "Weekly" : "Monthly");
        console.log("---");
    }
}
