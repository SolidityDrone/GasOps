// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {IGasHedger} from "./interfaces/IGasHedger.sol";
import {GasHedgerUtils} from "./StatusHelper.sol";

contract GasHedger is ERC1155, FunctionsClient, AutomationCompatibleInterface, ConfirmedOwner, IGasHedger, GasHedgerUtils{ 
    using FunctionsRequest for FunctionsRequest.Request;
    mapping(uint256 => Option) public options;
    mapping(bytes32 => uint256) public requestIds;
    mapping(uint256 => string) public customOptionQueries;
    mapping(uint256 => string[]) public customOptionArgs;
    mapping(uint => bool) public exhaustedArrays;
    
    // Storage variables
    address public usdcAddress;
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
        address _usdcAddress,
        uint32 _gasLimit,
        bytes32 _donID,
        uint64 _subscriptionId
    ) external onlyOwner {
        require(!isInitialized, "GasHedger: already initialized");
        usdcAddress = _usdcAddress;
        gasLimit = _gasLimit;
        donID = _donID;
        subscriptionId = _subscriptionId;
        isInitialized = true;
    }

    function createOption(
        bool isCallOption,
        uint256 premium,
        uint256 strikePrice,
        uint256 buyDeadline,
        uint256 expirationDate,
        uint256 units,
        uint256 capPerUnit,
        uint64 chainId
    ) public {
        // Validate parameters
        require(premium > 0, "GasHedger: premium can't be 0");
        require(strikePrice > 0, "GasHedger: strike price can't be 0");
        require(
            buyDeadline > block.timestamp,
            "GasHedger: invalid buy deadline"
        );
        require(
            expirationDate > buyDeadline,
            "GasHedger: invalid expiration date"
        );
        require(units > 0, "GasHedger: invalid unit amount");
        require(capPerUnit > 0, "GasHedger: invalid cap per unit");
        // Calculate total collateral from the writer
        uint256 collateral = capPerUnit * units;
        // Transfer collateral from the writer to the contract
        require(
            IERC20(usdcAddress).transferFrom(
                msg.sender,
                address(this),
                collateral
            ),
            "GasHedger: failed to transfer usdc"
        );
        // Update lastOptionInd
        lastOptionId += 1;
        // Create option
        options[lastOptionId] = Option(
            msg.sender,
            chainId,
            setIsCall(bytes1(0x00), isCallOption),
            buyDeadline,
            premium,
            strikePrice,
            expirationDate,
            units,
            capPerUnit,
            units,
            0
        );
        emit OptionCreated(lastOptionId, msg.sender, isCallOption, premium, strikePrice, expirationDate, buyDeadline, units, capPerUnit, chainId);
    }


    function buyOption(uint256 id, uint256 units) public {
        // Get option from storage
        Option storage option = options[id];
        // Check if option exists
        require(option.writer != address(0), "GasHedger: option id dosen't exist");
        // Check if option is paused
        require(!isPaused(option.statuses), "GasHedger: option paused");
        // Check if option is not expired
        require(
            block.timestamp < option.buyDeadline,
            "GasHedger: can't buy option"
        );
        // Check if there are enough units left
        require(option.unitsLeft >= units, "GasHedger: not enough units");
        // Calculate total price
        uint256 totalPrice = option.premium * units;
        // Transfer premium from the buyer to the writer
        require(
            IERC20(usdcAddress).transferFrom(
                msg.sender,
                option.writer,
                totalPrice
            ),
            "GasHedger: failed to transfer usdc"
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
        // Check if option is paused
        require(!isPaused(option.statuses), "GasHedger: option paused");
        // Check if option is expired
        require(block.timestamp >= option.expirationDate, "GasHedger: option is expired");
        // Check if option is deactived
        require(!isActive(option.statuses), "GasHedger: option is not active");
        // Check if option is 
        require(hasToPay(option.statuses), "GasHedger: option isnt solvible");
        // Check if the buyer has enough units
        require(balanceOf(msg.sender, id) >= units, "GasHedger: not enough units");
        // Burn option NFT from the buyer
        _burn(msg.sender, id, units);
        // Calculate total collateral
        uint256 price = option.optionPrice * units;
        // Transfer collateral from the contract to the buyer
        require(IERC20(usdcAddress).transfer(msg.sender, price), "GasHedger: failed to transfer usdc");

        emit OptionClaimed(id, msg.sender, units, price);
    }

    function claimForPausedOption(uint256 id, uint256 units, bool isWriter) public returns(uint256) {
        // Get option from storage
        Option storage option = options[id];
        // Check if options has to pay
        require(hasToPay(option.statuses), "GasHedger: option isnt solvible");
        // Check if option is paused
        require(isPaused(option.statuses), "GasHedger: option isnt solvible");
        // define price var
        uint256 price;
        // Check if for writer
        if (isWriter) {
            // Check if the caller is the writer
            require(msg.sender == option.writer, "GasHedger: already initialized");
            // Calculate total collateral
            price = (option.capPerUnit - option.premium) * units;
            // check price is greater than 0
            require(price > 0, "GasHedger: option isnt solvible");
            // Transfer collateral from the contract to the writer
            require(IERC20(usdcAddress).transfer(msg.sender, price), "GasHedger: failed to transfer usdc");
        } else {
        // Check if the buyer has enough units
        require(balanceOf(msg.sender, id) >= units, "GasHedger: not enough units");
        // Burn option NFT from the buyer
        _burn(msg.sender, id, units);
        // Calculate total collateral
        price = option.premium * units;
        // Transfer collateral from the contract to the buyer
        require(IERC20(usdcAddress).transfer(msg.sender, price), "GasHedger: failed to transfer usdc");
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
        require(!isActive(option.statuses), "GasHedger: option activated");
        // Check if option is not already claimed
        require(!hasToPay(option.statuses), "GasHedger: ongoing option");
        // Transfer collateral from the contract to the writer
        require(
            IERC20(usdcAddress).transfer(
                option.writer,
                option.units * option.capPerUnit
            ),
            "GasHedger: failed to transfer usdc"
        );
        // Delete option
        delete options[id];
        emit OptionDeleted(id);
    }

    function setExhausted(uint index) internal {
        exhaustedArrays[index] = true;
    }

    function checkUpkeep(
        bytes calldata checkdata
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
            require(optionId != 0, "GasHedger: invalid option id");
            // Get option from storage
            Option storage option = options[optionId];
            // Check if option is paused
            require(!isPaused(option.statuses), "GasHedger: option paused");
            // Check if option is expired
            require(
                block.timestamp >= option.expirationDate,
                "GasHedger: option id dosen't exist"
            );
            // Check if option is deactived
            require(isActive(option.statuses), "GasHedger: option is not active");
            // Check if option is not already claimed
            require(!hasToPay(option.statuses), "GasHedger: ongoing option");
            // Send request to Chainlink
            
            bytes32 requestId = _invokeSendRequest(
                optionId,
                option.chainId
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
        uint optionId,
        uint chainId
    ) internal returns (bytes32) {
        // Get query id
        string memory query;
        string[] memory args;
        
        
        // Create request
        FunctionsRequest.Request memory req;
        // Initialize the request with JS code
        req.initializeRequestForInlineJavaScript(query);
        // Set the arguments for the request
        req.setArgs(arg);
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
                  IERC20(usdcAddress).transfer(
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
                    IERC20(usdcAddress).transfer(
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
                IERC20(usdcAddress).transfer(
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
                    IERC20(usdcAddress).transfer(
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
    
}