import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import { useLocation, useParams, Link } from 'react-router-dom';
import {  useState, useContext } from 'react';
import Marketplace from "../Marketplace.json";
import React from 'react';
import { Text, Highlight, Heading, Button } from "@chakra-ui/react";
import { storage, db, } from '../firebase'
import { v4 } from "uuid";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc, arrayUnion, query, 
  where, onSnapshot, increment,snapshotEqual, writeBatch, arrayRemove} from 'firebase/firestore';
import { useEffect } from "react";
import VerifyCard from "./VerifyCard";
import '../style1.css'
import ReqCard from "./ReqCard";
import { LoginContext } from './LoginContext'
import firebase from "firebase/compat/app"
import 'firebase/compat/firestore';
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore'

export default function CollectionDetails() {
    const [ allData, setAllData ] = useState();
    const [ names, setNames ] = useState('');
    const [ numberOfVerifiers, setNumberOfVerifiers ] = useState();
    const [ nftImgs, setNftImgs ] = useState([]);
    const [ docIDs, setDocIDs ] = useState([]);
    const [ descriptions, setDescriptions ] = useState([]);
    const [ pendingVerifiers, setPendingVerifiers ] = useState([])
    const [ approvedVerifiers, setApprovedVerifiers ] = useState([])
    const [ rejectedVerifiers, setRejectedVerifiers ] = useState([])
    const [ secondaryUrls, setsecondaryUrls ] = useState(); //array within an array
    const [ prices, setPrices ] = useState([]);
    const [ random, setRandom ] = useState('')
    const [ fileURL, setFileURL ] = useState('');
    const [ status, setStatus ] = useState('');
    const [ identifier, setIdentifier ] = useState('');
    const [ verified, setVerified ] = useState('');
    const [ details, setDetails ] = useState('');
    const [ documentID, setDocumentID ] = useState('');

    const [ verifiers, setVerifiers ] = useState([]);
    const [ emails, setEmails ] = useState('');
    const [ emails2, setEmails2 ] = useState([]);
    const { data, setData } = useContext(LoginContext);
    const ethers = require("ethers");

    const collectionRef = collection(db, "Collection");
    const accountsCollectionRef = collection(db, "Accounts");
    const [accountDocs, loading, error] = useCollectionData(accountsCollectionRef);
  
    let docRef;

    if(documentID != ''){
         console.log(documentID.toString())
         docRef = doc(db, "Collection", documentID.toString())
    }
    let { id } = useParams();
    const q = query(collectionRef, where("DocumentID","==",id))

    const expertSubmissionLink = {
      pathname:"/expertsubmission/"+id
    }

    const manageVerifiersLink = {
      pathname:"/manage/"+id
    }
    const verifyLink = {
      pathname:"/boardverify/"+id
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

    const newTo = {
      pathname:"/chat/"+documentID}

      const getDocuments = async() => {
        getDocs(accountsCollectionRef)
        .then((snapshot) => {
            setEmails(snapshot.docs.map((doc) => (doc.data().email)));
        })
        .catch(err => console.log(err)); 
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
    setVerifiers(snapshot.docs.map(doc => doc.data().Verifiers))
    setPendingVerifiers(snapshot.docs.map(doc => doc.data().PendingVerifiers))
    setApprovedVerifiers(snapshot.docs.map(doc => doc.data().ApprovedVerifiers))
    setRejectedVerifiers(snapshot.docs.map(doc => doc.data().RejectedVerifiers))
  })
    //setEmails(accountDocs.map(doc => doc.email));
    getDocuments();
},[])

console.log(emails2)

async function verify(pv,e){
  e.preventDefault();
  updateDoc(docRef,{
    PendingVerifiers: arrayRemove(pv),
    RejectedVerifiers: arrayRemove(pv),
    ApprovedVerifiers: arrayUnion(pv)
  })
  .then(() => console.log('success'))
}

async function remove(pv,e){
  e.preventDefault();
  console.log(pv)
  updateDoc(docRef,{
    PendingVerifiers: arrayRemove(pv),
    ApprovedVerifiers: arrayRemove(pv),
    RejectedVerifiers: arrayUnion(pv)
  })
  .then(() => console.log('success'))
}

const addToArray = (arr1,arr2) =>{
  arr1[0].map(val => arr2.push(val))
}

const pending = [];
pendingVerifiers[0]? addToArray(pendingVerifiers,pending) : <></>;

const approved = [];
approvedVerifiers[0]? addToArray(approvedVerifiers,approved) : <></>;

const rejected = [];
rejectedVerifiers[0]? addToArray(rejectedVerifiers,rejected) : <></>;

