import './App.css';
import Navbar from './components/Navbar.js';
import { MantineProvider } from '@mantine/core';
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
import { LoginContext } from './components/LoginContext';
import { useState } from 'react';
import CreateNFT from './components/CreateNFT';
import VerifiedCollections from './components/VerifiedCollections';
import Home from './components/Home';
import CollectorRoute from './components/CollectorRoute';
import ExpertRoute from './components/ExpertRoute';
import LandingPage from './components/LandingPage';
import { ChakraProvider } from '@chakra-ui/react'
import ChatRoom from './components/ChatRoom';
import CollectionDetails from './components/CollectionDetails';
import AgencyPage from './components/AgencyPage';
import EditCollectorProfile from './components/EditCollectorProfile';
import Verified from './components/Verified';
import Vote from './components/Vote';
import ExpertSubmission from './components/ExpertSubmission';
import BoardVerify from './components/BoardVerify';



export default function App() {
const [ data, setData ] = useState({email:'', accountType:'', connectedToMetaMask: false, address:'0x',uid:''});

return (
<div>
<MantineProvider withGlobalStyles withNormalizeCSS>
<ChakraProvider>
  <LoginContext.Provider value = {{ data, setData }}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/marketplace" element={<Marketplace />}/>        
        
        <Route element={<ExpertRoute />}>
        <Route path="/verify" element={<Verify />} />
        <Route path="/reqverify/:id" element={<ReqVerify />}/>  
        <Route path="/chat/:id" element={<ChatRoom />}/>  
        </Route>

        <Route element={<CollectorRoute />}>
        <Route path="/upload" element={<UploadNFT />} /> 
        <Route path="/verified" element={<VerifiedCollections />} /> 
        <Route path="/createnft/:id" element={<CreateNFT />}/>
        <Route path="/profile/:id" element={<Profile />}/> 
        <Route path="/nftPage/:tokenId" element={<NFTPage />}/>
        
        </Route> 
        <Route path="/editprofile" element={<EditCollectorProfile />}/>
        <Route path="/collectiondetails/:id" element={<CollectionDetails />}/>
        <Route path="/board/" element={<AgencyPage />}/>
        <Route path="/verified" element={<Verified />} />
        <Route path="/vote/:id" element={<Vote />} />
        <Route path="/expertsubmission/:id" element={<ExpertSubmission />} />
        <Route path="/boardverify/:id" element={<BoardVerify />} />

      </Routes>
    </BrowserRouter>
  </LoginContext.Provider>
  </ChakraProvider>
  </MantineProvider>
</div>
  );
}
