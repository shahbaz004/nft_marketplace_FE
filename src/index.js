import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import SellNFT from './components/SellNFT';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import NFTPage from './components/NFTpage';
import SellPage from './components/Sellpage';
import SoldData from './components/SoldData';
import SoldPage from './components/SoldPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
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
  </React.StrictMode>
);

reportWebVitals();

