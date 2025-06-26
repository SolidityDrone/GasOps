// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {GasHedger} from "../src/GasHedger.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IGasHedger} from "../src/interfaces/IGasHedger.sol";

contract MockERC20 {
    string public name = "MockWETH";
    string public symbol = "WETH";
    uint8 public decimals = 18;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "insufficient");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "insufficient");
        require(allowance[from][msg.sender] >= amount, "no allowance");
        balanceOf[from] -= amount;
        allowance[from][msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }
    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }
}

contract GasHedgerUnitTest is Test {
    GasHedger public gasHedger;
    MockERC20 public weth;
    address public owner = address(0x1);
    address public writer = address(0x2);
    address public buyer = address(0x3);
    address public forwarder = address(0x4);
    address public router = address(0x5);
    bytes32 public donID = bytes32(uint256(0x1234));
    uint64 public subId = 1;
    uint32 public gasLimit = 500000;
    uint64 public chainGasId = 1;
    string public url = "https://test.url";

    function setUp() public {
        weth = new MockERC20();
        vm.prank(owner);
        gasHedger = new GasHedger(owner, router);
        vm.prank(owner);
        gasHedger.init(address(weth), gasLimit, donID, subId, forwarder);
        vm.prank(owner);
        gasHedger.setUrlForChainId(chainGasId, url);
        // Fund writer and buyer
        weth.mint(writer, 100 ether);
        weth.mint(buyer, 100 ether);
    }

    function testCreateOption() public {
        vm.startPrank(writer);
        weth.approve(address(gasHedger), 10 ether);
        uint256 buyDeadline = block.timestamp + 1 days;
        uint256 expiration = buyDeadline + 1 days;
        gasHedger.createOption(true, 1 ether, 2 ether, buyDeadline, expiration, 5, 2 ether, chainGasId, IGasHedger.Timeframe.Weekly);
        (address optWriter,,,,,,,,,,,) = gasHedger.options(1);
        assertEq(optWriter, writer);
        vm.stopPrank();
    }

    function testCreateOptionRevertsOnZeroPremium() public {
        vm.startPrank(writer);
        weth.approve(address(gasHedger), 10 ether);
        uint256 buyDeadline = block.timestamp + 1 days;
        uint256 expiration = buyDeadline + 1 days;
        vm.expectRevert(IGasHedger.InvalidZeroPremium.selector);
        gasHedger.createOption(true, 0, 2 ether, buyDeadline, expiration, 5, 2 ether, chainGasId, IGasHedger.Timeframe.Weekly);
        vm.stopPrank();
    }

    function testBuyOption() public {
        // Writer creates option
        vm.startPrank(writer);
        weth.approve(address(gasHedger), 10 ether);
        uint256 buyDeadline = block.timestamp + 1 days;
        uint256 expiration = buyDeadline + 1 days;
        gasHedger.createOption(true, 1 ether, 2 ether, buyDeadline, expiration, 5, 2 ether, chainGasId, IGasHedger.Timeframe.Weekly);
        vm.stopPrank();
        // Buyer buys 2 units
        vm.startPrank(buyer);
        weth.approve(address(gasHedger), 10 ether);
        gasHedger.buyOption(1, 2);
        assertEq(gasHedger.balanceOf(buyer, 1), 2);
        vm.stopPrank();
    }

    function testBuyOptionRevertsIfExpired() public {
        // Writer creates option
        vm.startPrank(writer);
        weth.approve(address(gasHedger), 10 ether);
        uint256 buyDeadline = block.timestamp + 1;
        uint256 expiration = buyDeadline + 1 days;
        gasHedger.createOption(true, 1 ether, 2 ether, buyDeadline, expiration, 5, 2 ether, chainGasId, IGasHedger.Timeframe.Weekly);
        vm.stopPrank();
        // Move time forward
        vm.warp(buyDeadline + 1);
        // Buyer tries to buy
        vm.startPrank(buyer);
        weth.approve(address(gasHedger), 10 ether);
        vm.expectRevert(abi.encodeWithSelector(IGasHedger.OptionExpired.selector, 1));
        gasHedger.buyOption(1, 2);
        vm.stopPrank();
    }

    function testClaimOptionRevertsIfNotExpired() public {
        // Writer creates option
        vm.startPrank(writer);
        weth.approve(address(gasHedger), 10 ether);
        uint256 buyDeadline = block.timestamp + 1 days;
        uint256 expiration = buyDeadline + 1 days;
        gasHedger.createOption(true, 1 ether, 2 ether, buyDeadline, expiration, 5, 2 ether, chainGasId, IGasHedger.Timeframe.Weekly);
        vm.stopPrank();
        // Buyer buys
        vm.startPrank(buyer);
        weth.approve(address(gasHedger), 10 ether);
        gasHedger.buyOption(1, 2);
        vm.stopPrank();
        // Try to claim before expiration
        vm.startPrank(buyer);
        vm.expectRevert(abi.encodeWithSelector(IGasHedger.OptionExpired.selector, 1));
        gasHedger.claimOption(1);
        vm.stopPrank();
    }

    // Add more tests for claim, delete, and edge cases as needed
}
