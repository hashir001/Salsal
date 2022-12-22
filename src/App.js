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
import { extendTheme } from "@chakra-ui/react"
import BoardRoute from './components/BoardRoute';
import ExpertProfile from './components/ExpertProfile';
import BoardNotifications from './components/BoardNotifications';
import Notifications from './components/Notifications';
import AdminRoute from './components/AdminRoute';
import AdminPage from './components/AdminPage';
import BoardChat from './components/BoardChat';
import PendingCollections from './components/PendingCollections';
import ApprovedCollections from './components/ApprovedCollections';
import RejectedCollections from './components/RejectedCollections';
import ExpertNotifications from './components/ExpertNotifications';


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
        {/* accessible to everyone */}
        <Route path="/" element={<LandingPage />}/>
        <Route path="/marketplace" element={<Marketplace />}/>        
        
        {/* accessible to expert only*/}
        <Route element={<ExpertRoute />}>
        <Route path="/verify" element={<Verify />} />
        <Route path="/reqverify/:id" element={<ReqVerify />}/>  
        <Route path="/chat/:id" element={<ChatRoom />}/>  
        <Route path="/vote/:id" element={<Vote />} />
        <Route path="/expertprofile/:id" element={<ExpertProfile />}/>
        <Route path="/pending/:id" element={<PendingCollections />}/>
        <Route path="/approved/:id" element={<ApprovedCollections />}/>
        <Route path="/rejected/:id" element={<RejectedCollections />}/>
        </Route>

        {/* accessible to collector only */}
        <Route element={<CollectorRoute />}>
        <Route path="/upload" element={<UploadNFT />} /> 
        <Route path="/verified" element={<VerifiedCollections />} /> 
        <Route path="/createnft/:id" element={<CreateNFT />}/>
        <Route path="/profile/:id" element={<Profile />}/> 
        <Route path="/nftPage/:tokenId" element={<NFTPage />}/>
        <Route path="/editprofile" element={<EditCollectorProfile />}/>
        
        </Route> 

        
        <Route path="/notif/:id" element={<Notifications />}/>
        



        {/* accessible to board only */}
        <Route element={<BoardRoute />}>
        <Route path="/board/" element={<AgencyPage />}/>
        <Route path="/boardno" element={<BoardNotifications />}/>
        <Route path="/boardverify/:id" element={<BoardVerify />} />
        <Route path="/collectiondetails/:id" element={<CollectionDetails />}/>
        <Route path="/expertsubmission/:id" element={<ExpertSubmission />} />
        <Route path="/boardchat/:id" element={<BoardChat />}/>
        </Route>

        <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPage />}/>
        </Route>

      </Routes>
    </BrowserRouter>
  </LoginContext.Provider>
  </ChakraProvider>
  </MantineProvider>
</div>
  );
}
