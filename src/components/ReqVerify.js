import {  useParams, Link } from 'react-router-dom';
import {  useState, useContext } from 'react';
import React from 'react';
import {  db, } from '../firebase'
import { collection,  updateDoc, doc, arrayUnion, query, 
  where, onSnapshot, addDoc, serverTimestamp, setDoc, } from 'firebase/firestore';
import { useEffect } from "react";
import '../style1.css'
import ReqCard from "./ReqCard";
import { LoginContext } from './LoginContext'
import 'firebase/compat/firestore';
import { Button, Flex, Heading } from "@chakra-ui/react";

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
    const [ pendingVerifiers, setPendingVerifiers ] = useState([]);

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
    setPendingVerifiers(snapshot.docs.map(doc => doc.data().PendingVerifiers))

})},[])

let docRef;

if(documentID != ''){
        console.log(documentID.toString())
        docRef = doc(db, "Collection", documentID.toString())
}
console.log()
async function joinAsVerifier(e){
    e.preventDefault();
    updateDoc(docRef,{
    PendingVerifiers: arrayUnion({email: data.email,uid:data.uid}),
    PendingUIDs: arrayUnion(data.uid)
  })
    .then(() => console.log('success'))

    const newDocRef = doc(collection(db, "BoardNotifications"));
      await setDoc(
          newDocRef, 
          {
            createdAt: serverTimestamp(),
            time: new Date().toLocaleString(),
            seen:'no',
            details: 'Pending Verifier Request',
            collectionName:names[0],
            theDocID: newDocRef.id
          }
   )
}
    
  return (
<Flex overflow='hidden' flexDir='column'  align={'center'} justify={'center'}>
<Flex flexDir={'row'} justify={'center'}>
<Flex flexDir='column' justify={'center'}  pr='40px'>
{!(verifiers.flat().includes(data.email)) ?<Button onClick={joinAsVerifier} bg='blue.300'  _hover={{bg:'blue.400'}} fontSize='13px'>Request Voting Permission</Button>:null}
{verifiers.flat().includes(data.email)? <Link to = {chatLink}><Button bg='blue.300'  _hover={{bg:'blue.400'}} fontSize='15px'>Chat</Button></Link>:null}
{verifiers.flat().includes(data.email) && !(voters.flat().includes(data.email))?<Link to = {voteLink}><Button bg='blue.300' _hover={{bg:'blue.400'}} fontSize='15px'>Vote</Button></Link>:null}
</Flex>
<Flex flexDir={'column'}>
  <Heading letterSpacing='tight' align='center' fontSize='50px' mt={20} mr='180px'>Collection Data</Heading>
  {(allData) ? allData.map((value) => (
    <Flex boxShadow={'xl'} overflow='hidden'>
      <ReqCard collectionData = {value}/>
    </Flex>
  )):null}
  </Flex>
</Flex>


<Heading letterSpacing='tight' fontSize='50px' mt={20}>More Images </Heading>
<div class="flex justify-around mt-20 mb-20 flex-wrap gap-[70px]"> 
{(secondaryUrls) ? secondaryUrls.map((imageURL) => imageURL.map((url) => {
return(
  <Flex flexDir={'row'}>
    <img key = {url} style = {{width:350, height:320}} src={url}></img>
  </Flex>

)}))
: null} 
</div>
</Flex>
)}










// {verifiers.flat().includes(data.email)?null:
//   <button 
//   onClick={joinAsVerifier}
//   class="flex items-center justify-center
//         py-2 px-3 text-lg font-medium text-center text-black bg-rose-900 rounded-lg  
//         focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 
//         dark:hover:bg-blue-700 dark:focus:ring-blue-800">
//                Join As Verifier 
//   </button>}
  
//   {verifiers.flat().includes(data.email)?
//   <Link to = {chatLink}>
//   <button 
//   class="flex items-center justify-center
//         py-2 px-3 text-lg font-medium text-center text-black bg-rose-900 rounded-lg  
//         focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 
//         dark:hover:bg-blue-700 dark:focus:ring-blue-800">
//                Discuss Collection
//   </button></Link>:null}
  
//   {verifiers.flat().includes(data.email) && !(voters.flat().includes(data.email))?
//   <Link to = {voteLink}>
//   <button 
//   class="flex items-center justify-center
//         py-2 px-3 text-lg font-medium text-center text-black bg-rose-900 rounded-lg  
//         focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 
//         dark:hover:bg-blue-700 dark:focus:ring-blue-800">
//                Vote
//   </button></Link>:null}


