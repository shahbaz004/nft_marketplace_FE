import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Icon } from '@mui/material';
import WalletIcon from '@mui/icons-material/Wallet';


function Navbar() {
  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState('0x');
  const [balance, setBalance] = useState('');

  async function getAddress() {
    try {
      const ethers = require("ethers");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      updateAddress(addr);
      const balanceWei = await provider.getBalance(addr);
      const balanceEther = ethers.utils.formatEther(balanceWei);
      const a = Number(balanceEther).toFixed(2);
      setBalance(a);
    } catch (error) {
      console.log("Error in getAddress:", error);
    }
  }

  function updateButton() {
    try {
      const ethereumButton = document.querySelector('.enableEthereumButton');
      if (ethereumButton) {
        ethereumButton.textContent = "Connected";
        ethereumButton.classList.remove("hover:bg-blue-70");
        ethereumButton.classList.remove("bg-blue-500");
        ethereumButton.classList.add("hover:bg-green-70");
        ethereumButton.classList.add("bg-green-500");
      }
    } catch (error) {
      console.log("Error in updateButton:", error);
    }
  }


  async function connectWebsite() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(() => {
          updateButton();
          getAddress();
          window.location.replace(location.pathname)
        });
    } catch (error) {
      console.log("Error in connectWebsite:", error);
    }
  }

  useEffect(() => {
    if (window.ethereum === undefined)
      return;

    let val = window.ethereum.isConnected();

    if (val) {
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on('accountsChanged', function (accounts) {
      window.location.replace(location.pathname)
    });
  }, [location.pathname]);

  return (
    <div className="">
      <nav className="w-screen">
        <ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
          <li className='flex items-end ml-5 pb-2'>
            <Link to="/">
              <div className='inline-block font-bold text-xl ml-2'>
                Demo Marketplace
              </div>
            </Link>
          </li>
          <li className='w-2/6'>
            <ul className='lg:flex justify-between font-bold mr-10 text-lg'>
              {location.pathname === "/" ?
                <li className='border-b-2 hover:pb-0 p-2'>
                  <Link to="/">Marketplace</Link>
                </li>
                :
                <li className='hover:border-b-2 hover:pb-0 p-2'>
                  <Link to="/">Marketplace</Link>
                </li>
              }
              {location.pathname === "/sellNFT" ?
                <li className='border-b-2 hover:pb-0 p-2'>
                  <Link to="/sellNFT">Create NFT</Link>
                </li>
                :
                <li className='hover:border-b-2 hover:pb-0 p-2'>
                  <Link to="/sellNFT">Create NFT</Link>
                </li>
              }
              {location.pathname === "/profile" ?
                <li className='border-b-2 hover:pb-0 p-2'>
                  <Link to="/profile">Profile</Link>
                </li>
                :
                <li className='hover:border-b-2 hover:pb-0 p-2'>
                  <Link to="/profile">Profile</Link>
                </li>
              }

              {location.pathname === "/soldData" ?
                <li className='border-b-2 hover:pb-0 p-2'>
                  <Link to="/soldData">SoldNfts</Link>
                </li>
                :
                <li className='hover:border-b-2 hover:pb-0 p-2'>
                  <Link to="/soldData">SoldNfts</Link>
                </li>
              }
              <li>
                <div style={{ display: 'flex' }}>
                  <Icon color="currentColor" fontSize="large">
                    <WalletIcon />
                  </Icon>
                  <button onClick={connectWebsite}>{connected ? `${balance} ETH` : "Connect Wallet"}</button>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className='text-white text-bold text-right mr-10 text-sm'>
        {currAddress !== "0x" ? `Connected to ${currAddress.substring(0, 15)}...` : "Not Connected. Please login to view NFTs"}
      </div>
    </div>
  );
}

export default Navbar;