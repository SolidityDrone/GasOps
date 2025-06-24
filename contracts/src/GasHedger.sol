// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {IGasHedger} from "./interfaces/IGasHedger.sol";
import {GasHedgerUtils} from "./GasHedgerUtils.sol";
import {GasQuery} from "./GasQuery.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GasHedger is ERC1155, FunctionsClient, AutomationCompatibleInterface, ConfirmedOwner, IGasHedger, GasHedgerUtils{ 
    using FunctionsRequest for FunctionsRequest.Request;
    mapping(uint256 => Option) public options;
    mapping(bytes32 => uint256) public requestIds;


    mapping(uint => bool) public exhaustedArrays;
    mapping(uint chainGasId => string url) internal chainIdToUrl;
    // Storage variables
    address public wethAddress;
    uint256 public lastOptionId;
    bool public isInitialized;
    bytes32 public s_lastRequestId;
    bytes32 public donID;
    uint64 public subscriptionId;
    uint32 public gasLimit;
    uint256[] public activeOptions;
    
    constructor(
        address _owner, // owner of the contract
        address _router // Functions client's router
    ) ERC1155("") FunctionsClient(_router) ConfirmedOwner(_owner) {

    }

    function init(
        address _wethAddress,
        uint32 _gasLimit,
        bytes32 _donID,
        uint64 _subscriptionId
    ) external onlyOwner {
        require(!isInitialized, "GasHedger: already initialized");
        wethAddress = _wethAddress;
        gasLimit = _gasLimit;
        donID = _donID;
        subscriptionId = _subscriptionId;
        isInitialized = true;
    }

    function setUrlForChainId(uint chainGasId, string memory url) public onlyOwner {
        chainIdToUrl[chainGasId] = url;
    }

    function getUrlForChainId(uint chainGasId) public view returns (string memory) {
        return chainIdToUrl[chainGasId];
    }
  

    function createOption(
        bool isCallOption,
        uint256 premium,
        uint256 strikePrice,
        uint256 buyDeadline,
        uint256 expirationDate,
        uint256 units,
        uint256 capPerUnit,
        uint64 chainGasId,
        Timeframe timeframe
    ) public {
        // Validate parameters
        if (premium == 0) {
            revert InvalidZeroPremium();
        }
        if (strikePrice == 0) {
            revert InvalidZeroStrikePrice();
        }
        if (buyDeadline <= block.timestamp) {
            revert InvalidBuyDeadline(buyDeadline);
        }
        if (expirationDate > buyDeadline) {
            revert InvalidExpirationDate(expirationDate);
        }
        if (units == 0) {
            revert InvalidUnitAmount(units);
        }
        if (capPerUnit == 0) {
            revert InvalidCapPerUnit(capPerUnit);
        }
        // Calculate total collateral from the writer
        uint256 collateral = capPerUnit * units;
        // Transfer collateral from the writer to the contract
        require(
            IERC20(wethAddress).transferFrom(
                msg.sender,
                address(this),
                collateral
            ),
            "GasHedger: failed to transfer weth"
        );


        // TODO: Stake on lido, give wsETH to the writer    

        // Update lastOptionInd
        lastOptionId += 1;
        // Create option
        options[lastOptionId] = Option(
            msg.sender,
            chainGasId,
            setIsCall(bytes1(0x00), isCallOption),
            buyDeadline,
            premium,
            strikePrice,
            expirationDate,
            units,
            capPerUnit,
            units,
            0,
            timeframe
        );
        emit OptionCreated(lastOptionId, msg.sender, isCallOption, premium, strikePrice, expirationDate, buyDeadline, units, capPerUnit, chainGasId, timeframe);
    }
 
  
    function buyOption(uint256 id, uint256 units) public {
        // Get option from storage
        Option storage option = options[id];
        // Check if option exists
        if (option.writer == address(0)) {
            revert OptionDoesNotExist(id);
        }
        // Check if option is paused
        if (isPaused(option.statuses)) {
            revert OptionPaused(id);
        }
        // Check if option is not expired
        if (block.timestamp >= option.buyDeadline) {
            revert OptionExpired(id);
        }
        // Check if there are enough units left
        if (option.unitsLeft < units) {
            revert NotEnoughUnits(id);
        }
        // Calculate total price
        uint256 totalPrice = option.premium * units;
        // Transfer premium from the buyer to the writer
        require(
            IERC20(wethAddress).transferFrom(
                msg.sender,
                option.writer,
                totalPrice
            ),
            "GasHedger: failed to transfer weth"
        );
        // If this is the first time the option is bought, make the option active
        if (option.unitsLeft == option.units && !isActive(option.statuses)) {
            option.statuses = setIsActive(option.statuses, true);
            // Add option to active options for upkeep automation
            activeOptions.push(id);
        }
        // Update units left
        option.unitsLeft -= units;

        
        // Mint option NFT to the buyer
        _mint(msg.sender, id, units, "");

        emit OptionBought(id, msg.sender, units, totalPrice);
    }

    function claimOption(uint256 id) public {
        // Get option from storage
        Option storage option = options[id];
        // get units owned
        uint units = balanceOf(msg.sender, id);
        // Revert if units are 0
        if (units == 0) {
            revert InvalidUnitAmount(units);
        }
        // Check if option is paused
        if (isPaused(option.statuses)) {
            revert OptionPaused(id);
        }
        // Check if option is expired
        if (block.timestamp >= option.expirationDate) {
            revert OptionExpired(id);
        }
        // Check if option is deactived
        if (isActive(option.statuses)) {
            revert OptionNotActive(id);
        }
        // Check if option is 
        if (!hasToPay(option.statuses)) {
            revert OptionNotSolvible(id);
        }
        // Check if the buyer has enough units
        if (balanceOf(msg.sender, id) < units) {
            revert NotEnoughUnits(id);
        }
      
        // Burn option NFT from the buyer
        _burn(msg.sender, id, units);
        // Calculate total collateral
        uint256 price = option.optionPrice * units;
        // Transfer collateral from the contract to the buyer
        require(IERC20(wethAddress).transfer(msg.sender, price), "GasHedger: failed to transfer weth");

        emit OptionClaimed(id, msg.sender, units, price);
    }

    function claimForPausedOption(uint256 id, uint256 units, bool isWriter) public returns(uint256) {
        // Get option from storage
        Option storage option = options[id];
        // Check if options has to pay
        if (!hasToPay(option.statuses)) {
            revert OptionNotSolvible(id);
        }
        // Check if option is paused
        if (isPaused(option.statuses)) {
            revert OptionPaused(id);
        }
        // define price var
        uint256 price;
        // Check if for writer
        if (isWriter) {
            // Check if the caller is the writer
            if (msg.sender != option.writer) {
                revert OptionNotSolvible(id);
            }
            // Calculate total collateral
            price = (option.capPerUnit - option.premium) * units;
            // check price is greater than 0
            if (price == 0) {
                revert OptionNotSolvible(id);
            }
            // Transfer collateral from the contract to the writer
            require(IERC20(wethAddress).transfer(msg.sender, price), "GasHedger: failed to transfer weth");
        } else {
        // Check if the buyer has enough units
        if (balanceOf(msg.sender, id) < units) {
            revert NotEnoughUnits(id);
        }
        // Burn option NFT from the buyer
        _burn(msg.sender, id, units);
        // Calculate total collateral
        price = option.premium * units;
        // Transfer collateral from the contract to the buyer
        require(IERC20(wethAddress).transfer(msg.sender, price), "GasHedger: failed to transfer weth");
        // Increment units left
        option.unitsLeft += units;
        }
        emit erroredClaimed(id, msg.sender, price);
        return price;
    }

   

    function deleteOption(uint256 id) public {
        // Get option from storage
        Option storage option = options[id];
        // Check if option is deactived
        if (isActive(option.statuses)) {
            revert OptionNotDeactived(id);
        }
        // Check if option is not already claimed
        if (hasToPay(option.statuses)) {
            revert OptionOngoing(id);
        }
        // Transfer collateral from the contract to the writer
        require(
            IERC20(wethAddress).transfer(
                option.writer,
                option.units * option.capPerUnit
            ),
            "GasHedger: failed to transfer weth"
        );
        // Delete option
        delete options[id];
        emit OptionDeleted(id);
    }

    function setExhausted(uint index) internal {
        exhaustedArrays[index] = true;
    }

    function checkUpkeep(
        bytes calldata 
    ) external view returns (bool upkeepNeeded, bytes memory performData) {
        // all ever activated options length
        uint arrayLength = activeOptions.length;
        uint maxSubarrayLength = 200;
        // calculate subarray num
        uint numSubarrays = (arrayLength + maxSubarrayLength - 1) / maxSubarrayLength;
        // index of current sub array. Ticks at rate of 2 seconds window per subarray
        uint subarrayIndex = uint(block.timestamp / 2) % numSubarrays;
        uint startingIndex = subarrayIndex * maxSubarrayLength;
        uint endIndex = startingIndex + maxSubarrayLength;
        // if the current subarray is already depleted
        if (exhaustedArrays[subarrayIndex]) {
            // cycle in next subarrays and check if they are exhausted
            for (uint i = subarrayIndex; i < numSubarrays; ++i) {
                if (!exhaustedArrays[i]) {
                    startingIndex = startingIndex + (i * maxSubarrayLength);
                    endIndex = endIndex + (i * maxSubarrayLength);
                }
                // end of subarray met, return false
                if (i == numSubarrays - 1) {
                    return (false, abi.encode(0, 0));
                }
            }
        }
        // prevent out of bounds
        if (endIndex > arrayLength) {
            endIndex = arrayLength;
        }
        Option memory option;
        // check expired element in active options
        uint j;
        for (uint i = startingIndex; i < endIndex; ++i) {
            j++;
            option = options[activeOptions[i]];
            if (
                option.expirationDate < block.timestamp &&
                isActive(option.statuses)
            ) {
                return (
                    upkeepNeeded = true,
                    // id 1 is for match found
                    performData = abi.encode(1, activeOptions[i])
                );
            }
            if (i == endIndex && j == maxSubarrayLength) {
                return (
                    upkeepNeeded = true,
                    // id 2 is for exhausted subarrays
                    performData = abi.encode(2, subarrayIndex)
                );
            }
        }
    }

  

    function performUpkeep(bytes calldata performData) external override {
        (uint op, uint optionId) = abi.decode(performData, (uint, uint));
        if (op == 1){
            // check optionId
            if (optionId == 0) {
                revert InvalidOptionId(optionId);
            }
            // Get option from storage
            Option storage option = options[optionId];
            // Check if option is paused
            if (isPaused(option.statuses)) {
                revert OptionPaused(optionId);
            }
            // Check if option is expired
            if (block.timestamp >= option.expirationDate) {
                revert OptionExpired(optionId);
            }
            // Check if option is deactived
            if (!isActive(option.statuses)) {
                revert OptionNotActive(optionId);
            }
            // Check if option is not already claimed
            if (hasToPay(option.statuses)) {
                revert OptionOngoing(optionId);
            }
            // Send request to Chainlink
            
            bytes32 requestId = _invokeSendRequest(
                option.chainGasId,
                option.timeframe
            );
            // Store requestId for optionId
            requestIds[requestId] = optionId;
            option.statuses = setIsActive(option.statuses, false);
        }
        if (op == 2){
            setExhausted(optionId);
        }
    }

    function _invokeSendRequest(
        uint chainGasId,
        Timeframe timeframe
    ) internal returns (bytes32) {
        // Get query from GasQuery library
        string memory query = GasQuery.query;
        string[] memory args = new string[](2);
        args[0] = chainIdToUrl[chainGasId];
        
        // Convert Timeframe enum to string representation
        string memory timeframeStr;
        if (timeframe == Timeframe.Daily) {
            timeframeStr = "1";
        } else if (timeframe == Timeframe.Weekly) {
            timeframeStr = "2";
        } else if (timeframe == Timeframe.Monthly) {
            timeframeStr = "3";
        } else {
            timeframeStr = "2"; // default to weekly
        }
        args[1] = timeframeStr;
        
        // Create request
        FunctionsRequest.Request memory req;
        // Initialize the request with JS code
        req.initializeRequestForInlineJavaScript(query);
        // Set the arguments for the request
        req.setArgs(args);
        // Send the request and store the request ID
        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        return requestId;
    }



    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        // Get optionId from requestId
        uint id = requestIds[requestId];
        Option memory option = options[id];
        // Handle error response
     
        bool hasToPay;
        // get price from response
        uint256 result = abi.decode(response, (uint256));
  
        // check if the option is a call option
        bool isCallOption = isCall(option.statuses);
        
        // put and call cases
        if (isCallOption) {
            // check if the price is less than the strike price
            if (result <= option.strikePrice) {
                // set option result
                uint refundableAmount = option.units * option.capPerUnit;
                  IERC20(wethAddress).transfer(
                    option.writer,
                    refundableAmount
                );
                
            } else {
                // set option result
                hasToPay = true;
                option.statuses = setHasToPay(option.statuses, hasToPay);
                uint pricePerUnit = result - option.strikePrice;
                if (pricePerUnit > option.capPerUnit){
                    pricePerUnit = option.capPerUnit;
                }
                option.optionPrice = pricePerUnit;
                uint refundableAmount = option.unitsLeft * option.capPerUnit;
                if (refundableAmount > 0){
                    IERC20(wethAddress).transfer(
                    option.writer,
                    refundableAmount
                );
                }
            }
        } else {
            // check if the price is greater than the strike price
            if (result > option.strikePrice) {
                // set option result
                uint refundableAmount = option.units * option.capPerUnit;
                IERC20(wethAddress).transfer(
                    option.writer,
                    refundableAmount
                );
            } else {
                // set option result
                hasToPay = true;
                option.statuses = setHasToPay(option.statuses, hasToPay);
      
                uint pricePerUnit =  option.strikePrice - result;
                if (pricePerUnit > option.capPerUnit){
                    pricePerUnit = option.capPerUnit;
                }
                option.optionPrice = pricePerUnit;
                uint refundableAmount = option.unitsLeft * option.capPerUnit;
                if (refundableAmount > 0){
                    IERC20(wethAddress).transfer(
                        option.writer,
                        refundableAmount
                );
                }
            }
        }
        // update option in storage
        options[id] = option;
        // emit event
        emit Response(id, hasToPay, requestId, result, err);
    }

    function optionStatus(uint256 id) public view returns (bool callOption, bool active, bool toPay, bool paused) {
        callOption = isCall(options[id].statuses);
        active = isActive(options[id].statuses);
        toPay = hasToPay(options[id].statuses);
        paused = isPaused(options[id].statuses);
        return (callOption, active, toPay, paused);
    }
}