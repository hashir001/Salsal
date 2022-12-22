import { Button, Divider, Flex, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import {useEffect, useState, useContext} from 'react'
import { v4 } from 'uuid'
import { collection, doc, getDocs, onSnapshot, orderBy, query, updateDoc,} from 'firebase/firestore';
import {  db } from '../firebase'
import { LoginContext } from './LoginContext'

const BoardNotifications = () => {
    const { data, setData } = useContext(LoginContext);
    const collRef = collection(db, "BoardNotifications");
    const q = query(collRef, orderBy("createdAt"));
    const [ notifications, setNotifications ] = useState();

    useEffect(()=>{
        onSnapshot(q, (snapshot) =>{
          setNotifications(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))})
  },[])


//   useEffect(()=>{
//     const collRef2 = collection(db,"BoardNotifications");
//     getDocs(collRef2)
//     .then((snapshot) => {
//       setNotifications(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))) 
//     })
//     .catch(err => console.log(err));
// },[])

let docRef;

  async function markAsRead(id){
    docRef = doc(db, "BoardNotifications", id)
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
        <Text><strong>{value.details}</strong></Text>
        <Text>Collection Name: <strong>{value.collectionName}</strong></Text>
        <Divider></Divider>
        <Text>{value.time}</Text>
        {value.seen ==='no'?<Button bg='green.400' borderColor={'green.400'} _hover={{bg:'green.300'}} onClick={()=>markAsRead(value.theDocID)}>Mark As Read</Button>:<></>}
      </Flex>
    )):null}
    </Flex>
  )
}

export default BoardNotifications