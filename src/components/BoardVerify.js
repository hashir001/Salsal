import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import { useLocation, useParams, Link } from 'react-router-dom';
import {  useState, useContext,useRef } from 'react';
import Marketplace from "../Marketplace.json";
import React from 'react';
import { Text, Heading, Select } from "@chakra-ui/react";
import { Button, FormControl, FormLabel, Input, Radio, RadioGroup, Stack } from '@chakra-ui/react'
import { Flex } from "@chakra-ui/react";
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
  where, onSnapshot, increment,snapshotEqual, writeBatch, arrayRemove, setDoc} from 'firebase/firestore';
import { useEffect } from "react";
import VerifyCard from "./VerifyCard";
import '../style1.css'
import ReqCard from "./ReqCard";
import { LoginContext } from './LoginContext'
import firebase from "firebase/compat/app"
import 'firebase/compat/firestore';
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore'


const BoardVerify = () => {
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
    const [ collectorUID, setCollectorUID ] = useState('');
    const [ verifiers, setVerifiers ] = useState([]);
    const [ emails, setEmails ] = useState('');
    const [ emails2, setEmails2 ] = useState([]);
    const { data, setData } = useContext(LoginContext);
    const accountsCollectionRef = collection(db, "Accounts");
    const [accountDocs, loading, error] = useCollectionData(accountsCollectionRef);
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
        setCollectorUID(snapshot.docs.map(doc => doc.data().collectorUID))
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
    const ethers = require("ethers");
    let docRef;

    if(documentID != ''){
         console.log(documentID.toString())
         docRef = doc(db, "Collection", documentID.toString())
    }
    const collectionRef = collection(db, "Collection");
    let { id } = useParams();
    const q = query(collectionRef, where("DocumentID","==",id))
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
  
    const hiddenFileInput = React.useRef(null);
    const handleClick = event => {
      hiddenFileInput.current.click();
    };

    console.log(collectorUID.toString())

    const updateVerified = async() => {
      updateDoc(docRef,{
      Verified: verified,
      VerificationFileIPFS: fileURL
    })
    .then(() => console.log('success'))

    const newDocRef = doc(collection(db, "Accounts",collectorUID.toString(),"Notifications"));
      await setDoc(
          newDocRef, 
          {
            createdAt: serverTimestamp(),
            collectorUID: data.uid,
            time: new Date().toLocaleString(),
            seen:'no',
            details: verified === 'Yes'? 'Your Collection Was Verified':'Your Collection Was Not Verified',
            theDocID: newDocRef.id
          }
      )

  //    await addDoc(collection(db, "Accounts",collectorUID.toString(),"Notifications"),{
  //     createdAt: serverTimestamp(),
  //     time: new Date().toLocaleString(),
  //     seen:'no',
  //     details: verified === 'Yes'? 'Your Collection Was Verified':'Your Collection Was Not Verified'
  //  })
  }
 
    async function uploadToBlockchain(e) {
        e.preventDefault();
        
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();      
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)
      
            const dateInSecs = Math.floor(new Date().getTime() / 1000);
      
            let listedToken = await contract.verifyObject( details, verified, identifier.toString(), fileURL, status, dateInSecs );
            alert("Successfully verified!");
            await updateVerified();
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
        }
        catch(e) {
            alert( "Upload error" + e )
            console.log("Error: " + e)
        }
      }
      return (
        <Flex flexDir='column' align='center' justify='center' mb={10}>     
          <Stack direction='column' borderWidth='3px'mt={8} boxShadow='2xl' w='600px' h='50%' px='50px' py='40px'>
            <Heading mb='30px'>Board Verification Form</Heading> 
          <Text  fontSize={'18px'}>Is The Collection Legitimate?<strong> Vote Yes or No</strong></Text> 
            <RadioGroup onChange={setVerified} value={verified}>
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

export default BoardVerify