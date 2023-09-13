import React, { useState, useEffect } from "react";
import Navbar from "../Navbar";
import SellTile from "../SellTile";
import NFT from "../../NFT.json";
import axios from "axios";
import SolarSystem from "../SolarSystem";
import { AssistWalker } from "@mui/icons-material";

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

        const url = 'http://127.0.0.1:8001/api/user-profile/'
        const payload = {
          wallet_address: accounts[0]
        }
        axios.post(url, payload)
        
        const ethers = require("ethers");

        const marketplaceUrl = 'http://127.0.0.1:8001/api/marketplace/'
        let response = await axios.get(marketplaceUrl)
        console.log("========res===========",response.data);


        const items = response.data.map(item => ({
          image: item.image,
          name: item.name,
          description: item.description,
          price: item.price,
          tokenId: item.token_id,
          status: item.is_active
        }));
        console.log("=============items==========",items);
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
