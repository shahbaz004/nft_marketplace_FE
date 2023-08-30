import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import NFT from '../NFT.json';
import NFTTile from './NFTTile';
import Navbar from './Navbar';
import SolarSystem from './SolarSystem';

export default function Profile() {
  const [data, setData] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [address, setAddress] = useState('');
  const [totalNFTs, setTotalNFTs] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);

      const contract = new ethers.Contract(NFT.address, NFT.abi, signer);
      const tokenIds = await contract.getMintedNFTsByOwner(address);

      const items = await Promise.all(
        tokenIds.map(async (tokenId) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const { data: meta } = await axios.get(tokenURI);

          return {
            tokenId: tokenId.toNumber(),
            image: meta.image,
            name: meta.name,
            description: meta.description,
          };
        })
      );

      setData(items);
      setDataFetched(true);
      setTotalNFTs(items.length);
    } catch (error) {
      console.log("Data fetching error:", error);
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
