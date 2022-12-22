import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import { useLocation, useParams, Link } from 'react-router-dom';
import {  useState, useContext } from 'react';
import Marketplace from "../Marketplace.json";
import React from 'react';
import { Text, Highlight, Heading, Button, Flex, Stack, Divider } from "@chakra-ui/react";
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

const ExpertSubmission = () => {
    let { id } = useParams();
    const collectionRef = collection(db, "Collection",id,"Expert");
    const [docs, loading, error] = useCollectionData(collectionRef);
  return (
    <>      
    <Heading mb='50px' mt='60px' fontSize='50px'align={'center'}>View All Votes</Heading>
    {docs?.map(doc => <Flex overflow='hidden' flexDir='column' justify='space-around' align={'center'}>

    <Flex boxShadow={'xl'} overflow='hidden'>
    <Flex overflow='hidden' w="100%" boxShadow={'2xl'} flexDir='column' mt={10} >
    <Stack overflow='hidden' direction='column' p="5" h='400px' w="900px" borderWidth="1px" boxShadow={'2xl'}>
    <Flex overflow='hidden' maxW='70%'  flexDir='column' ml={10}> 
    <Heading alignSelf='center' mb='20px' ml='100px'>Vote</Heading><Flex flexDir='column'>                
                <Text mt={2} fontSize="2xl" fontWeight="normal" lineHeight="short"><strong>From:</strong> {doc.ExpertEmail}</Text><Divider></Divider>
                <Text mt={2} fontSize="2xl" fontWeight="normal" lineHeight="short"><strong>Vote:</strong> {doc.Vote}</Text><Divider></Divider>
                <Text mt={2} fontSize="2xl" fontWeight="normal" lineHeight="short"><strong>Status:</strong> {doc.Status}</Text><Divider></Divider>
                <Text mt={2} fontSize="2xl" fontWeight="normal" lineHeight="short"><strong>Details</strong>: {doc.Details}</Text><Divider></Divider>
                <Text mt={2} fontSize="2xl" fontWeight="normal" lineHeight="short"><strong>View Verification File:</strong> {doc.VerificationFileIPFS}</Text><Divider></Divider>
                </Flex></Flex>
    </Stack>
    </Flex>
    </Flex>
    </Flex>)}
    </>

    
//     <div>
        
//            <div 
//         style={{border:'4px solid black', width:'60%',padding:20,marginLeft:120}}>
//             <h1> View Expert Votes</h1>
//             {docs?.map(doc => <div 
//             style={{
//             backgroundColor:'#ffffff',
//             width:'60%',
//             margin:10,
//             border:'3px solid gray',
//             overflow:'hidden',
//             padding:53,
//             paddingLeft:65}} 
//             key={Math.random()}>
//                 <p style={{backgroundColor:'#ffffff'}}>From: {doc.ExpertEmail}</p>
//                 <p style={{backgroundColor:'#ffffff'}}>Vote: {doc.Vote}</p>
//                 <p style={{backgroundColor:'#ffffff'}}>Status: {doc.Status}</p>
//                 <p style={{backgroundColor:'#ffffff'}}>Details: {doc.Details}</p>
//                 <p style={{backgroundColor:'#ffffff'}}>View Verification File: {doc.VerificationFileIPFS}</p>
//                 </div>)}
// </div>
//     </div>
  )
}

export default ExpertSubmission