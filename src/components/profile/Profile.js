import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import NFT from '../../NFT.json';
import NFTTile from '../NFTTile';
import Navbar from '../Navbar';
import SolarSystem from '../SolarSystem';

export default function Profile() {
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [address, setAddress] = useState('');
  const [totalNFTs, setTotalNFTs] = useState(0);

  console.log("========datass=======",data);

  const fetchData = async()=> {
    console.log("fetchData function called");

    const url = 'http://127.0.0.1:8001/api/nfts/'

    let response = await axios.get(url)
    const data = response.data
    console.log("=======result=========",response.data);
    const items = data.map((nft) => {
      return {
        tokenId: nft.token_id,
        name: nft.name,
        description: nft.description,
        image_url: nft.image_url,
        owner: nft.owner,
      };
    })
    console.log("==========items=========",items);
    setData(items);
    setDataFetched(true);
    setTotalNFTs(items.length);
  }

  useEffect(() => {
    console.log("Log ")
    fetchData();
  }, []);


  if (!dataFetched) {
    return (
      <div style={{ flex: 1, height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <SolarSystem />
      </div>
    );
  }

  return (
    <div className="profileClass" style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="profileClass">
        <div className="flex text-center flex-col mt-11 md:text-2xl text-white">
          <div className="mb-5">
            <h2 className="font-bold">Wallet Address</h2>
            {address}
          </div>
        </div>
        <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-white">
          <div>
            <h2 className="font-bold">No. of NFTs</h2>
            {totalNFTs}
          </div>
        </div>
        <div className="flex flex-col text-center items-center mt-11 text-white">
          <h2 className="font-bold">Your NFTs</h2>
          <div className="flex mt-5 justify-around flex-wrap max-w-screen-xl text-center">
            {data.map((value, index) => (
              <NFTTile data={value} key={index} />
            ))}
          </div>
          <div className="mt-10 text-xl">
            {data.length === 0 && dataFetched
              ? 'Oops, No NFT data to display (Are you logged in?)'
              : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
