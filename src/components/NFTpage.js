import Navbar from "./Navbar";
import { useLocation, useParams } from 'react-router-dom';
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState, useContext} from "react";
import { LoginContext } from './LoginContext'


export default function NFTPage (props) {
const { data, setData } = useContext(LoginContext);

const [tokenData, updateData] = useState({});
const [dataFetched, setIfDataFetched] = useState(false);
const [message, updateMessage] = useState("");
const [currAddress, updateCurrAddress] = useState("0x");

async function getNFTData(tokenId) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    const tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedTokenForId(tokenId);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    console.log(listedToken);

    let item = {
        price: meta.price,
        tokenId: tokenId,
        seller: listedToken.seller,
        owner: listedToken.owner,
        image: meta.image,
        name: meta.name,
        description: meta.description,
        verified: listedToken.currentVerificationStatus.verified,
        status: listedToken.currentVerificationStatus.status,
        verifiedBy: listedToken.currentVerificationStatus.expertAddress,
        details: listedToken.currentVerificationStatus.details
    }
    console.log(item);
    updateData(item);
    setIfDataFetched(true);
    console.log("address", addr)
    updateCurrAddress(addr);
}

async function buyNFT(tokenId) {
    try {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const dateInSecs = Math.floor(new Date().getTime() / 1000);

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
        const salePrice = ethers.utils.parseUnits(tokenData.price, 'ether')
        updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
        //run the executeSale function
        let transaction = await contract.executeSale(tokenId,dateInSecs, {value:salePrice});
        await transaction.wait();

        alert('You successfully bought the NFT!');
        updateMessage("");
    }
    catch(e) {
        alert("Upload Error"+e)
    }
}

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);

    return(
        <div style={{"min-height":"100vh"}}>
            <div className="flex ml-20 mt-20">
                <img src={tokenData.image} alt="" className="w-2/5" />
                <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
                    <div>
                        Token ID: {tokenData.tokenId}
                    </div>
                    
                    <div>
                        Name: {tokenData.name}
                    </div>
                    <div>
                        Description: {tokenData.description}
                    </div>
                    <div>
                        Price: <span className="">{tokenData.price + " ETH"}</span>
                    </div>
                    <div>
                        Owner: <span className="text-sm">{tokenData.owner}</span>
                    </div>
                    <div>
                        Seller: <span className="text-sm">{tokenData.seller}</span>
                    </div>
                    <div>
                        Verified: <span className="text-sm">{tokenData.verified}</span>
                    </div>
                    <div>
                        Verified By: <span className="text-sm">{tokenData.verifiedBy}</span>
                    </div>
                    <div>
                        Status: <span className="text-sm">{tokenData.status}</span>
                    </div>
                    <div>
                        Verification Details: <span className="text-sm">{tokenData.details}</span>
                    </div>

                    <div>
                    { currAddress == tokenData.owner || currAddress == tokenData.seller ?
                        <button disable = {!(data.accountType === 'collector' && !(data.address === '0x'))} className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
                        : <div className="text-emerald-700">You are the owner of this NFT</div>
                    }
                    
                    <div className="text-green text-center mt-3">{message}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}