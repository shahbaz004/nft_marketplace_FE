import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import SellTile from "./SellTile";
import NFT from "../NFT.json";
import axios from "axios";
import SolarSystem from "./SolarSystem";

export default function Marketplace() {
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    getAllNFTs();
  }, []);

  async function getAllNFTs() {
    if(window.ethereum){
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const ethers = require("ethers");

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        const contract = new ethers.Contract(NFT.address, NFT.abi, signer);
        const tokenIds = await contract.getAvailableNFTs();

        const items = await Promise.all(
          tokenIds.map(async (tokenId) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const { data: meta } = await axios.get(tokenURI);
            const { price } = await contract.getTokenDetails(tokenId);
            const formattedPrice = ethers.utils.formatEther(price);

            return {
              tokenId: tokenId.toNumber(),
              image: meta.image,
              name: meta.name,
              description: meta.description,
              price: formattedPrice,
            };
          })
        );

        setData(items);
        setDataFetched(true);
      } catch (error) {
        alert("Check if your MetaMask is connected?")
      }
    }
  }
  if (!dataFetched) {
    return (
      <div style={{ flex: 1, height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <SolarSystem />
      </div>
    );
  }

  return (
    <div style={{ flex: 1,minHeight:"100vh", height: "100%", margin: "0", padding: "0" }}>
      <Navbar />
      <div className="flex flex-col place-items-center mt-20">
        <div className="md:text-xl font-bold text-white">Top NFTs</div>
        <div className="flex mt-5 justify-around flex-wrap max-w-screen-xl text-center">
          {data.map((value, index) => (
            <SellTile data={value} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
