import { Alert, AlertIcon, Button, Flex, FormControl, FormLabel, Heading, Input, Select, Stack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
import { collection, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase'
require('firebase/auth')


const AdminPage = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState()
  const [ type, setType ] = useState('')
  const [ showAlert, setShowAlert ] = useState(false)

  async function signUp(e){
    e.preventDefault();
    
    createUserWithEmailAndPassword(auth,email,password).then(cred => {
    const docRef = doc(db, 'Accounts', cred.user.uid);
    setDoc(docRef, { email: email, type: type, uid: cred.user.uid});
    sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log('it went')
      setShowAlert(true)

    })
    .catch((error) => {
      console.log(error.code)
    })
    })

    setEmail('')
    setPassword('')
    setType('')
  }

  return (
    <Flex flexDir='column' align='center' justify='center' mb={10}>    
    <Stack direction='column' borderWidth='3px'mt={8} boxShadow='2xl' w='600px' h='50%' px='50px' py='40px'>
      <Heading mb='20px' align='center'>Admin Create User Form</Heading> 
    <FormControl>
    <FormLabel fontWeight='bold'>Email</FormLabel>
      <Input type='email' value = {email} onChange = {(e) => setEmail(e.target.value)} mb={4}/>
    <FormLabel  fontWeight='bold'>Password</FormLabel>
      <Input type='password' value = {password} onChange = {(e) => setPassword(e.target.value)} mb={4}/>
    <Select placeholder='Select User Type' value = {type} onChange = {(e) => setType(e.target.value)}>
      <option value='collector'>Collector</option>
      <option value='expert'>Expert</option>
      <option value='board'>Board Member</option>
    </Select>
    </FormControl>
    <br />
      <Button alignSelf={'center'} onClick={signUp}> Create User</Button> 
      {showAlert === true? <Alert status='success'>
    <AlertIcon />
    User Registered and Reset Password Link Sent
  </Alert>:<></>}      
       </Stack> 
    </Flex>
  )
}

export default AdminPage