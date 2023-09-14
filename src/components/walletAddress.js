import React, { useEffect } from 'react';

function MetaMaskAddress() {
  useEffect(() => {
    async function fetchWalletAddress() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts.length > 0) {
            const address = accounts[0];
            console.log('Connected Wallet Address:', address);
          } else {
            console.log('No accounts found.');
          }
        } catch (err) {
          console.error('MetaMask connection failed. Please make sure MetaMask is installed and unlocked.');
          console.error(err);
        }
      } else {
        console.error('MetaMask is not installed.');
      }
    }

    fetchWalletAddress();
  }, []);

  return null;
}

export default MetaMaskAddress;
