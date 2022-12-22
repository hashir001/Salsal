import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import { useParams, Link } from 'react-router-dom';
import {  useState, useContext } from 'react';
import Marketplace from "../Marketplace.json";
import React from 'react';
import { Text, Highlight, Heading, Flex, } from "@chakra-ui/react";
import { db, } from '../firebase'
import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc, arrayUnion, query, 
  where, onSnapshot, arrayRemove, setDoc} from 'firebase/firestore';
import { useEffect } from "react";
import '../style1.css'
import ReqCard from "./ReqCard";
import { LoginContext } from './LoginContext'
import 'firebase/compat/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore'
import {
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  ModalFooter,
} from '@chakra-ui/react';
import { ChatIcon, CheckCircleIcon, CheckIcon, InfoOutlineIcon, SettingsIcon } from "@chakra-ui/icons";

export default function CollectionDetails() {
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
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [scrollBehavior, setScrollBehavior] = React.useState('inside')

    console.log(names[0])

    const [ verifiers, setVerifiers ] = useState([]);
    const [ emails, setEmails ] = useState('');
    const [ userIDs, setUserIDs ] = useState('');
    const [ emails2, setEmails2 ] = useState([]);
    const { data, setData } = useContext(LoginContext);
    const ethers = require("ethers");

    const collectionRef = collection(db, "Collection");
    const accountsCollectionRef = collection(db, "Accounts");

    const [accountDocs, loading, error] = useCollectionData(accountsCollectionRef);
  
    let docRef;
    if(documentID != ''){
         docRef = doc(db, "Collection", documentID.toString())
    }


    let { id } = useParams();
    const q = query(collectionRef, where("DocumentID","==",id))

    const expertSubmissionLink = {
      pathname:"/expertsubmission/"+id
    }

    const manageVerifiersLink = {
      pathname:"/manage/"+id
    }
    const verifyLink = {
      pathname:"/boardverify/"+id
    }

    const boardChat = {
      pathname: '/boardchat/'+id
    }

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

  const updateVerified = () => {
    updateDoc(docRef,{
    Verified: verified,
    VerificationFileIPFS: fileURL
  })
  .then(() => console.log('success'))
}


  async function uploadToBlockchain(e) {
    e.preventDefault();
    
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log('identifier: ' + identifier.toString())
        console.log('url: ' + fileURL)
        //updateMessage("Please wait.. uploading")
  
        let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)
  
        const dateInSecs = Math.floor(new Date().getTime() / 1000);
  
        let listedToken = await contract.verifyObject( details, verified, identifier.toString(), fileURL, status, dateInSecs );
        alert("Successfully verified!");
        updateVerified();
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
       // window.location.replace('/')
    }
    catch(e) {
        alert( "Upload error" + e )
        console.log("Error: " + e)
    }
  }

    const newTo = {
      pathname:"/chat/"+documentID}

      const getDocuments = async() => {
        getDocs(accountsCollectionRef)
        .then((snapshot) => {
            setEmails(snapshot.docs.map((doc) => (doc.data().email)));
            setUserIDs(snapshot.docs.map((doc) => (doc.data().uid)));
        })
        .catch(err => console.log(err)); 
      }

      console.log(pendingVerifiers[0])
 

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
    setVerifiers(snapshot.docs.map(doc => doc.data().Verifiers))
    setPendingVerifiers(snapshot.docs.map(doc => doc.data().PendingVerifiers))
    setApprovedVerifiers(snapshot.docs.map(doc => doc.data().ApprovedVerifiers))
    setRejectedVerifiers(snapshot.docs.map(doc => doc.data().RejectedVerifiers))
  })
    getDocuments();
},[])

async function verify(pv,e){
  e.preventDefault();
  updateDoc(docRef,{
    PendingVerifiers: arrayRemove(pv),
    PendingUIDs: arrayRemove(pv.uid),

    RejectedUIDs: arrayRemove(pv.uid),
    RejectedVerifiers: arrayRemove(pv.email),

    ApprovedVerifiers: arrayUnion(pv.email),
    ApprovedUIDs: arrayUnion(pv.uid)
  })
  .then(() => console.log('success'))

  
 const newDocRef = doc(collection(db, "Accounts",pv.uid,"Notifications"));
      await setDoc(
          newDocRef, 
          {
            createdAt: serverTimestamp(),
            expertUID: pv.uid,
            time: new Date().toLocaleString(),
            email:pv,
            seen:'no',
            details: names[0] + ' was approved',
            theDocID: newDocRef.id
          }
      )
}


async function remove(pv,e){
  e.preventDefault();
  console.log(pv)
  updateDoc(docRef,{
    PendingVerifiers: arrayRemove(pv),
    PendingUIDs: arrayRemove(pv.uid),

    ApprovedVerifiers: arrayRemove(pv.email),
    ApprovedUIDs: arrayRemove(pv.uid),

    RejectedVerifiers: arrayUnion(pv.email),
    RejectedUIDs: arrayUnion(pv.uid)
  })
  .then(() => console.log('success'))

  const newDocRef = doc(collection(db, "Accounts",pv.uid,"Notifications"));
      await setDoc(
          newDocRef, 
          {
            createdAt: serverTimestamp(),
            expertUID: pv.uid,
            time: new Date().toLocaleString(),
            email:pv,
            seen:'no',
            details: names[0] + ' was rejected',
            theDocID: newDocRef.id
          }
      )
}

const addToArray = (arr1,arr2) =>{
  arr1[0].map(val => arr2.push(val))
}

const pending = [];
pendingVerifiers[0]? addToArray(pendingVerifiers,pending) : <></>;

