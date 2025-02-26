const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AuthContract", function () {
    let AuthContract, authContract, owner, addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        AuthContract = await ethers.getContractFactory("AuthContract");
        authContract = await AuthContract.deploy();
        await authContract.deployed();
    });

    it("Should verify a user", async function () {
        await authContract.verifyUser(addr1.address);
        expect(await authContract.isVerified(addr1.address)).to.equal(true);
    });

    it("Should not verify an already verified user", async function () {
        await authContract.verifyUser(addr1.address);
        await expect(authContract.verifyUser(addr1.address)).to.be.revertedWith("User already verified");
    });
});