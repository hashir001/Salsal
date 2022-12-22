
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";

import NFTTile from "./NFTTile";
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
import { Avatar, Button, Flex, FormControl, FormLabel, Heading, Input, Text } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
  } from '@chakra-ui/react'
import {  AvatarBadge, AvatarGroup } from '@chakra-ui/react'

export default function ExpertProfile () {
    const { isOpen, onOpen, onClose } = useDisclosure()
const { data, setData } = useContext(LoginContext);
    const currentUser = useAuth();
    const [thedata, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);
    const [address, updateAddress] = useState("0x");
    const [totalPrice, updateTotalPrice] = useState("0");

    const [userName, setUserName] = useState('')
    const [about, setAbout] = useState('')
    const [imgurl, setImgUrl] = useState('')

    const [ name, setName ] = useState('');
    const [ specialty, setSpecialty ] = useState('');
    const [ experience, setExperience ] = useState('');
    
    const [ img, setImg ] = useState(null);
    let docuRef=''
    
    {currentUser?.uid? docuRef = doc(db, 'Accounts',currentUser.uid):<></>}

    
    let { id } = useParams();

    let docRef = doc(db, 'Accounts',id)

   


    const collRef = collection(db, "Notifications");

    const q = query(collRef, where("unseen","==","yes"),where("email","==",data.email))
    const [ notifications, setNotifications ] = useState();

    useEffect(()=>{
      onSnapshot(docRef, (doc) =>{
          setUserName(doc.data().name)   
          setAbout(doc.data().about)
          setSpecialty(doc.data().specialty)
          setExperience(doc.data().experience)
          setImgUrl(doc.data().profileImgUrl)
        })

        onSnapshot(q, (snapshot) =>{
          setNotifications(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))})
  },[])


let notifLength;

if(notifications !== undefined){
  console.log('length',notifications.length) 
  notifLength = notifications.length
}


    const params = useParams();
    const tokenId = params.tokenId;

console.log('notis',notifications)

    const updateValues = async() => {
        const imageRef = ref(storage, `profile images/${v4()}`);
    
        uploadBytes(imageRef, img).then(async()=>{
            const downloadURL = await getDownloadURL(imageRef)
            await updateDoc(docRef,{
            profileImgUrl: downloadURL,
            name: name,
            about: about,
            specialty: specialty,
            experience:experience
            })
        })
        }

    const hiddenFileInput3 = React.useRef(null);
    const handleClick3 = event => {
        hiddenFileInput3.current.click();
    };


    console.log('yo where they at')
    return (
        <Flex flexDir={'column'}>
            <Flex flexDir={'column'} align='center' mt={10}>
            <Avatar size='2xl' src={imgurl}></Avatar>
            <Heading style={{color:'black'}} mt='10px' mb='10px' fontSize={'23px'} fontWeight={'normal'}> {userName}</Heading>
            {currentUser?.email === data.email?<Button onClick={onOpen}>Edit Profile</Button>:null}
            <Heading style={{color:'black'}} mt='40px' fontWeight={'normal'}> About</Heading>
            <Flex borderWidth='1px' boxShadow={'md'} padding='10px' width='30%' mt='14px'><Text fontSize='18px' style={{color:'black'}} mt='10px' fontWeight={'normal'}> {about}</Text></Flex>

            <Heading style={{color:'black'}} mt='40px' fontWeight={'normal'}> Specialty</Heading>
            <Flex borderWidth='1px' boxShadow={'md'} padding='10px' width='30%' mt='14px'><Text fontSize='18px' style={{color:'black'}} mt='10px' fontWeight={'normal'}> {specialty}</Text></Flex>

            
            <Heading style={{color:'black'}} mt='40px' fontWeight={'normal'}> Experience</Heading>
            <Flex borderWidth='1px' boxShadow={'md'} padding='10px' width='30%' mt='14px'><Text fontSize='18px' style={{color:'black'}} mt='10px' fontWeight={'normal'}> {experience}</Text></Flex>

            
            
            <Heading style={{color:'black'}} mt='40px' fontWeight={'normal'}> Notifications</Heading>
            {(notifications) ? notifications.map((value) => (
              <Flex bg='green.100' flexDir={'column'} key={v4()} borderWidth='2px' mb='10px' p='10px'>
                <Text>{value.details}</Text>
                <Text>{notifLength}</Text>
                <Button bg='green.200' borderColor={'green.400'}>Mark As Read</Button>
              </Flex>
            )):null}
          </Flex>            

      
        <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input onChange = {e => setName(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>About</FormLabel>
              <Input  onChange = {e => setAbout(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Specialty</FormLabel>
              <Input  onChange = {e => setSpecialty(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Experience</FormLabel>
              <Input  onChange = {e => setExperience(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
                <FormLabel>Profile Image</FormLabel>
                <Button bg='blue.900' _hover={{bg:'blue.700'}}_focus={{bg:'blue.700'}}mb={2} color='white' onClick={handleClick3}>Upload Image</Button>
                <Input borderWidth='0px' style={{display:'none'}} ref={hiddenFileInput3} type='file' onChange = {(e) => {setImg(e.target.files[0])}}/>
            </FormControl> 

          </ModalBody>

          <ModalFooter>
            <Button onClick={() => {updateValues();onClose()}} colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
            </Flex>
      
    )
};