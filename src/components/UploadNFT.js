import React, { useState } from 'react'
import { storage, db } from '../firebase'
import { v4 } from "uuid";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc, arrayUnion, setDoc} from 'firebase/firestore';
import { useCallback } from 'react'
import Dropzone from 'react-dropzone'
import {useDropzone} from 'react-dropzone'
import { useContext } from 'react';
import { LoginContext } from './LoginContext'
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from '../Marketplace.json';
import { useLocation } from "react-router";
import '../style1.css';


function UploadNFT() {
  const ethers = require("ethers");
  const [ name, setName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ price, setPrice ] = useState('');
  
  const [ nftImg, setNftImg ] = useState(null);

  const [ detDoc, setDetDoc ] = useState(null);

  const [ selectedImages, setSelectedImages ] = useState([]);

  const [ collectionId, setCollectionId ] = useState('');

  const [ ready, setReady ] = useState(false);

  const [ docId, setDocID ] = useState('');

  const { data, setData } = useContext(LoginContext);

  // pinata
  const [fileURL, setFileURL] = useState(null);

  //This function uploads the NFT image to IPFS
  async function OnChangeFile(e) {
    var file = e.target.files[0];
    console.log(file)
    //check for file extension
    try {
        //upload the file to IPFS
        const response = await uploadFileToIPFS(file);
        if(response.success === true) {
            console.log("Uploaded image to IPFS: ", response.pinataURL)
            setFileURL(response.pinataURL);
        }
    }
    catch(e) {
        console.log("Error during file upload", e);
    }
}

async function uploadMetadataToIPFS() {
  if( !name || !description || !price || !fileURL)
      return;

  const nftJSON = {
      colID: collectionId,
      name, 
      description,
      price,
      image: fileURL
  }

  try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      if(response.success === true){
          console.log("Uploaded JSON to Pinata: ", response)
          return response.pinataURL;
      }
  }
  catch(e) {
      console.log("error uploading JSON metadata:", e)
  }
}
let docRef;
 if(docId != ''){
    docRef = doc(db, "Collection", docId)
}

const updateVerified = () => {
   updateDoc(docRef,{
   Verified: 'No',
   NFTImageIPFS: fileURL
 })
 .then(() => console.log('success'))

}

async function uploadToBlockchain(e) {
  e.preventDefault();
 
  try {
      const metadataURL = await uploadMetadataToIPFS();


      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      //updateMessage("Please wait.. uploading")

      let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

      const dateInSecs = Math.floor(new Date().getTime() / 1000);

      let listedToken = await contract.createCollection(fileURL, collectionId, dateInSecs, detDoc);

      

      alert("Successfully created collection!");
      updateVerified();
      contract.on("CollectionCreated", (_tokenId, _identifier, _uri, _verified, _status, event ) => {
        let info = {
            tokenId: _tokenId.toNumber(),
            tokenIdentifier: _identifier,
            verificationFileURI: _uri,
            verified: _verified,
            verificationStatus: _status,
            transactionData: event
        }
        console.log(JSON.stringify(info, null, 4))
    })
     
      setName('');
      setPrice('');
      setDescription('');
      //window.location.replace("/")
  }
  catch(e) {
      alert( "Upload error" + e )
      console.log("Error: " + e)
  }
}

const uploadPost = async(e) => {
  e.preventDefault();
  const colID = v4();
  setCollectionId(colID);

  const docRef = await addDoc(collection(db, "Collection"),{
    Identifier: colID,
    Name: name, 
    Description: description,
    Price: price,
    Collector_Address: data.address,
    Timestamp: serverTimestamp()
    })

    setDocID(docRef.id);

    await Promise.all(
      selectedImages.map(image => {
        const imageRef = ref(storage,`secondary images/${docRef.id}/${image.name + v4()}`);
        uploadBytes(imageRef, image).then(async()=>{
          const downloadURL = await getDownloadURL(imageRef)
          await updateDoc(doc(db,"Collection",docRef.id),{
            DocumentID: docRef.id,
            SecondaryImageURLs: arrayUnion(downloadURL)
          })
        })
      })
    )

    if (nftImg == null) return;
    const imageRef = ref(storage, `nft images/${docRef.id}/${nftImg.name + v4()}`);
    uploadBytes(imageRef, nftImg).then(async()=>{
      const downloadURL = await getDownloadURL(imageRef)
      await updateDoc(doc(db,"Collection",docRef.id),{
        NFTImageURL: downloadURL
      })
    })

    setReady(true);
    
}

