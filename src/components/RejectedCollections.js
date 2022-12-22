import {useParams } from 'react-router-dom';
import {  useState } from 'react';
import React from 'react';
import { db } from '../firebase'
import { collection,query, where, onSnapshot} from 'firebase/firestore';
import { useEffect } from "react";
import VerifyCard from "./VerifyCard";
import '../style1.css';
import { Flex, Heading } from "@chakra-ui/react";


export default function RejectedCollections() {
    const [ data, setData ] = useState();

    const [ names, setNames ] = useState([]);
    const [ nftImgs, setNftImgs ] = useState([]);
    const [ docIDs, setDocIDs ] = useState([]);
    const [ descriptions, setDescriptions ] = useState([]);
    const [ secondaryUrls, setsecondaryUrls ] = useState([]);
    const [ prices, setPrices ] = useState([]);

    const link ="/reqverify/";

    const collectionRef = collection(db, "Collection");

    let { id } = useParams();
    const q = query(collectionRef, where("RejectedUIDs","array-contains",id))
   
    
    useEffect(()=>{
    onSnapshot(q, (snapshot) =>{

        setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

        setNames(snapshot.docs.map(doc => doc.data().Name))   
        setDescriptions(snapshot.docs.map(doc => doc.data().Description))
        setPrices(snapshot.docs.map(doc => doc.data().Price))
        setNftImgs(snapshot.docs.map(doc => doc.data().NFTImageURL))
  })},[])
      
    
  return (
       <Flex overflow='hidden' flexDir='column' justify='space-around' align={'center'}>
        <Heading letterSpacing='tight' fontSize='50px' mt={20}>Rejected Requests</Heading>
        {(data) ? data.map((value) => (
          <Flex boxShadow={'xl'} overflow='hidden'>
            <VerifyCard link = {link} collectionData = {value}/>
          </Flex>
        )):null}
       </Flex> 
  )
}


