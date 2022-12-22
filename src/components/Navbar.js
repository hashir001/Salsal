import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { db, auth } from '../firebase'
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { collection, addDoc, getDocs, getDoc, onSnapshot, doc, get, query, where,orderByChild } from 'firebase/firestore';
import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router';
import { AppContext } from '../App';
import { LoginContext } from './LoginContext'
import { StorageContext } from './StorageContext'
import '../style1.css'


function Navbar() {


// Sign In
const [ accounts, setAccounts ] = useState([]);
const [ loginEmail, setLoginEmail ] = useState("");
const [ loginPassword, setLoginPassword ] = useState("");
const [ user, setUser ] = useState({})
const [ isLoggedIn, setIsLoggedIn ] = useState(false);
const [ showMetaMask, setShowMetaMask ] = useState(false)

const { data, setData } = useContext(LoginContext);

const [ uid, setUID ] = useState("");

const collectionRef = collection(db,"Accounts");

if(isLoggedIn && (data.accountType == 'admin' | data.accountType == 'collector' | data.accountType == 'expert' )){
  setShowMetaMask(true);
}
console.log('address: ' + data.address);

const getDocuments = async() => {
  getDocs(collectionRef)
  .then((snapshot) => {
      
      setAccounts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id })));  
  })
  .catch(err => console.log(err)); 
}


const setAccountType = async(user) => {
  const docRef = doc(db,'Accounts',user.uid);

  onSnapshot(docRef, (doc) => {
    setData({...data, accountType:doc.data().type, email:user.email,uid:user.uid})
    console.log(doc.data().type)
    localStorage.setItem('accountType', JSON.stringify(doc.data().type));
    localStorage.setItem('address', JSON.stringify(currAddress))
  })
}

useEffect(()=>{
  setAccountType(user);
},[user])


useEffect(()=>{
onAuthStateChanged(auth, (currentUser) => {
  if(currentUser){
  setUser(currentUser); 
  console.log(currentUser)
}     
});  

getDocuments();
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

// end

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

function updateButton() {
  //document.querySelector('.enableEthereumButton').style.visibility   = "hidden";
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
        updateButton();
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
      updateButton();
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


    return (
     <div className='banner'>
      <nav style={{marginLeft:500}}className='navbar'>
        {/* <Link to = '/'>
          <img src = {logo}></img>
        </Link> */}

        <ul>
            <li style={{color:'black'}}><Link to = '/'>Home</Link></li>
            <li><Link to = '/marketplace'>Marketplace</Link></li>
            <li><Link to = '/board'>Board</Link></li> 

            
            {((data.accountType == 'collector'| data.accountType == 'admin') && data.address != '0x') ?
            <div className='dropdown'>
            <li className='dropbtn'>Collector</li>
            <div className='dropdown-content'>
            <li><Link style={{display:"block",paddingTop:3}} to = '/upload'>Upload Collection</Link></li>
            <br /><br />
            <li><Link style={{display:"block", width:50}} to = '/verified'>Verified</Link></li>
            <br /><br />
            <li><Link style={{display:"block", width:50}} to = {profileLink}>Profile</Link></li>
            </div>
            </div> : null} 

            {((data.accountType == 'expert'| data.accountType == 'admin') && data.address != '0x') ?
            <div className='dropdown'>
            <li className='dropbtn'>Expert</li>
            <div className='dropdown-content'>
            <li><Link style={{display:"block",paddingTop:3}} to = '/verify'>Verify</Link></li>
            <br /><br/>
            </div>
            </div> : null}

            <div className='dropdown'>
            {(data.accountType == 'admin' | data.accountType == 'collector' | data.accountType == 'expert') ?
            <li className='dropbtn'>Sign Out</li>:
            <li className='dropbtn'>Sign In</li>}
            <div className='dropdown-content'>
            

            
           {!(data.accountType == 'admin' | data.accountType == 'collector' | data.accountType == 'expert')?
           <>
            <input
            style = {{color:'black',display:"block",marginTop:6,marginLeft:20,border:'2px solid black',borderRadius:999,paddingLeft:13}}
            type="text"
            placeholder="Email..."
            onChange={(e) => setLoginEmail(e.target.value)}/>
            <br /><br/>

            <input
            style={{color:'black',position:'relative',bottom:30,marginLeft:20,border:'2px solid black', borderRadius:999,paddingLeft:13}}
            type="password"
            placeholder="Password..."
            onChange={(event) => {
            setLoginPassword(event.target.value);
               }}/> </>
               : null}
       
          <br /><br />

          {(data.accountType == 'admin' | data.accountType == 'collector' | data.accountType == 'expert') ?
         <button style={{border:'1px solid black',padding:2,position:'relative',bottom:40,left:13}} 
          onClick={logout}> Sign Out </button> 
          :
          <button 
            style={{border:'1px solid black',padding:2,position:'relative',bottom:40,left:13}}
            onClick={async(e) =>{
            e.preventDefault();
            await login();
            }}> Login </button>}

            </div>
            </div>

            <li>
            {/* {(isLoggedIn && (data.accountType == 'admin' | data.accountType == 'collector' | data.accountType == 'expert' )) 
            ?  */}
            
            <button style = {{padding:8}}
            className="enableEthereumButton text-black" onClick={()=>connectWebsite()}>
                  {connected? "MetaMask":"MetaMask"}
                </button> 
              </li>



            
        </ul>
      </nav>

        {/* // <div className='text-black text-bold text-right mr-10 text-sm'>
        //   {currAddress !== "0x" ? "Connected to":"Not Connected. Please login to view NFTs"} 
        {currAddress !== "0x" ? (currAddress.substring(0,15)+'...'):""}
        // </div> */}
      </div>
      
    );
  }

  export default Navbar;