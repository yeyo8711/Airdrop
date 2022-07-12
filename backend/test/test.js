const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseUnits(num.toString(), 0);
const fromWei = (num) => ethers.utils.formatUnits(num, 0);

describe("Airdrop", async function () {
  let deployer, add1, add2, add3, add4, add5, testToken, airdrop;

  beforeEach(async function () {
    // Get contract factories
    const TestToken = await ethers.getContractFactory("TestToken");
    const Airdrop = await ethers.getContractFactory("Airdrop");

    // Deploy Contracts
    testToken = await TestToken.deploy();
    airdrop = await Airdrop.deploy();
    // Get signers
    [deployer, add1, add2, add3, add4, add5] = await ethers.getSigners();
  });
  describe("Set a wallet/deposits", function () {
    it("Adds wallets", async function () {
      const arr = [add1.address, add2.address, add3.address, add4.address];
      await airdrop.addWalletsToAirdrop(arr);
      expect(await airdrop.getAddresses()).to.deep.equal(arr);
    });

    it("Deposits Token to contract", async function () {
      // Set approvals
      testToken.approve(airdrop.address, toWei(10000));
      // Trasnfers tokens to contract
      await airdrop.addTokensToAirdrop(testToken.address, toWei(10000));
      expect(await airdrop.balance(testToken.address)).to.equal(toWei(10000));
    });
  });
  describe("Performs full Airdrop", function () {
    beforeEach(async function () {
      const arr = [add1.address, add2.address, add3.address, add4.address];
      await airdrop.addWalletsToAirdrop(arr);
      await testToken.approve(airdrop.address, toWei(10000));
      await airdrop.addTokensToAirdrop(testToken.address, toWei(10000));
    });
    it("Airdrops token", async function () {
      await airdrop.startAirdrop(testToken.address);
      expect(await testToken.balanceOf(add1.address)).to.equal(toWei(2500));
      expect(await testToken.balanceOf(add2.address)).to.equal(toWei(2500));
      expect(await testToken.balanceOf(add3.address)).to.equal(toWei(2500));
      expect(await testToken.balanceOf(add4.address)).to.equal(toWei(2500));
    });

    it("Withdraws tokens", async function () {
      await airdrop.removeTokens(testToken.address);
      const totalSupply = await testToken.totalSupply();
      expect(await testToken.balanceOf(deployer.address)).to.equal(
        fromWei(totalSupply)
      );
    });
  });
});
