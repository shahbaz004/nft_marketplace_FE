import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';
import MarketplaceJSON from '../NFT.json';
import Navbar from './Navbar';
import { GetIpfsUrlFromPinata } from '../utils';

export default function SoldPage() {
  const [data, setData] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const [message, updateMessage] = useState('');

  const params = useParams();
  const tokenId = params.tokenId;

  async function getNFTData(tokenId) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
      const tokenURI = await contract.tokenURI(tokenId);
      const tokenURIWithIpfs = GetIpfsUrlFromPinata(tokenURI);
      const meta = await axios.get(tokenURIWithIpfs);
      const tokenDetails = await contract.getTokenDetails(tokenId);

      const item = {
        tokenId: tokenId,
        seller: tokenDetails.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        price: ethers.utils.formatEther(tokenDetails.price),
        sold: tokenDetails.isSold.toString(),
        creator: tokenDetails.creator,
      };

      setData(item);
      setDataFetched(true);
      updateMessage('');
    } catch (error) {
      console.log('Error fetching NFT data:', error);
    }
  }

  useEffect(() => {
    if (!dataFetched) {
      getNFTData(tokenId);
    }
  }, [dataFetched, tokenId]);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="flex ml-20 mt-40" style={{ alignContent: 'center', justifyContent: 'center' }}>
        <img src={data.image} alt="" className="w-2/5" style={{ height: '50vh', width: '50vh', borderRadius: '10px' }} />
        <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5" style={{ height: '50vh' }}>
          <div>
            Name: {data.name}
          </div>
          <div>
            Description: {data.description}
          </div>
          <div>
            Price: <span className="">{data.price + ' ETH'}</span>
          </div>
          <div>
            Status: Sold
          </div>
          <div>
            Buyer: <span className="text-sm">{data.seller}</span>
          </div>
          <div>
            Creator: <span className="text-sm">{data.creator}</span>
          </div>
          <div>
            <div className="text-green text-center mt-3">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
