// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract USDCMock is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("USDCMock", "USDM")
        Ownable(initialOwner)
    {
        _mint(msg.sender, 1000000000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
    function decimals() public override pure returns(uint8) {
        return 18;
    }
}