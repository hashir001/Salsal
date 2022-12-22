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
import { Radio, RadioGroup } from '@chakra-ui/react'
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
import { Button, Divider, Flex, FormControl, FormHelperText, FormLabel, Heading, Input, Stack, Tooltip } from '@chakra-ui/react';
import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'


function UploadNFT() {
  const { isOpen, onOpen, onClose } = useDisclosure()
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
  const [ provDoc, setProvDoc ] = useState('');

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

async function OnChangeDetails(e) {
  var file = e.target.files[0];
  console.log(file)
  //check for file extension
  try {
      //upload the file to IPFS
      const response = await uploadFileToIPFS(file);
      if(response.success === true) {
          console.log("Uploaded Details File to IPFS: ", response.pinataURL)
          setDetDoc(response.pinataURL);
      }
  }
  catch(e) {
      console.log("Error during file upload", e);
  }
}

async function OnChangeProvenance(e) {
  var file = e.target.files[0];
  console.log(file)
  //check for file extension
  try {
      //upload the file to IPFS
      const response = await uploadFileToIPFS(file);
      if(response.success === true) {
          console.log("Uploaded Provenance File to IPFS: ", response.pinataURL)
          setProvDoc(response.pinataURL);
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

const updateVerified = async() => {
   updateDoc(docRef,{
   Verified: 'No',
   NFTImageIPFS: fileURL
 })
 .then(() => console.log('success'))

}

const uploadPost = async(e) => {
  const colID = v4();
  setCollectionId(colID);

  const docRef = await addDoc(collection(db, "Collection"),{
    Identifier: colID,
    Name: name, 
    Description: description,
    Price: price,
    Collector_Address: data.address,
    NumberOfVerifiers:0,
    collectorUID: data.uid,
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
        NFTImageURL: downloadURL,
        CollectionDetailsIPFS: detDoc,
        ProvenanceHistoryIPFS:provDoc
      })
    })
    setReady(true);
    onOpen();
}


async function uploadToBlockchain(e) {
  e.preventDefault();
  try {
      const metadataURL = await uploadMetadataToIPFS();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

      const dateInSecs = Math.floor(new Date().getTime() / 1000);
      onClose();
      let listedToken = await contract.createCollection(fileURL, collectionId, dateInSecs, detDoc, provDoc);
      alert("Successfully created collection!");
      await updateVerified();
      contract.on("CollectionCreated", (_tokenId, _identifier, _uri, _verified, _status, _additional, _prov, event ) => {
        let info = {
            tokenId: _tokenId.toNumber(),
            tokenIdentifier: _identifier,
            verificationFileURI: _uri,
            verified: _verified,
            verificationStatus: _status,
            additionalDetailsFileIPFS: _additional,
            provenanceFileIPFS: _prov,
            transactionData: event
        }
        console.log(JSON.stringify(info, null, 4))
    })
     
      setName('');
      setPrice('');
      setDescription('');    
  }
  catch(e) {
      alert( "Upload error" + e )
      console.log("Error: " + e)
  }
}




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

      const hiddenFileInput = React.useRef(null);
      const handleClick = event => {
        hiddenFileInput.current.click();
      };

      const hiddenFileInput2 = React.useRef(null);
      const handleClick2 = event => {
        hiddenFileInput2.current.click();
      };

      const hiddenFileInput3 = React.useRef(null);
      const handleClick3 = event => {
        hiddenFileInput3.current.click();
      };

      const hiddenFileInput4 = React.useRef(null);
      const handleClick4 = event => {
        hiddenFileInput4.current.click();
      };
      
      
      
      return(
        <Flex flexDir='column' align='center' h='60vh' justify='center'mt='5%' mb={10}>
          <Heading fontSize='5xl' fontWeight='extrabold' letterSpacing='tight' mb={1} mt={12}>Upload Collection</Heading>
          
          <Stack direction='column' borderWidth='3px'mt={8} boxShadow='2xl' w='600px' h='900px' px='50px' py='40px'>
          <FormControl>
            <FormLabel  fontWeight='bold'>Collection Name</FormLabel>
            <Input  type='text' value = {name} onChange = {(e) => setName(e.target.value)} mb={4}/>

            <FormLabel fontWeight='bold'>Description</FormLabel>
            <Input type='text' value = {description} onChange = {(e) => setDescription(e.target.value)} mb={4}/>

            <FormLabel fontWeight='bold'>(Optional) NFT Price</FormLabel>
            <Input mb={4} type='number' value = {price} onChange = {(e) => setPrice(e.target.value)} />
            
            <Stack direction='row' justify='space-between'>

            <Flex flexDir='column' justify='space-between' >
            <FormLabel fontWeight='bold' display='inline' mb={2} >Collection Details File</FormLabel>        
            <FormLabel fontWeight='bold' display='inline' mb={2}>Provenance File</FormLabel>
            <FormLabel fontWeight='bold' display='inline'mb={2} >NFT Image</FormLabel>
            <FormLabel fontWeight='bold' display='inline' mb={2}>(Optional) Additional Images</FormLabel>
            </Flex>

            <Flex flexDir='column' justify='space-between' >
            <Button bg='blue.900' _hover={{bg:'blue.700'}} _focus={{bg:'blue.700'}} mb={2}fontWeight='semibold' color='white' onClick={handleClick}>Upload Document</Button>
            <Input borderWidth='0px' style={{display:'none'}} ref={hiddenFileInput} type='file'  onChange = {(e) => {setDetDoc(e.target.files[0]); OnChangeDetails(e)}}/> 

            <Button bg='blue.900' _hover={{bg:'blue.700'}} _focus={{bg:'blue.700'}}  mb={2} color='white' onClick={handleClick2}>Upload Document</Button>
            <Input borderWidth='0px' style={{display:'none'}} ref={hiddenFileInput2} type='file' onChange = {(e) => {setProvDoc(e.target.files[0]); OnChangeProvenance(e)}}/> 

            <Button bg='blue.900' _hover={{bg:'blue.700'}}_focus={{bg:'blue.700'}}mb={2} color='white' onClick={handleClick3}>Upload Image</Button>
            <Input borderWidth='0px' style={{display:'none'}} ref={hiddenFileInput3} type='file' onChange = {(e) => {setNftImg(e.target.files[0]); OnChangeFile(e)}}/> 
           
            <Button bg='blue.900' _hover={{bg:'blue.700'}}_focus={{bg:'blue.700'}} mb={2}color='white' onClick={handleClick4}>Upload Images</Button>
            <div {...getRootProps()}>
            <input {...getInputProps()} style={{display:'none'}} ref={hiddenFileInput4} />
            </div>

            </Flex>
            </Stack>
            </FormControl>
          {/* <Tooltip hasArrow placement='top' label='We first upload to the IPFS and Firebase after which we will upload to the Blockchain' bg='blue.200' fontSize='20px'></Tooltip> */}
            <Button _hover={{bg:'red.700'}} _focus={{bg:'red.700'}} bg="red.900" color='white' fontSize='13px' alignSelf="center" onClick={uploadPost}> Submit</Button>
          {/* {ready?<Button _hover={{bg:'red.700'}} _focus={{bg:'red.700'}} bg="red.900" color='white' fontSize='15px' mx={2} my={2} alignSelf="center"  onClick = {uploadToBlockchain}> Upload To Blockchain</Button> : null} */}
          </Stack>
          <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Proceed With Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={uploadToBlockchain} >
              Confirm
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </Flex>
      )
}

export default UploadNFT;