import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SellNFT from './components/createNft/SellNFT';
import Marketplace from './components/marketplace/Marketplace';
import Profile from './components/profile/Profile';
import NFTPage from './components/nftDetail/NFTpage';
import SellPage from './components/buyNft/Sellpage';
import SoldData from './components/soldNft/SoldData';
import SoldPage from './components/soldNft/SoldPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.Fragment>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Marketplace />}/>
        <Route path="/sellNFT" element={<SellNFT />}/> 
        <Route path="/nftPage/:tokenId" element={<NFTPage />}/>    
         <Route path="/sellPage/:tokenId" element={<SellPage />}/> 
         <Route path="/soldPage/:tokenId" element={<SoldPage/>}/>      
        <Route path="/profile" element={<Profile />}/> 
        <Route path="/soldData" element={<SoldData/>}/> 
      </Routes>
    </BrowserRouter>
  </React.Fragment>
);

reportWebVitals();

