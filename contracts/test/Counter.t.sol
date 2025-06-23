// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {GasHedger} from "../src/GasHedger.sol";

contract CounterTest is Test {
    GasHedger public gasHedger;

    function setUp() public {
        gasHedger = new GasHedger(0x0000000000000000000000000000000000000000, 0x0000000000000000000000000000000000000000);
    }
    
}
