import { collection } from 'firebase/firestore'
import React from 'react'
import { Link } from 'react-router-dom'

const VerifyCard = ({collectionData}) => {
    const newTo = {
        pathname:"/createnft/"+collectionData.id
    }

  return (
    <div class="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
    <Link to = {newTo}>
        <img class="rounded-t-lg" src={collectionData.NFTImageURL} alt="" />
    </Link>
    <div class="p-5">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
        {collectionData.Name}</h5>
        
        <p class="mb-3 font-normal text-white dark:text-gray-400">
        {collectionData.Description}
        </p>
        
        <Link to={newTo} class="inline-flex items-center 
      py-2 px-3 text-lg font-medium text-center text-white bg-rose-900 rounded-lg  focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
             Create NFT
      </Link>
    </div>
    </div>
  )
}

export default VerifyCard