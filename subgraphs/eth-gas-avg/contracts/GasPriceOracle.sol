// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GasPriceOracle {
    event GasPriceUpdate(
        uint256 indexed blockNumber,
        uint256 indexed timestamp,
        uint256 gasPrice,
        uint256 baseFeePerGas
    );
    
    // Anyone can call this to update gas prices
    function updateGasPrice() external {
        emit GasPriceUpdate(
            block.number,
            block.timestamp,
            tx.gasprice,
            block.basefee
        );
    }
    
    // View function to get current gas price info
    function getGasPriceInfo() external view returns (
        uint256 blockNumber,
        uint256 timestamp,
        uint256 gasPrice,
        uint256 baseFeePerGas
    ) {
        return (
            block.number,
            block.timestamp,
            tx.gasprice,
            block.basefee
        );
    }
} 