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

const ExpertSubmission = () => {
    let { id } = useParams();
    const collectionRef = collection(db, "Collection",id,"Expert");
    const [docs, loading, error] = useCollectionData(collectionRef);
  return (
    <div>
        
           <div 
        style={{border:'4px solid black', width:'60%',padding:20,marginLeft:120}}>
            <h1> View Expert Votes</h1>
            {docs?.map(doc => <div 
            style={{
            backgroundColor:'#ffffff',
            width:'60%',
            margin:10,
            border:'3px solid gray',
            overflow:'hidden',
            padding:53,
            paddingLeft:65}} 
            key={Math.random()}>
                <p style={{backgroundColor:'#ffffff'}}>From: {doc.ExpertEmail}</p>
                <p style={{backgroundColor:'#ffffff'}}>Vote: {doc.Vote}</p>
                <p style={{backgroundColor:'#ffffff'}}>Status: {doc.Status}</p>
                <p style={{backgroundColor:'#ffffff'}}>Details: {doc.Details}</p>
                <p style={{backgroundColor:'#ffffff'}}>View Verification File: {doc.VerificationFileIPFS}</p>
                </div>)}
</div>
    </div>
  )
}

export default ExpertSubmission