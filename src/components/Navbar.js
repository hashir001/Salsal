import {
  BrowserRouter as Router,
  Link,
} from "react-router-dom";
import { db, auth } from '../firebase'
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { collection, getDocs, onSnapshot, doc, query, where } from 'firebase/firestore';
import { useEffect, useState, useContext,useCallback, useReducer } from 'react';
import { useLocation } from 'react-router';
import { LoginContext } from './LoginContext'
import { BellIcon } from '@chakra-ui/icons';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useColorModeValue,
  useDisclosure,
  HStack,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  ModalOverlay,
  FormLabel,
  Input,
  ModalFooter,
  Flex,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Indicator } from "@mantine/core";


function Navbar() {
const { isOpen, onOpen, onClose } = useDisclosure();
// Sign In
const [ accounts, setAccounts ] = useState([]);
const [ loginEmail, setLoginEmail ] = useState("");
const [ loginPassword, setLoginPassword ] = useState("");
const [ user, setUser ] = useState({})
const [ isLoggedIn, setIsLoggedIn ] = useState(false);
const [ showMetaMask, setShowMetaMask ] = useState(false)

const { data, setData } = useContext(LoginContext);

const collectionRef = collection(db,"Accounts");

if(isLoggedIn && (data.accountType == 'admin' | data.accountType == 'collector' | data.accountType == 'expert' )){
  setShowMetaMask(true);
}

const getDocuments = async() => {
  getDocs(collectionRef)
  .then((snapshot) => {
      setAccounts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id })));  
  })
  .catch(err => console.log(err)); 

  const collRef = query(collection(db,"Accounts",user.uid,"Notifications"),where("seen","==","no"));
  getDocs(collRef)
  .then((snapshot) => {
    setNotifications(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))  
  })
  .catch(err => console.log(err));

  const collRef2 = query(collection(db,"BoardNotifications"),where("seen","==","no"));
  getDocs(collRef2)
  .then((snapshot) => {
    setBoardNotifications(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))  
  })
  .catch(err => console.log(err));
}

const setAccountType = async(user) => {
  const docRef = doc(db,'Accounts',user.uid);

  onSnapshot(docRef, (doc) => {
    setData({...data, accountType:doc.data().type, email:user.email, uid:user.uid})
  })
}



useEffect(()=>{
  setAccountType(user);
  getDocuments();
},[user])

const [ notifications, setNotifications ] = useState();
const [ boardNotifications, setBoardNotifications ] = useState();

useEffect(()=>{
onAuthStateChanged(auth, (currentUser) => {
  if(currentUser){
  setUser(currentUser); 
}     
});  

},[])

const login = async(e) => {
  try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
     console.log(user)
    } catch (error) {
      console.log(error.message);
    }
};


const logout = async () => {
  await signOut(auth);
   window.location.reload(true);

};



const [connected, toggleConnect] = useState(false);
const location = useLocation();
const [currAddress, updateAddress] = useState('0x');


async function getAddress() {
  const ethers = require("ethers");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const addr = await signer.getAddress();
  updateAddress(addr);
  
}

useEffect(()=>{
  setData({ ...data, address: currAddress })
  
},[currAddress])



let notifLength;

if(notifications !== undefined && notifications.length !== 0  ){
  console.log('length',notifications.length) 
  notifLength = notifications.length
}


async function connectWebsite() {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });

    if(chainId !== '0x5')
    {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }],
     })
    }  
    
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        getAddress();
        window.location.replace(location.pathname)
      });
  }

  const handleAccountChange = (...args) => {
    // you can console to see the args
    const accounts = args[0] ;
    // if no accounts that means we are not connected
    if (accounts.length === 0) {
      alert("Please connect to metamask");
      // our old data is not current connected account
      // currentAccount account that you already fetched and assume you stored it in useState
    } else if (accounts[0] !== currAddress) {
      // if account changed you should update the currentAccount so you return the updated the data
      // assuming you have [currentAccount,setCurrentAccount]=useState
      // however you are tracking the state currentAccount, you have to update it. in case of redux you have to dispatch update action etc
      updateAddress(accounts[0])
      
    }
  };

  useEffect(() => {
    let val = false;

    if (typeof window.ethereum !== 'undefined') {
      val = window.ethereum.isConnected();
    }
     
    if(val)
    {
      console.log(val)
      console.log('Metamask is installed!')
      getAddress();
      toggleConnect(val);
    }

    if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', handleAccountChange);
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountChange);
    };
    }
    
 });

 
 const profileLink = {
  pathname:"/profile/"+user.uid
}

const expertprofileLink = {
  pathname:"/expertprofile/"+user.uid
}

const notifLink = {
  pathname:"/notif/"+user.uid
}

const expertnotifLink = {
  pathname:"/expertnotif/"+user.uid
}

