// import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
// import { useLocation, useParams,Link } from 'react-router-dom';
// import {  useState } from 'react';
// import MarketplaceJSON from "../Marketplace.json";
// import React from 'react';
// import { storage, db } from '../firebase'
// import { v4 } from "uuid";
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   listAll,
//   list,
// } from "firebase/storage";
// import { collection, addDoc, getDocs, serverTimestamp, updateDoc, doc, arrayUnion, query, where, onSnapshot, snapshotEqual} from 'firebase/firestore';
// import { useEffect } from "react";
// import VerifyCard from "./VerifyCard";
// import '../style1.css';


// export default function Verified() {
//     const [ data, setData ] = useState();

//     const [ names, setNames ] = useState([]);
//     const [ nftImgs, setNftImgs ] = useState([]);
//     const [ docIDs, setDocIDs ] = useState([]);
//     const [ descriptions, setDescriptions ] = useState([]);
//     const [ secondaryUrls, setsecondaryUrls ] = useState([]);
//     const [ prices, setPrices ] = useState([]);

//     const link ="/reqverify/";


//     const collectionRef = collection(db, "Collection");

//     const q = query(collectionRef, where("Verified","==","Yes"))
   
    
//     useEffect(()=>{
//     onSnapshot(q, (snapshot) =>{

//         setData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

//         setNames(snapshot.docs.map(doc => doc.data().Name))   
//         setDescriptions(snapshot.docs.map(doc => doc.data().Description))
//         setPrices(snapshot.docs.map(doc => doc.data().Price))
//         setNftImgs(snapshot.docs.map(doc => doc.data().NFTImageURL))
//   })},[])
      
    
//   return (
//        <div className="wrapper">
//         <ul>
//         {(data) ? data.map((value) => (
//           <div>
//             <VerifyCard link = {link} collectionData = {value}/>
//           </div>
//         )):null}
//       </ul>
       

//        </div> 
//   )
// }


