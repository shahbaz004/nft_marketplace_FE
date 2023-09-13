import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import NFT from '../../NFT.json';
import Navbar from '../Navbar';
import SoldNFT from '../SoldNft';
import SolarSystem from '../SolarSystem';

export default function Profile() {
  const [sold, setSold] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [address, setAddress] = useState('');
  const [totalNFTs, setTotalNFTs] = useState(0);

  async function getSoldNFTs() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(NFT.address, NFT.abi, signer);
      const walletAddress = await signer.getAddress();
      setAddress(walletAddress);

      const result = await contract.getSoldNFTs();

      const items = await Promise.all(
        result.map(async (tokenId) => {
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

      setSold(items);
      setDataFetched(true);
      setTotalNFTs(items.length);
    } catch (error) {
      console.log('Error fetching sold NFTs:', error);
    }
  }

  useEffect(() => {
    getSoldNFTs();
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
        <div className="flex flex-row text-center justify-around mt-10 md:text-2xl text-white">
          <div>
            <h2 className="font-bold">No. of NFTs</h2>
            {totalNFTs}
          </div>
        </div>
        <div className="flex flex-col text-center items-center mt-11 text-white">
          <h2 className="font-bold">Your NFTs</h2>
          <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
            {sold.map((value, index) => (
              <SoldNFT data={value} key={index} />
            ))}
          </div>
          <div className="mt-10 text-xl">
            {sold.length === 0 && dataFetched ? 'Oops, No NFT data to display (Are you logged in?)' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
