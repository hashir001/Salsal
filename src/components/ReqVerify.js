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
import VerifyCard from "./VerifyCard";
import '../style1.css'
import ReqCard from "./ReqCard";


export default function Verify() {
    const [ data, setData ] = useState();
    const [ names, setNames ] = useState('');
    const [ nftImgs, setNftImgs ] = useState([]);
    const [ docIDs, setDocIDs ] = useState([]);
    const [ descriptions, setDescriptions ] = useState([]);
    const [ secondaryUrls, setsecondaryUrls ] = useState(); //array within an array
    const [ prices, setPrices ] = useState([]);
    const [ fileURL, setFileURL ] = useState('');
    const [ status, setStatus ] = useState('');
    const [ identifier, setIdentifier ] = useState('');
    const [ verified, setVerified ] = useState('');
    const [ details, setDetails ] = useState('');
    const [ documentID, setDocumentID ] = useState('');

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
    setNftImgs(snapshot.docs.map(doc => doc.data().NFTImageURL))
    setIdentifier(snapshot.docs.map(doc => doc.data().Identifier)) 
    setDocumentID(snapshot.docs.map(doc => doc.data().DocumentID))
    setsecondaryUrls(snapshot.docs.map(doc => doc.data().SecondaryImageURLs))

})},[])

console.log(names)


async function OnChangeFile(e) {
    var file = e.target.files[0];
    //check for file extension
    try {
        //upload the file to IPFS
        const response = await uploadFileToIPFS(file);
        if(response.success === true) {
            console.log("Uploaded Verification File to IPFS: ", response.pinataURL)
            setFileURL(response.pinataURL);
        }
    }
    catch(e) {
        console.log("Error during file upload", e);
    }
}

let docRef;

if(documentID != ''){
     console.log(documentID.toString())
     docRef = doc(db, "Collection", documentID.toString())
}

const updateVerified = () => {
    updateDoc(docRef,{
    Verified: verified,
    VerificationFileIPFS: fileURL
  })
  .then(() => console.log('success'))

}


async function uploadToBlockchain(e) {
    e.preventDefault();
    
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log('identifier: ' + identifier.toString())
        console.log('url: ' + fileURL)
        //updateMessage("Please wait.. uploading")
  
        let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)
  
        const dateInSecs = Math.floor(new Date().getTime() / 1000);
  
        let listedToken = await contract.verifyObject( details, verified, identifier.toString(), fileURL, status, dateInSecs );
        alert("Successfully verified!");
        updateVerified();
        contract.on("TokenVerified", (_tokenId, _identifier, _uri, _status, _time, _address, _details, _verified, event ) => {
            let info = {
                tokenId: _tokenId.toNumber(),
                tokenIdentifier: _identifier,
                verificationFileURI: _uri,
                verified: _verified,
                verificationStatus: _status,
                details: _details,
                verificationTime: _time,
                expertAddress: _address,
                transactionData: event
            }
            console.log(JSON.stringify(info, null, 4))
        })

        let verificationHistory = await contract.returnVerificationInfo(1)
        
        setStatus('');
        setFileURL('');
       // window.location.replace('/')
    }
    catch(e) {
        alert( "Upload error" + e )
        console.log("Error: " + e)
    }
  }
    
  return (
       <div className="wrapper">

<h1 class = "mt-20 text-white text-5xl text-center">Collection Data</h1>
        <ul>
        {(data) ? data.map((value) => (
          <div>
            <ReqCard collectionData = {value}/>
          </div>
        )):null}
      </ul>
      
      <h1 class = "mt-20 text-white text-5xl text-center">More Images</h1>
      <div class="flex justify-around mt-20 mb-20"> 
      {(secondaryUrls) ? secondaryUrls.map((imageURL) => imageURL.map((url) => {
        return(
          <div class="rounded-full shadow-lg  max-w-xs">
                <img key = {url} style = {{width:300, height:300}} src={url}></img>
            </div>
    
      )}))
      : null} 
      </div>
    
    <div style={{position:'relative'}}>
      <div style={{position:'absolute',left:'32%',top:'2rem',padding:40,border:'2px solid white',marginTop:20}}>
    <h1 style = {{fontSize:44,marginBottom:30,color:'white'}}> Submit Verification Details</h1>  

    <div>
      <p style = {{fontSize:20,marginBottom:2,color:'white'}}>Verified As Legitimate? (Choose Yes or No)</p>
    <label class = 'mt-20 text-white text-2xl text-center mr-2' for="yes">Yes</label> 
    <input 
    type = "radio"
    value = "Yes"
    name = "verified"
    onChange = {e => setVerified(e.target.value)} />
    </div>

    <br />
    
    <div>
    <label class = 'mt-4 text-white text-2xl text-center mr-2' for="no">No</label> 
    <input
    style={{marginLeft:7}}
    type = "radio"
    value = "No"
    name = "verified"
    onChange = {e => setVerified(e.target.value)} />
    </div>

    <br />
    
    <div>
    <label style={{fontSize:20,color:'white'}} for="status">Status</label>
    <input 
    name = "status"
    type = "text"
    value = {status}
    onChange = {(e) => setStatus(e.target.value)}
    style = {{margin: 10, color:'white',border: '2px solid white', borderRadius:999, padding:8,marginLeft:20}}
    ></input>
    </div>

    <br />


    <label style={{fontSize:20,color:'white'}} for="details">Additional Details</label>
    <textarea 
    name = "details"
    type = "text"
    value = {details}
    onChange = {(e) => setDetails(e.target.value)}
    style = {{marginBottom: 35, color:'white',border:'2px solid white',backgroundColor:'rgb(34, 33, 33)'}}
   // style = {{margin: 10,marginBottom:50,color:'white', border: '2px solid white', borderRadius:999, padding:8,marginLeft:20}}
    ></textarea>

    <br />
    
    <label style={{fontSize:20,color:'white',marginRight:30}} for="details">Verification File</label>
    <input style={{marginBottom:50, color:'white'}}type={"file"} onChange={OnChangeFile}></input>
       
    <br />
      <button onClick={uploadToBlockchain}
      disabled = {!(status && fileURL && verified)}
      style={{border:'3px solid white', marginTop:15, padding:10,borderRadius:999}}> Verify Collection</button>
       </div> 
       
       </div>
       
    </div>
    
  )
}