const boardnotifLink = {
  pathname:"/boardno"
}


    return (
     <div>
       
           <HStack bg='#020202'  justify='center' h='80px'>
          
            
            <Menu>
            <Link to = '/'>
              <Button
              fontWeight= 'semibold'
              ml='-200'
              pl={6} 
              py='22px' 
              bg='black'
              borderColor='black'
              color='white'
              borderRadius='lg'
              _hover={{bg:'blue.400'}}
              borderWidth='1px'
              fontSize='xl'>Home</Button></Link>

              <Link to = '/marketplace'>
              <Button
              fontWeight= 'semibold'
              mr='-1'
              px={2} 
              py='22px' 
              bg='black'
              borderColor='black'
              color='white'
              borderRadius='lg'
              _hover={{bg:'blue.400'}}
              _focus={{bg:'blue.400'}}
              borderWidth='1px'
              fontSize='xl'>Marketplace</Button></Link></Menu>
              {((data.accountType == 'collector') && data.address != '0x') ?
  <Menu>
            <MenuButton
             fontWeight= 'semibold'
             mr='-1'
             py={2} 
             bg='black'
             borderColor='black'
             color='white'
             borderRadius='lg'
             _hover={{bg:'blue.400'}}
             borderWidth='1px'
             fontSize='xl'
              _expanded={{ bg: 'blue.400' }}
            >
              Collector <ChevronDownIcon />
            </MenuButton>
            <MenuList>
            <Link to = '/upload'><MenuItem>Upload Collection</MenuItem></Link>
            <Link to = '/verified'><MenuItem>Verified</MenuItem></Link>
            <Link to = {profileLink}><MenuItem>Profile</MenuItem></Link>
             
            </MenuList>
          </Menu>
          
             : null} 



  {((data.accountType == 'admin') && data.address != '0x') ?
  <Menu>
            <MenuButton
             fontWeight= 'semibold'
             mr='-1'
             py={2} 
             bg='black'
             borderColor='black'
             color='white'
             borderRadius='lg'
             _hover={{bg:'blue.400'}}
             borderWidth='1px'
             fontSize='xl'
              _expanded={{ bg: 'blue.400' }}
            >
              Admin <ChevronDownIcon />
            </MenuButton>
            <MenuList>
            <Link to = '/admin'><MenuItem>Register Users</MenuItem></Link>             
            </MenuList>
          </Menu>
          
             : null} 


        {((data.accountType == 'expert') && data.address != '0x') ?
        <Menu>
        <MenuButton
             fontWeight= 'semibold'
             mr='-1'
             py={2} 
             bg='black'
             borderColor='black'
             color='white'
             borderRadius='lg'
             _hover={{bg:'blue.400'}}
             borderWidth='1px'
             fontSize='xl'
            _expanded={{ bg: 'blue.400' }}
        >
          Expert <ChevronDownIcon />
        </MenuButton>
        <MenuList>
        <Link to = '/verify'><MenuItem>View All Collections</MenuItem></Link>
        <Link to = {'/pending/' + data.uid}><MenuItem>Pending Requests</MenuItem></Link>
        <Link to = {'/approved/' + data.uid}><MenuItem>Approved Requests</MenuItem></Link>
        <Link to = {'/rejected/' + data.uid}><MenuItem>Rejected Requests</MenuItem></Link>
        <Link to = {expertprofileLink}><MenuItem>Profile</MenuItem></Link>
        </MenuList>
      </Menu>
             : null}


{((data.accountType == 'board') && data.address != '0x') ?
        <Menu>
        <MenuButton
             fontWeight= 'semibold'
             mr='-1'
             py={2} 
             bg='black'
             borderColor='black'
             color='white'
             borderRadius='lg'
             _hover={{bg:'blue.400'}}
             borderWidth='1px'
             fontSize='xl'
            _expanded={{ bg: 'blue.400' }}
        >
          Central Board <ChevronDownIcon />
        </MenuButton>
        <MenuList>
        <Link to = '/board'><MenuItem>View Collections</MenuItem></Link>
        </MenuList>
      </Menu>
             : null}

{(data.accountType == 'admin' | data.accountType == 'collector'  | data.accountType == 'expert' | data.accountType == 'board') ?
         <Button fontWeight= 'semibold' mr='-1' px={2} 
         py='22px' 
         bg='black'
         borderColor='black'
        color='white'
        borderRadius='lg'
        _hover={{bg:'blue.400'}}
        fontSize='xl'
        borderWidth='1px' onClick={logout}> Sign Out </Button> 
          :
          <Button 
          py='22px' 
         bg='black'
         borderColor='black'
        color='white'
        borderRadius='lg'
        _hover={{bg:'blue.400'}}
        fontSize='xl'
        borderWidth='1px'
        fontWeight= 'semibold' mr='-5px' px={2} 
            onClick={onOpen}> Login </Button>}

            <Menu>
              <Flex mb='10px' p='10px'>
                  {notifications && (data.accountType == 'collector') ? <Indicator label={notifications.length} inline size={22}>
                  <Link to={notifLink}><BellIcon color={'white'} boxSize='33px'/></Link>
                  </Indicator>:<></>}
                  {notifications && (data.accountType =='expert') ? <Indicator label={notifications.length} inline size={22}>
                  <Link to={notifLink}><BellIcon color={'white'} boxSize='33px'/></Link>
                  </Indicator>:<></>}
                  {boardNotifications && (data.accountType == 'board') ? <Indicator label={boardNotifications.length} inline size={22}>
                  <Link to={boardnotifLink}><BellIcon color={'white'} boxSize='33px'/></Link>
                  </Indicator>:<></>}
              </Flex>
           </Menu>
           
            <Button style = {{padding:8}} onClick={()=>connectWebsite()}>{connected? "MetaMask":"MetaMask"} </Button> 
           

            
             </HStack>
           
             <Modal  isOpen={isOpen} onClose={onClose} >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                  Log In
                  <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                  <form>
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input type='email'  mb='2' onChange={(e) => setLoginEmail(e.target.value)}/>
                      <FormLabel>Password</FormLabel>
                      <Input type='password' onChange={(e) => setLoginPassword(e.target.value)} />
                    </FormControl>
                  </form>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" colorScheme='blue' mr='7' borderRadius='xl' 
                  onClick={async(e) =>{
                  e.preventDefault();
                  await login();
                  onClose()}}> Submit </Button>

                  <Button onClick={onClose} borderRadius='xl'>Close</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
      </div>
      
    );
  }

  export default Navbar;