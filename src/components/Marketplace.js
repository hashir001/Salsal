import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { useContext } from "react";
import  appContext  from "../App";
import { LoginContext } from './LoginContext'
import '../style1.css';


export default function Marketplace() {


const [thedata, updateData] = useState([]);
const [dataFetched, updateFetched] = useState(false);

const { data, setData } = useContext(LoginContext)

async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    let transaction = await contract.getAllNFTs()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

console.log('Data fetched? ' + dataFetched);
console.log(thedata)
if(!dataFetched)
    getAllNFTs();

return (
    <div className="wrapper md:text-xl font-medium text-black">
       <p style={{fontSize:36,textAlign:'center',position:'relative',top:80}}>Verified NFT Collections</p> 
        <div className=" flex flex-col place-items-center mt-20">
           
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                {thedata.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
);

}