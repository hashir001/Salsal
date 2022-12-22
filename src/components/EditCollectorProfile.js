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
import {useAuth} from '../firebase'

const EditCollectorProfile = () => {
    const currentUser = useAuth();
    const [ name, setName ] = useState('');
    const [ about, setAbout ] = useState('');
    let docRef=''
    
    {currentUser?.uid? docRef = doc(db, 'Accounts',currentUser.uid):<></>}
    

    const updateValues = () => {
        updateDoc(docRef, {
            name: name,
            about: about
        })
    }

  return (
    <div>
        <input 
        style={{border:'1px solid black',color:'black'}}
        value = {name}
        onChange = {e => setName(e.target.value)} 
        type="text" />
        <br />
        <input 
        style={{border:'1px solid black',color:'black'}}
        value = {about}
        onChange = {e => setAbout(e.target.value)} 
        type="text" />

        <button style = {{border:'1px solid black'}}onClick={updateValues}>submit</button>
    </div>
  )
}

export default EditCollectorProfile