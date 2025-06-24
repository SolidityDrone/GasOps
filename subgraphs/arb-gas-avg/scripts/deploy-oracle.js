const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying GasPriceOracle...");

    const GasPriceOracle = await ethers.getContractFactory("GasPriceOracle");
    const gasPriceOracle = await GasPriceOracle.deploy();

    await gasPriceOracle.deployed();

    console.log("GasPriceOracle deployed to:", gasPriceOracle.address);
    console.log("Update the address in subgraph.yaml to:", gasPriceOracle.address);

    // Verify the contract on Etherscan (optional)
    console.log("To verify on Etherscan, run:");
    console.log(`npx hardhat verify --network mainnet ${gasPriceOracle.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 