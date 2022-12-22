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

export default function Verify() {
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
    const [ voters, setVoters ] = useState([]);

    const { data, setData } = useContext(LoginContext);
    const ethers = require("ethers");

    const collectionRef = collection(db, "Collection");

    let { id } = useParams();
    const q = query(collectionRef, where("DocumentID","==",id))


    const chatLink = {
      pathname:"/chat/"+documentID
  }

  const voteLink = {
    pathname:"/vote/"+documentID
}

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
    setVoters(snapshot.docs.map(doc => doc.data().Voted))

})},[])

let docRef;

if(documentID != ''){
        console.log(documentID.toString())
        docRef = doc(db, "Collection", documentID.toString())
}
async function joinAsVerifier(e){
    e.preventDefault();
    updateDoc(docRef,{
    PendingVerifiers: arrayUnion(data.email)
    //NumberOfVerifiers: firebase.firestore.FieldValue.increment(1)
    })
    .then(() => console.log('success'))
}
    
  return (
       <div>
<h1 class = "mt-20 text-black text-5xl text-center">Collection Data</h1>


{verifiers.flat().includes(data.email)?null:
<button 
onClick={joinAsVerifier}
class="flex items-center justify-center
      py-2 px-3 text-lg font-medium text-center text-black bg-rose-900 rounded-lg  
      focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 
      dark:hover:bg-blue-700 dark:focus:ring-blue-800">
             Join As Verifier 
</button>}

{verifiers.flat().includes(data.email)?
<Link to = {chatLink}>
<button 
class="flex items-center justify-center
      py-2 px-3 text-lg font-medium text-center text-black bg-rose-900 rounded-lg  
      focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 
      dark:hover:bg-blue-700 dark:focus:ring-blue-800">
             Discuss Collection
</button></Link>:null}

{verifiers.flat().includes(data.email) && !(voters.flat().includes(data.email))?
<Link to = {voteLink}>
<button 
class="flex items-center justify-center
      py-2 px-3 text-lg font-medium text-center text-black bg-rose-900 rounded-lg  
      focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 
      dark:hover:bg-blue-700 dark:focus:ring-blue-800">
             Vote
</button></Link>:null}

        <ul>
        {(allData) ? allData.map((value) => (
          <div>
            <ReqCard collectionData = {value}/>
          </div>
        )):null}
      </ul>
      
      <h1 class = "mt-20 text-black text-5xl text-center">More Images</h1>
      <div class="flex justify-around mt-20 mb-20 flex-wrap gap-[70px]"> 
      {(secondaryUrls) ? secondaryUrls.map((imageURL) => imageURL.map((url) => {
        return(
          <div class="rounded-full shadow-lg  max-w-xs">
                <img key = {url} style = {{width:300, height:300}} src={url}></img>
            </div>
    
      )}))
      : null} 
      </div>
    
    
    </div>
    
  )
}


