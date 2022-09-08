import React from 'react'
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from 'react';
import NFTTile from './NFTTile';


export default function ExpertDashboard() {
  const [ items, setItems ] = useState();
  const [ data, updateData ] = useState();
  const [dataFetched, updateFetched] = useState(false);

  async function getVerifiedObjects() {
    let sumPrice = 0;
    const ethers = require("ethers");    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();

    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
    let transaction = await contract.getVerifiedObjects();

    
    const items = Promise.all(transaction.map(async(i) => {
      const tokenURI = await contract.tokenURI(i.tokenId);

      let meta = await axios.get(tokenURI);
      meta = meta.data;

      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
          
      }
      sumPrice += Number(price);
      return item;

    }))

    updateData(items)
  }

  if(!dataFetched)
    getVerifiedObjects();

  return (
    <div>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-white">

            </div>
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
    )
}
