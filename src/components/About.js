import React from 'react'
import '../style1.css'
import adu from '../adu.png'


const About = () => {
  return (
    <div style = {{backgroundColor:'white'}} className='wrapper'>
        <h1>Our Team</h1>
  <div class="team">
    <div  class="team_member">
      <div class="team_img">
        <img src={adu} alt="Team_image"/>
      </div>
      <h3>Muhammad Hashir</h3>
      <p class="title">Developer</p>
      <p>Programming student</p>
      <p>Instructor: Dr Adel</p>
      <p>1072682@students.adu.ac.ae</p>
    </div>
    <div class="team_member">
      <div class="team_img">
    <img src={adu} alt="Team_image" />
      </div>
      <h3>Khaled Alkhyeli</h3>
        <p class="title">Developer</p>
        <p>Programming student </p>
        <p>Instructor: Dr Adel</p>
        <p>1066306@students.adu.ac.ae</p></div>
    <div class="team_member">
      <div class="team_img">
        <img src={adu} alt="Team_image" />
      </div>
      <h3>Umar Sani</h3>
      <p class="title">Developer</p>
      <p>Programming student</p>
      <p>Instructor: Dr Adel</p>
      <p>1073240@students.adu.ac.ae</p>
    </div>
  </div>

    </div>
  )
}

export default About