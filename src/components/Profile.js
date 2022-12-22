
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";

import NFTTile from "./NFTTile";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import { useLocation, useParams, Link } from 'react-router-dom';
import {  useState, useContext } from 'react';
import Marketplace from "../Marketplace.json";
import React from 'react';
import { storage, db, } from '../firebase'
import { v4 } from "uuid";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { collection, addDoc, getDocs,getDoc, serverTimestamp, updateDoc, doc, arrayUnion, query, 
  where, onSnapshot, increment,snapshotEqual, writeBatch} from 'firebase/firestore';
import { useEffect } from "react";
import VerifyCard from "./VerifyCard";
import '../style1.css'
import ReqCard from "./ReqCard";
import { LoginContext } from './LoginContext'
import firebase from "firebase/compat/app"
import 'firebase/compat/firestore';
import {useAuth} from '../firebase'

export default function Profile () {
    const currentUser = useAuth();
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState("0");

    const [userName, setUserName] = useState('')
    const [about, setAbout] = useState('')

    
    //let docRef = doc(db, "Accounts", documentID.toString())
    // if(currentUser != undefined){
    //     
    // }
    //{currentUser?.uid? docRef = doc(db, 'Accounts',currentUser.uid):<></>}
    let { id } = useParams();

    let docRef = doc(db, 'Accounts',id)

    useEffect(()=>{
        onSnapshot(docRef, (doc) =>{
            setUserName(doc.data().name)   
            setAbout(doc.data().about)
    })},[])


    async function getNFTData(tokenId) {
        const ethers = require("ethers");
        let sumPrice = 0;
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();

        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)

        //create an NFT Token
        let transaction = await contract.getMyNFTs()

        /*
        * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
        * and creates an object of information that is to be displayed
        */
        
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
            sumPrice += Number(price);
            return item;
        }))

        updateData(items);
        updateFetched(true);
        updateAddress(addr);
        updateTotalPrice(sumPrice.toPrecision(3));
    }
    console.log('hi')

    const params = useParams();
    const tokenId = params.tokenId;
    if(!dataFetched)
        getNFTData(tokenId);

    console.log(currentUser)

    return (
        <div className="wrapper">
            <h3 style={{color:'black'}}>Name: {userName}</h3>
            <h3 style={{color:'black'}}>Email: {currentUser?.email}</h3>
            <h2 style = {{position:'relative',top:0,fontSize:26,textAlign:'center',color:'black'}}className="font-bold">Wallet Address</h2>  
                    <p style = {{fontSize:18,textAlign:'center',color:'white'}}>{address}</p>
        <div className="profileClass" style={{"min-height":"100vh"}}>
            <div className="profileClass">
           
            <div className="flex flex-row text-center justify-center mt-10 md:text-2xl text-black">
                    <div className="text-black">
                        <h2 className="font-bold text-black">No. of NFTs</h2>
                        {data.length}
                    </div>
                    <div className="ml-20 text-black">
                        <h2 className="font-bold text-black">Total Value</h2>
                        {totalPrice} ETH
                    </div>
            </div>
            <div className="flex flex-col text-center items-center mt-11 text-black">
                <h2 className="font-bold text-black">Your NFTs</h2>
                <div className="flex justify-center flex-wrap max-w-screen-xl">
                    {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                    })}
                </div>
            
            </div>
            </div>
        </div>
        </div>
    )
};