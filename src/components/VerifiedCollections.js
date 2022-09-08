import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import { useLocation, useParams } from 'react-router-dom';
import {  useState, useContext } from 'react';
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
import CreateNFTCard from "./CreateNFTCard";
import { LoginContext } from './LoginContext'
import '../style1.css';


export default function VerifiedCollections() {
    const [ collectionData, setCollectionData ] = useState();

    const ethers = require("ethers");

    const { data, setData } = useContext(LoginContext);

    const collectionRef = collection(db, "Collection");

    const q = query(collectionRef, where("Verified","==","Yes"), where("Collector_Address","==",data.address))

    
useEffect(()=>{
    onSnapshot(q, (snapshot) =>{
    setCollectionData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

})},[])
   
console.log(collectionData)
  return (
       <div className="wrapper flex justify-around">
        <ul>
        {(collectionData) ? collectionData.map((value) => (
          <div>
            <CreateNFTCard key = {value.id} collectionData = {value}/>
          </div>
        )):null}
        </ul>
       </div> 
  )
}


