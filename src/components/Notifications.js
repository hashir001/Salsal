import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import {useEffect, useState, useContext} from 'react'
import { v4 } from 'uuid'
import { collection, addDoc, getDocs,getDoc, serverTimestamp, updateDoc, doc, arrayUnion, query, 
    where, onSnapshot, increment,snapshotEqual, writeBatch, orderBy} from 'firebase/firestore';
import {  db } from '../firebase'
import { LoginContext } from './LoginContext'
import { useParams } from 'react-router';

const Notifications = () => {
    const { data, setData } = useContext(LoginContext);
    const [ notifications, setNotifications ] = useState();
    let { id } = useParams();
    const collRef = collection(db, "Accounts",id,"Notifications");
    const q = query(collRef, orderBy("createdAt"))


    useEffect(()=>{
        onSnapshot(q, (snapshot) =>{
          setNotifications(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))})
  },[])


  console.log(notifications)

  let docRef;

  async function markAsRead(id,collectorUID){
    docRef = doc(db, "Accounts",collectorUID,"Notifications", id)
    updateDoc(docRef,{
      seen:'yes'
    })
    .then(() => console.log('success'))
  }

  return (
    <Flex flexDir='column' align='center'>
    <Heading style={{color:'black'}} mt='40px' fontWeight={'normal'} mb={8}> Notifications</Heading>
    {(notifications) ? notifications.map((value) => (
      <Flex bg={value.seen === 'no'? 'green.100':'gray.100'} w='300px'flexDir={'column'} key={v4()} borderWidth='2px' mb='10px' p='10px'>
        <Text>{value.details}</Text>
        <Text>{value.time}</Text>
        <Text>{notifications.length}</Text>
        {value.seen ==='no'?<Button bg='green.400' borderColor={'green.400'} _hover={{bg:'green.300'}} onClick={()=>markAsRead(value.theDocID,value.collectorUID)}>Mark As Read</Button>:<></>}
      </Flex>
    )):null}
    </Flex>
  )
}

export default Notifications