console.log(pending)
console.log(emails)


    
  return (
       <div>
        <Link to = {expertSubmissionLink}><button 
class="flex items-center justify-center
      py-2 px-3 text-lg font-medium text-center text-black bg-rose-900 rounded-lg  
      focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 
      dark:hover:bg-blue-700 dark:focus:ring-blue-800">
             Expert Reviews
</button></Link>

<Link to = {manageVerifiersLink}><button 
class="flex items-center justify-center
      py-2 px-3 text-lg font-medium text-center text-black bg-rose-900 rounded-lg  
      focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 
      dark:hover:bg-blue-700 dark:focus:ring-blue-800">
             Manage Verifiers
</button></Link>

<Link to = {verifyLink}><button 
class="flex items-center justify-center
      py-2 px-3 text-lg font-medium text-center text-black bg-rose-900 rounded-lg  
      focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 
      dark:hover:bg-blue-700 dark:focus:ring-blue-800">
             Verify Collection
</button></Link>



<h1 class = "mt-20 text-black text-5xl text-center">Collection Data</h1>

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
      <h1 class = "mt-20 text-black text-5xl text-center">Pending Verifiers</h1>
      {emails && pending? pending.map(pv => emails.includes(pv)?
      <div style={{border:'2px solid gray',marginTop:100,width:'50%',marginBottom:20,padding:30}} key = {Math.random()}>
        <h3 style={{marginLeft:30,marginTop:10,fontSize:22}}>Email: {pv}</h3>
        <br/>
        <Button
          style={{marginLeft:30}}
          colorScheme="gray"
          padding="1.6rem"
          height="1rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={0}
          align="center"
          mx="auto"
          //onClick={}
        >
          View Profile
        </Button>
        <Button
          style={{marginLeft:30}}
          colorScheme="blue"
          padding="1.6rem"
          height="1rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={0}
          align="center"
          mx="auto"
          onClick={(e) => verify(pv,e)}
        >
          Approve
        </Button>
        <Button
          style={{marginLeft:30}}
          colorScheme="red"
          padding="1.6rem"
          height="1rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={0}
          align="center"
          mx="auto"
          onClick={(e) => remove(pv,e)}
        >
          Reject
        </Button>
      </div>:null):null}

      <h1 class = "mt-20 text-black text-5xl text-center">Approved Verifiers</h1>
      {approved.map(pv => emails.includes(pv)?
      <div style={{border:'2px solid gray',marginTop:100,width:'50%',marginBottom:20}} key = {Math.random()}>
        <h3 style={{marginLeft:30,marginTop:10,fontSize:22}}>Email: {pv}</h3>
        <br/>
        <Button
          style={{marginLeft:30}}
          colorScheme="gray"
          padding="1.6rem"
          height="1rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={0}
          align="center"
          mx="auto"
          //onClick={}
        >
          View Profile
        </Button>
        <Button
          style={{marginLeft:30}}
          colorScheme="red"
          padding="1.6rem"
          height="1rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={0}
          align="center"
          mx="auto"
          onClick={(e) => remove(pv,e)}
        >
          Reject
        </Button>
      </div>:null)}

      <h1 class = "mt-20 text-black text-5xl text-center">Rejected Verifiers</h1>
      {rejected.map(pv => emails.includes(pv)?
      <div style={{border:'2px solid gray',marginTop:100,width:'50%',marginBottom:20}} key = {Math.random()}>
        <h3 style={{marginLeft:30,marginTop:10,fontSize:22}}>Email: {pv}</h3>
        <br/>
        <Button
          style={{marginLeft:30}}
          colorScheme="gray"
          padding="1.6rem"
          height="1rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={0}
          align="center"
          mx="auto"
          //onClick={}
        >
          View Profile
        </Button>
        <Button
          style={{marginLeft:30}}
          colorScheme="blue"
          padding="1.6rem"
          height="1rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={0}
          align="center"
          mx="auto"
          onClick={(e) => verify(pv,e)}
        >
          Approve
        </Button>
      </div>:null)}

      
      <div style={{position:'relative'}}>
      <div style={{position:'absolute',left:'32%',top:'2rem',padding:40,border:'2px solid black',marginTop:20}}>
    <h1 style = {{fontSize:44,marginBottom:30,color:'black'}}> Submit Verification Details</h1>  

    <div>
      <p style = {{fontSize:20,marginBottom:2,color:'black'}}>Verified As Legitimate? (Choose Yes or No)</p>
    <label class = 'mt-20 text-black text-2xl text-center mr-2' for="yes">Yes</label> 
    <input 
    type = "radio"
    value = "Yes"
    name = "verified"
    onChange = {e => setVerified(e.target.value)} />
    </div>

    <br />
    
    <div>
    <label class = 'mt-4 text-black text-2xl text-center mr-2' for="no">No</label> 
    <input
    style={{marginLeft:7}}
    type = "radio"
    value = "No"
    name = "verified"
    onChange = {e => setVerified(e.target.value)} />
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
      disabled = {!(status && fileURL && verified)}
      style={{border:'3px solid black', marginTop:15, padding:10,borderRadius:999}}> Verify Collection</button>
       </div> 
       
       </div>



    </div>
  )
}


