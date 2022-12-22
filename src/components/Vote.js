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

const Vote = () => {
    const [ allData, setAllData ] = useState();
    const [ names, setNames ] = useState('');
    const [ numberOfVerifiers, setNumberOfVerifiers ] = useState();
    const [ nftImgs, setNftImgs ] = useState([]);
    const [ docIDs, setDocIDs ] = useState([]);
    const [ docId, setDocID ] = useState('');
    const [ descriptions, setDescriptions ] = useState([]);
    const [ secondaryUrls, setsecondaryUrls ] = useState(); 
    const [ prices, setPrices ] = useState([]);
   
    const [ fileURL, setFileURL ] = useState('');
    const [ status, setStatus ] = useState('');
    const [ identifier, setIdentifier ] = useState('');
    const [ vote, setVote ] = useState('');
    const [ details, setDetails ] = useState('');
    const [ documentID, setDocumentID ] = useState('');

    const [ verifiers, setVerifiers ] = useState([]);
    const { data, setData } = useContext(LoginContext);
    const ethers = require("ethers");

const collectionRef = collection(db, "Collection");

let { id } = useParams();
const q = query(collectionRef, where("DocumentID","==",id))


useEffect(()=>{
    onSnapshot(q, (snapshot) =>{
    setAllData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    setNames(snapshot.docs.map(doc => doc.data().Name))   
    setDescriptions(snapshot.docs.map(doc => doc.data().Description))
    setPrices(snapshot.docs.map(doc => doc.data().Price))
    setNftImgs(snapshot.docs.map(doc => doc.data().NFTImageURL))
    setIdentifier(snapshot.docs.map(doc => doc.data().Identifier)) 
    setDocumentID(snapshot.docs.map(doc => doc.data().DocumentID))
    setsecondaryUrls(snapshot.docs.map(doc => doc.data().SecondaryImageURLs))
    setNumberOfVerifiers(snapshot.docs.map(doc => doc.data().NumberOfVerifiers))
    setVerifiers(snapshot.docs.map(doc => doc.data().ApprovedVerifiers))

})},[])


let docRef;
let docRef2;

if(documentID != ''){
  docRef = doc(db, "Collection", documentID.toString(),"Expert",data.uid)
  docRef2 = doc(db, "Collection", documentID.toString())
}
async function votedSuccessfully(e){
    e.preventDefault();
    updateDoc(docRef2,{
    Voted: arrayUnion(data.email),
    NumberOfVerifiers: firebase.firestore.FieldValue.increment(1)
    })
    .then(() => console.log('success'))
}

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

const addVoteToFirebase = async() =>{
        const documentRef = await addDoc(collection(db, "Collection",documentID.toString(),"Expert"),{
        Vote: vote,
        VerificationFileIPFS: fileURL,
        Status: status,
        Details: details,
        ExpertEmail: data.email,
        ExpertAddress: data.address,
        Timestamp: serverTimestamp()
        })

        updateDoc(docRef2,{
          Voted: arrayUnion(data.email),
          NumberOfVerifiers: firebase.firestore.FieldValue.increment(1)
          })
          .then(() => console.log('success'))

        setDocID(documentRef.id);
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
  
        let listedToken = await contract.addVote(identifier.toString(),vote,fileURL,status,details,dateInSecs)

        alert("Successfully voted!");

        addVoteToFirebase();
    

        contract.on("Voted", (_tokenId,_vote, _verificationFileURI,_status,_address,_time,_details,_identifier, event ) => {
            let info = {
                tokenId: _tokenId.toNumber(),
                tokenIdentifier: _identifier,
                verificationFileURI: _verificationFileURI,
                vote: _vote,
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
       <div>
<h1 class = "mt-20 text-black text-5xl text-center">Voting Form</h1>

       
    
    <div style={{position:'relative'}}>
      <div style={{position:'absolute',left:'32%',top:'2rem',padding:40,border:'2px solid black',marginTop:20}}>
    <h1 style = {{fontSize:44,marginBottom:30,color:'black'}}> Submit Verification Details</h1>  

    <div>
      <p style = {{fontSize:20,marginBottom:2,color:'black'}}>Is Collection Legitimate? Vote Yes or No</p>
    <label class = 'mt-20 text-black text-2xl text-center mr-2' for="yes">Yes</label> 
    <input 
    type = "radio"
    value = "Yes"
    name = "vote"
    onChange = {e => setVote(e.target.value)} />
    </div>

    <br />
    
    <div>
    <label class = 'mt-4 text-black text-2xl text-center mr-2' for="no">No</label> 
    <input
    style={{marginLeft:7}}
    type = "radio"
    value = "No"
    name = "vote"
    onChange = {e => setVote(e.target.value)} />
    </div>

    <br />
    
    <div>
    <label style={{fontSize:20,color:'black'}} for="status">Status</label>
    <input 
    name = "status"
    type = "text"
    value = {status}
    onChange = {(e) => setStatus(e.target.value)}
    style = {{margin: 10, color:'black',border: '2px solid black', borderRadius:999, padding:8,marginLeft:20}}
    ></input>
    </div>

    <br />


    <label style={{fontSize:20,color:'black'}} for="details">Additional Details</label>
    <textarea 
    name = "details"
    type = "text"
    value = {details}
    onChange = {(e) => setDetails(e.target.value)}
    style = {{marginBottom: 35, color:'black',border:'2px solid black',backgroundColor:'white'}}
    ></textarea>

    <br />
    
    <label style={{fontSize:20,color:'black',marginRight:30}} for="details">Verification File</label>
    <input style={{marginBottom:50, color:'black'}}type={"file"} onChange={OnChangeFile}></input>
       
    <br />
      <button onClick={uploadToBlockchain}
      disabled = {!(status && fileURL && vote)}
      style={{border:'3px solid black', marginTop:15, padding:10,borderRadius:999}}> Submit Vote</button>
       </div> 
       
       </div>
       
    </div>
    
  )
}

export default Vote