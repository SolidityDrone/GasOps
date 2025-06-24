// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
interface IGasHedger {
    enum Timeframe {
        Daily,
        Weekly,
        Monthly
    }
    
    error InvalidZeroPremium();
    error InvalidZeroStrikePrice();
    error InvalidBuyDeadline(uint256 buyDeadline);
    error InvalidExpirationDate(uint256 expirationDate);
    error InvalidUnitAmount(uint256 units);
    error InvalidCapPerUnit(uint256 capPerUnit);
    error OptionDoesNotExist(uint256 id);
    error OptionPaused(uint256 id);
    error OptionExpired(uint256 id);
    error OptionNotActive(uint256 id);
    error OptionNotSolvible(uint256 id);
    error NotEnoughUnits(uint256 id);
    error InvalidOptionId(uint256 id);
    error OptionOngoing(uint256 id);
    error OptionNotDeactived(uint256 id);
   

    struct Option {
        address writer;
        uint64 chainGasId;
        bytes1 statuses;
        uint256 buyDeadline;
        uint256 premium; 
        uint256 strikePrice; 
        uint256 expirationDate;
        uint256 units;
        uint256 capPerUnit; 
        uint256 unitsLeft;
        uint256 optionPrice; 
        Timeframe timeframe;
    }

    error UnexpectedRequestID(bytes32 requestId);

    event OptionCreated(
        uint256 indexed optionId,
        address indexed writer,
        bool isCall,
        uint256 premium,
        uint256 strikePrice,
        uint256 expirationDate,
        uint256 buyDeadline,
        uint256 units,
        uint256 capPerUnit,
        uint64 chainGasId,
        Timeframe timeframe
    );

    event OptionBought(
        uint256 indexed optionId,
        address indexed buyer,
        uint256 units,
        uint256 totalPrice
    );

    event OptionClaimed(
        uint256 indexed optionId,
        address indexed claimer,
        uint256 units,
        uint256 totalPrice
    );

    event OptionDeleted(
        uint indexed optionId
    );
    event Response(
        uint256 indexed optionId,
        bool indexed hasToPay,
        bytes32 indexed requestId,
        uint256 response,
        bytes err
    );
    
    event erroredClaimed(
        uint256 indexed optionId,
        address indexed claimer, 
        uint totalClaimed
    );
}