const hre = require("hardhat");

async function main() {
    const AuthContract = await hre.ethers.getContractFactory("AuthContract");
    const authContract = await AuthContract.deploy();

    await authContract.deployed();

    console.log("AuthContract deployed to:", authContract.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});