// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {GasHedger} from "../src/GasHedger.sol";

contract DeployScript is Script {

    address constant FUNCTIONS_ROUTER = 0xf9B8fc078197181C841c296C876945aaa425B278;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying GasHedger contract...");
        console.log("Deployer:", deployer);
        console.log("Functions Router:", FUNCTIONS_ROUTER);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy GasHedger contract
        GasHedger gasHedger = new GasHedger(
            deployer, // owner
            FUNCTIONS_ROUTER // Functions router
        );
        
        
        vm.stopBroadcast();
    
    }
}