console.log(docId)

    const onDrop = useCallback(acceptedFiles => {
        setSelectedImages(acceptedFiles.map(file => 
            Object.assign(file,{
                preview:URL.createObjectURL(file)
            })))
      }, [])
      const {getRootProps, getInputProps} = useDropzone({onDrop})
      const selected_images = selectedImages?.map(file=>(
        <div></div>
      ))
      
      return (
        <div style={{position:'relative'}}className='wrapper'>
          <h1 style = {{fontSize:44,marginTop:30,color:'white',position:'absolute',left:'32%',top:40}}>Upload Your Collection</h1>
          <div style={{position:'absolute',left:'25%',top:'8rem',padding:40,border:'2px solid white',marginTop:20}}>
        <label class = 'mt-4 text-white text-2xl text-center mr-2' style = {{fontSize:36,marginRight:40}}for="name">Name</label>
            <input 
            style = {{border:'2px solid white',color:'white', borderRadius:999, padding:12,marginBottom: 35}}
            name = "name"
            type = "text"
            value = {name}
            onChange = {(e) => setName(e.target.value)}
            ></input>

            <br />

            <label class = 'mt-4 text-white text-2xl text-center mr-2' style = {{fontSize:36,marginRight:40}} for="nft-img">Description</label>
            <textarea 
            style = {{marginBottom: 35, color:'white',border:'2px solid white',backgroundColor:'rgb(34, 33, 33)'}}
            name = "nft-img"
            type = "file"
            value = {description}
            onChange = {(e) => setDescription(e.target.value)}
            ></textarea>
          
            <br />

            <label class = 'mt-4 text-white text-2xl text-center mr-2' style = {{fontSize:36,marginRight:40}} for="nft-img">Collection Details</label>
            <input 
            style = {{marginBottom: 35, color:'white'}}
            name = "nft-img"
            type = "file"
            onChange = {(e) => {
              setDetDoc(e.target.files[0]);
              OnChangeFile(e);
            }}
            ></input>
            <br />
            
            <label class = 'mt-4 text-white text-2xl text-center mr-2' style = {{fontSize:36,marginRight:40}} for="price">NFT Price (ETH)</label>
            <input 
            style = {{border:'2px solid white',color:'white', borderRadius:999, padding:12,marginBottom: 35}}
            name = "price"
            type = "number"
            value = {price}
            onChange = {(e) => setPrice(e.target.value)}
            
            ></input>
            <br />

            
            <label class = 'mt-4 text-white text-2xl text-center mr-2' style = {{fontSize:36,marginRight:40}} for="nft-img">NFT Image</label>
            <input 
            style = {{marginBottom: 35, color:'white'}}
            name = "nft-img"
            type = "file"
            onChange = {(e) => {
              setNftImg(e.target.files[0]);
              OnChangeFile(e);
            }}
            ></input>
            <br />

        <div {...getRootProps()}>
          <label class = 'mt-4 text-white text-2xl text-center mr-2' style = {{fontSize:36,marginRight:40}} >Collection Images</label><input {...getInputProps()} style = {{color:'white',backgroundColor:'transparent'}} />
        </div>
        
        <button onClick={uploadPost} 
        style={{
        marginTop:30,
        border:"3px solid",
        borderRadius:999,
        padding:14}}>Upload</button>

        {ready? <button onClick = {uploadToBlockchain}> Upload To Blockchain</button> : null}

        </div>
        </div>


      )
}

export default UploadNFT;