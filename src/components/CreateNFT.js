import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import { useLocation, useParams } from 'react-router-dom';
import {  useState } from 'react';
import Marketplace from "../Marketplace.json";
import React from 'react';
import { storage, db } from '../firebase'
import { v4 } from "uuid";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc, arrayUnion, query, where, onSnapshot, snapshotEqual} from 'firebase/firestore';
import { useEffect } from "react";
import CreateNFTCard from "./CreateNFTCard";
import CreationCard from "./CreationCard";
import '../style1.css'


export default function CreateNFT() {
    const [ data, setData ] = useState();
    const [ names, setNames ] = useState('');
    const [ descriptions, setDescriptions ] = useState('');
    const [ prices, setPrices ] = useState('');
    const [ identifiers, setIdentifiers ] = useState('');
    const [ ipfsImageURL, setIpfsImageURL ] = useState('');
    const ethers = require("ethers");
    const collectionRef = collection(db, "Collection");

    let { id } = useParams();
    const q = query(collectionRef, where("DocumentID","==",id))
    

useEffect(()=>{
    onSnapshot(q, (snapshot) =>{
    setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    setNames(snapshot.docs.map(doc => doc.data().Name))   
    setDescriptions(snapshot.docs.map(doc => doc.data().Description))
    setPrices(snapshot.docs.map(doc => doc.data().Price))
    setIdentifiers(snapshot.docs.map(doc => doc.data().Identifier)) 
    setIpfsImageURL(snapshot.docs.map(doc => doc.data().NFTImageIPFS))
})},[])

const name = names[0]
const description = descriptions[0]
const price = "0.03"
const identifier = identifiers[0]


async function uploadMetadataToIPFS() {
    if( !name || !description || !price || !ipfsImageURL)
        return;

    const nftJSON = {
        name, 
        description,
        price,
        image: ipfsImageURL
    }

    try {
        //upload the metadata JSON to IPFS
        const response = await uploadJSONToIPFS(nftJSON);
        if(response.success === true){
            console.log("Uploaded JSON to Pinata: ", response)
            return response.pinataURL;
        }
    }
    catch(e) {
        console.log("error uploading JSON metadata:", e)
    }
}


async function listNFT(e) {
    e.preventDefault();
    try {
        const metadataURL = await uploadMetadataToIPFS();

        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        //Pull the deployed contract instance
        let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)
        
        //massage the params to be sent to the create NFT request
        const price2 = ethers.utils.parseUnits('0.03', 'ether')
        // console.log('price2: '+ price2)
        let listingPrice = await contract.getListPrice()
        listingPrice = listingPrice.toString()

        // console.log('lsting price: ' + listingPrice)
        // console.log('url ' + metadataURL);
        // console.log('identifier ' + identifier)
        const dateInSecs = Math.floor(new Date().getTime() / 1000);


        //actually create the NFT
        let transaction = await contract.createToken(metadataURL, price2, identifier, dateInSecs,  { value: listingPrice })
        await transaction.wait()

        alert("Successfully listed your NFT!");
        contract.on("TokenCreated", (_tokenId, _identifier,_price,_time,  _status,_details,_expert,_uri, event ) => {
            let info = {
                tokenId: _tokenId.toNumber(),
                tokenIdentifier: _identifier,
                verificationFileURI: _uri,
                price: _price,
                timeCreated: _time,
                verificationDetails: _details,
                expertAddress: _expert,
                verificationStatus: _status,
                transactionData: event
            }
            console.log(JSON.stringify(info, null, 4))
        })
       // window.location.replace("/")
    }
    catch(e) {
        alert( "Upload error"+e )
    }
}
    
  return (
       <div className="wrapper">
        <ul>
        {(data) ? data.map((value) => (
          <div>
            <CreationCard collectionData = {value}/>
            <button onClick={listNFT}
            style={{
                border:'3px solid black', 
                marginTop:75, 
                padding:20,
                position:'relative',
                left:'40%',
                borderRadius:999
                }}> Create NFT </button>
          </div>
        )):null}
      </ul>

       </div> 
  )
}


