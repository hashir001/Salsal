import React from 'react'
import '../style1.css'


const Contact = () => {
  return (
    <div className='wrapper'>
        <section id="contact-section">
           <div class="container">
           	 <h2>Contact Us</h2>
              <p>Email us and keep upto date with our latest news</p>
             <div class="contact-form">        
           <div> 

             <form>
               <input className='inp' type="text" placeholder="Your Name" required/>
               <input className='inp' type="text" placeholder="Last Name" />
               <input className='inp' type="Email" placeholder="Email" required />
               <input className='inp' type="text" placeholder="Subject of this message" />
               <textarea name="message" placeholder="Message" rows="5" required />1
               <button class="submit" >Send Message</button> 
             </form>  
             
               </div>
             </div>
           </div>
         </section>
    </div>
  )
}

export default Contact