import './App.css';
import Navbar from './components/Navbar.js';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import SellNFT from './components/SellNFT';
import NFTPage from './components/NFTpage';
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { createContext } from "react";
import ExpertDashboard from './components/ExpertDashboard';
import Verify from './components/Verify';
import ReqVerify from './components/ReqVerify';
import UploadNFT from './components/UploadNFT';
import SignIn from './components/SignIn';
import { LoginContext } from './components/LoginContext';
import { useState } from 'react';
import CreateNFT from './components/CreateNFT';
import VerifiedCollections from './components/VerifiedCollections';
import Home from './components/Home';
import CollectorRoute from './components/CollectorRoute';
import ExpertRoute from './components/ExpertRoute';
import Mission from './components/Mission';
import Contact from './components/Contact';
import About from './components/About';

export default function App() {
const [ data, setData ] = useState({accountType:'', connectedToMetaMask: false, address:'0x'});

return (
<div>
  <LoginContext.Provider value = {{ data, setData }}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/marketplace" element={<Marketplace />}/>   
        <Route path="/mission" element={<Mission />}/> 
        <Route path="/contact" element={<Contact />}/>
        <Route path="/about" element={<About />}/>        
     
        <Route element={<ExpertRoute />}>
        <Route path="/verify" element={<Verify />} />
        <Route path="/reqverify/:id" element={<ReqVerify />}/>  
        </Route>

        <Route element={<CollectorRoute />}>
        <Route path="/upload" element={<UploadNFT />} /> 
        <Route path="/verified" element={<VerifiedCollections />} /> 
        <Route path="/createnft/:id" element={<CreateNFT />}/>
        <Route path="/profile" element={<Profile />}/> 
        <Route path="/nftPage/:tokenId" element={<NFTPage />}/> 
        </Route> 

      </Routes>
    </BrowserRouter>
  </LoginContext.Provider>
</div>
  );
}
