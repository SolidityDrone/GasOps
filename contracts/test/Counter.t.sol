// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {GasHedger} from "../src/GasHedger.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IGasHedger} from "../src/interfaces/IGasHedger.sol";

contract CounterTest is Test {
    GasHedger public gasHedger;
    address public wethAddress;
    address public user = address(0xA8a7dA49bf284F2e00Fc8857464C1652095CA338);

    function setUp() public {
        gasHedger = GasHedger(0x8fdb6B565d6d45dB791Fde9E133596F55b52c26E);
        wethAddress = gasHedger.wethAddress();
    }
    
    function testCreateOption() public {
        // Switch to user account
        vm.startPrank(user);
        
        // Check if contract is initialized
        console.log("Is initialized:", gasHedger.isInitialized());
        console.log("WETH address:", gasHedger.wethAddress());
        
        // Check user's WETH balance
        uint256 balance = IERC20(wethAddress).balanceOf(user);
        console.log("User WETH balance:", balance);
        
        // Check allowance
        uint256 allowance = IERC20(wethAddress).allowance(user, address(gasHedger));
        console.log("Allowance:", allowance);
        
        // Check URL for chainGasId
        string memory url = gasHedger.getUrlForChainId(1);
        console.log("URL for chainGasId 1:", url);
        
        // Calculate required collateral
        uint256 units = 1000;
        uint256 capPerUnit = 1000;
        uint256 collateral = capPerUnit * units;
        console.log("Required collateral:", collateral);
        
        // Check if user has enough balance
        require(balance >= collateral, "Insufficient WETH balance");
        
        // Check if allowance is sufficient
        require(allowance >= collateral, "Insufficient allowance");
        
        // Use future timestamps
        uint256 currentTime = block.timestamp;
        uint256 buyDeadline = currentTime + 86400; // 24 hours from now
        uint256 expirationDate = buyDeadline + 3600; // 1 hour AFTER buy deadline
        
        console.log("Current time:", currentTime);
        console.log("Buy deadline:", buyDeadline);
        console.log("Expiration date:", expirationDate);
        
        // Try to create option
        try gasHedger.createOption(
            true,                           // isCallOption
            1000,                           // premium
            111111,                         // strikePrice
            buyDeadline,                    // buyDeadline (future)
            expirationDate,                 // expirationDate (after buyDeadline)
            units,                          // units
            capPerUnit,                     // capPerUnit
            1,                              // chainGasId
            IGasHedger.Timeframe.Weekly     // timeframe (Weekly)
        ) {
            console.log("Option created successfully!");
            console.log("Last option ID:", gasHedger.lastOptionId());
        } catch Error(string memory reason) {
            console.log("Failed with reason:", reason);
        } catch (bytes memory lowLevelData) {
            console.log("Failed with low level error");
        }
        
        vm.stopPrank();
    }
    
    function testPerformUpkeep() public {
        // Switch to user account
        vm.startPrank(user);
        
        // The encoded data: 0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001
        // This decodes to: op = 1, optionId = 1
        bytes memory performData = hex"00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001";
        
      
        
        try gasHedger.performUpkeep(performData) {
            console.log("performUpkeep executed successfully!");
        } catch Error(string memory reason) {
            console.log("performUpkeep failed with reason:", reason);
        } catch (bytes memory lowLevelData) {
            console.log("performUpkeep failed with low level error");
        }
        
        vm.stopPrank();
    }
}
