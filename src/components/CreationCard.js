import { collection } from 'firebase/firestore'
import React from 'react'
import { Link } from 'react-router-dom'

const CreationCard = ({collectionData}) => {
    //bg-pink-900
    const newTo = {
        pathname:"/reqverify/"+collectionData.id
    }

  return (
    <div>
<div class="flex justify-center mt-20 gap-4">
  <div class="rounded-lg shadow-lg bg-red max-w-xs">
      <img style={{width:'50rem',height:'21rem'}} class="rounded-t-lg" src={collectionData.NFTImageURL} alt=""/>
  </div>
    <div class="p-6 bg-stone-400 w-[24rem]">
      <h5 class="text-black bg-stone-400 text-4xl font-medium mb-2">{collectionData.Name}</h5>
      <p class="text-black bg-stone-400 text-lg mb-4 mt-6">
      Description: {collectionData.Description} 
      </p>

      <h5 class="text-black bg-stone-400 text-lg font-medium mb-2 mt-6">Price: {collectionData.Price} eth</h5>
     
    </div>
  </div>
  </div>
    
  )
}

export default CreationCard