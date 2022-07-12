const hre = require("hardhat");

async function main() {
  const Airdrop = await hre.ethers.getContractFactory("Airdrop");
  const airdrop = await Airdrop.deploy();

  await airdrop.deployed();

  console.log("Airdrop deployed to:", airdrop.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
