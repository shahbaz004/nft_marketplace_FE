const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.getBalance();
  console.log("Balance",balance);

  const Nft = await hre.ethers.getContractFactory("NFTMarketplace");
  const nft= await Nft.deploy();
 
  await nft.deployed();
  console.log("Nft Deployed to",nft.address);

  const data = {
    address: nft.address,
    abi: JSON.parse(nft.interface.format('json'))
  }

  fs.writeFileSync('./src/NFT.json',JSON.stringify(data))
  console.log("Abi saved to: ./src/NFT.json")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
