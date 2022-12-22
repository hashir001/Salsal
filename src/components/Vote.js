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
import { Button, FormControl, FormLabel, Input, Radio, RadioGroup, Select, Stack, Text } from '@chakra-ui/react'
import { Flex, Heading } from "@chakra-ui/react";

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
       //window.location.replace('/')
    }
    catch(e) {
        alert( "Upload error" + e )
        console.log("Error: " + e)
    }
  }
  console.log('vote',details)
  
  const hiddenFileInput = React.useRef(null);
  const handleClick = event => {
    hiddenFileInput.current.click();
  };

    
  return (
  <Flex flexDir='column' align='center' justify='center' mb={10}>     
    <Stack direction='column' borderWidth='3px'mt={8} boxShadow='2xl' w='600px' h='50%' px='50px' py='40px'>
      <Heading mb='30px'>Expert Voting Form</Heading> 
    <Text  fontSize={'18px'}>Is The Collection Legitimate?<strong> Vote Yes or No</strong></Text> 
      <RadioGroup onChange={setVote} value={vote}>
      <Stack direction='row'>
        <Radio value='Yes'>Yes</Radio>
        <Radio value='No'>No</Radio>
      </Stack>
    </RadioGroup>

    <br/>
    <FormControl>


    <FormLabel fontWeight='bold'>Status</FormLabel>
    <Select placeholder='Select Collection Status' value = {status} onChange = {(e) => setStatus(e.target.value)}>
      <option value='Tier 1'>Tier 1 - Not legitimate </option>
      <option value='Tier 2'>Tier 2 - Legitimacy Not Clear</option>
      <option value='Tier 3'>Tier 3 - Legitimate</option>
      <option value='Tier 4'>Tier 4 - Legitimacy Very Clear</option>
      <option value='Tier 5'>Tier 5 - Completely Legitimate</option>
    </Select>

    <FormLabel  fontWeight='bold'>Additional Details</FormLabel>
      <Input  type='text' value = {details} onChange = {(e) => setDetails(e.target.value)} mb={4}/>

      <FormLabel  fontWeight='bold'>Verification File</FormLabel>
      <Button bg='blue.900' _hover={{bg:'blue.700'}} _focus={{bg:'blue.700'}} mb={2}fontWeight='semibold' color='white' onClick={handleClick}>Upload Document</Button>
      <Input borderWidth='0px' style={{display:'none'}} ref={hiddenFileInput} type='file'  onChange = {OnChangeFile}/> 

    </FormControl>
  
    <br />
      <Button alignSelf={'center'} disabled={!fileURL} onClick={uploadToBlockchain}> Submit Vote</Button>       
       </Stack>
       
    </Flex>
    
  )
}

export default Vote

