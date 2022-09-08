import React from 'react'
import '../style1.css'

const Mission = () => {
  return (
    <div className='wrapper'>
    <section class ="Mission">
        <div class = "Main">
            
            <div class = "about-text">
                <h1>Our Mission</h1>
                <p>There is a need to provide verification of objects and creating a community around this because this allows Collectors 
                    to publicly demonstrate that their objects have been legally obtained.This pushes up the reputation of the Collector
                    and the value of his collection and creates a better overall community around heritage objects. The public also has the
                    desire for ethically obtained objects. The motivation why such technology is needed is because it allows these objects to
                    be documented and updated in an immutable, secure and decentralized network, which uses nodes across the world to
                    store the blocks of information.</p>
                    <button onclick ="location.href='Documents/BlockchainForHeritageObjectsCollectionVerification.pdf';">Learn More</button>
            </div>
        </div>

    </section>
    
    
    </div>
  )
}

export default Mission