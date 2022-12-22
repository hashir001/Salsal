import {
    BrowserRouter as Router,
    Link,
  } from "react-router-dom";

function NFTTile (data) {
    const newTo = {
        pathname:"/nftPage/"+data.data.tokenId
    }
    return (
        <Link to={newTo}>
        <div className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
            <img src={data.data.image} className="w-72 h-80 rounded-lg object-cover" />
            <div className= "text-black w-full p-2  to-transparent rounded-lg pt-5 -mt-20">
                <strong className="text-xl" style={{color:'transparent'}}>.</strong>
            </div>
        </div>
        </Link>
    )
}

export default NFTTile;