const approved = [];
approvedVerifiers[0]? addToArray(approvedVerifiers,approved) : <></>;

const rejected = [];
rejectedVerifiers[0]? addToArray(rejectedVerifiers,rejected) : <></>;

console.log(pending)
console.log(emails)

const expertprofileLink = {
  pathname:"/expertprofile/"+data.uid
}
    
  return (
       <div>
       
<Flex overflow='hidden' flexDir='column'  align={'center'}>

        <Flex flexDir={'row'} justify={'space-between'}>
        <Flex flexDir='column' justify={'center'} mt='130px' pr='40px'>
          <Link to = {expertSubmissionLink}><Button width='250px'variant='outline' mb='15px' leftIcon={<InfoOutlineIcon color='black' />} colorScheme='teal'>Expert Reviews</Button></Link>
          <Button  width='250px' leftIcon={<SettingsIcon color='black' />} mb='15px'colorScheme='teal' onClick={onOpen}variant='outline'>Manage Verifiers</Button>
          {data.email === 'agurvotemanager@gmail.com' | data.email === 'hashirzaf99@gmail.com' ? <Link to = {verifyLink}><Button width='250px' mb='15px'leftIcon={<CheckIcon color='black' />} variant='outline' colorScheme='teal' >Verify Collection</Button></Link> : null}
          <Link to = {boardChat}><Button  width='250px' leftIcon={<ChatIcon color='white'/>} colorScheme='teal' variant='solid'>Chat with Board Members</Button></Link>
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
      
    <Modal
        size={'lg'}
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior={scrollBehavior}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={'30px'}>Pending Verifiers</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir='column'> 
            <Flex flexDir='column'  borderWidth="2px" boxShadow={'xl'}> 
            
            {emails && pending? pending.map(pv => emails.includes(pv.email)?
      <div key = {Math.random()}>
        <Text fontWeight='normal' fontSize={'20px'}><strong>Email</strong>: {pv.email}</Text>
  
        <br/>
        <Flex flexDir='row'> 
        <Link to={'/expertprofile/' + pv.uid}>
        <Button
        fontSize={'20px'}
          colorScheme="gray"
          align="center"
          mx="auto"
        >
          View Profile
        </Button></Link>
        <Button
        fontSize={'20px'}
          colorScheme="blue"
          align="center"
          mx="auto"
          onClick={(e) => verify(pv,e)}
        >
          Approve
        </Button>
        <Button
        fontSize={'20px'}
          colorScheme="red"
          align="center"
          mx="auto"
          onClick={(e) => remove(pv,e)}
        >
          Reject
        </Button>
        </Flex>
      </div>:null):null} 
            </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      </div>
      )}
      {/* <h1 class = "mt-20 text-black text-5xl text-center">Pending Verifiers</h1>
      {emails && pending? pending.map(pv => emails.includes(pv)?
      <div style={{border:'2px solid gray',marginTop:100,width:'50%',marginBottom:20,padding:30}} key = {Math.random()}>
        <h3 style={{marginLeft:30,marginTop:10,fontSize:22}}>Email: {pv}</h3>
        <br/>
        <Button
          style={{marginLeft:30}}
          colorScheme="gray"
          padding="1.6rem"
          height="1rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={0}
          align="center"
          mx="auto"
          //onClick={}
        >
          View Profile
        </Button>
        <Button
          style={{marginLeft:30}}
          colorScheme="blue"
          padding="1.6rem"
          height="1rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={0}
          align="center"
          mx="auto"
          onClick={(e) => verify(pv,e)}
        >
          Approve
        </Button>
        <Button
          style={{marginLeft:30}}
          colorScheme="red"
          padding="1.6rem"
          height="1rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={0}
          align="center"
          mx="auto"
          onClick={(e) => remove(pv,e)}
        >
          Reject
        </Button>
      </div>:null):null} */}





      {/* <h1 class = "mt-20 text-black text-5xl text-center">Approved Verifiers</h1>
      {approved.map(pv => emails.includes(pv)?
      <div style={{border:'2px solid gray',marginTop:100,width:'50%',marginBottom:20}} key = {Math.random()}>
        <h3 style={{marginLeft:30,marginTop:10,fontSize:22}}>Email: {pv}</h3>
        <br/>
        <Button
          style={{marginLeft:30}}
          colorScheme="gray"
          padding="1.6rem"
          height="1rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={0}
          align="center"
          mx="auto"
          //onClick={}
        >
          View Profile
        </Button>
        <Button
          style={{marginLeft:30}}
          colorScheme="red"
          padding="1.6rem"
          height="1rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={0}
          align="center"
          mx="auto"
          onClick={(e) => remove(pv,e)}
        >
          Reject
        </Button>
      </div>:null)}

      <h1 class = "mt-20 text-black text-5xl text-center">Rejected Verifiers</h1>
      {rejected.map(pv => emails.includes(pv)?
      <div style={{border:'2px solid gray',marginTop:100,width:'50%',marginBottom:20}} key = {Math.random()}>
        <h3 style={{marginLeft:30,marginTop:10,fontSize:22}}>Email: {pv}</h3>
        <br/>
        <Button
          style={{marginLeft:30}}
          colorScheme="gray"
          padding="1.6rem"
          height="1rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={0}
          align="center"
          mx="auto"
          //onClick={}
        >
          View Profile
        </Button>
        <Button
          style={{marginLeft:30}}
          colorScheme="blue"
          padding="1.6rem"
          height="1rem"
          fontSize="1.2rem"
          mW="32rem"
          mt={0}
          align="center"
          mx="auto"
          onClick={(e) => verify(pv,e)}
        >
          Approve
        </Button>
      </div>:null)} */}

 


