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
import { Button, FormLabel, Input } from "@chakra-ui/react";

const EditCollectorProfile = () => {
    const currentUser = useAuth();
    const [ name, setName ] = useState('');
    const [ about, setAbout ] = useState('');
    const [ img, setImg ] = useState(null);
    let docRef=''
    
    {currentUser?.uid? docRef = doc(db, 'Accounts',currentUser.uid):<></>}
    

    const updateValues = async() => {
      const imageRef = ref(storage, `profile images/${v4()}`);

      uploadBytes(imageRef, img).then(async()=>{
        const downloadURL = await getDownloadURL(imageRef)
        await updateDoc(docRef,{
          profileImgUrl: downloadURL,
          name: name,
          about: about
        })
      })
    }

    const hiddenFileInput3 = React.useRef(null);
      const handleClick3 = event => {
        hiddenFileInput3.current.click();
      };

  return (
    <div>
       <FormLabel fontWeight='bold' display='inline'mb={2} >Profile Image</FormLabel>
      <Button bg='blue.900' _hover={{bg:'blue.700'}}_focus={{bg:'blue.700'}}mb={2} color='white' onClick={handleClick3}>Upload Image</Button>
            <Input borderWidth='0px' style={{display:'none'}} ref={hiddenFileInput3} type='file' onChange = {(e) => {setImg(e.target.files[0])}}/> 
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