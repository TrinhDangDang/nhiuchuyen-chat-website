// import {useEffect, useState} from 'react';
import { useState } from "react"
import './about.css'



const About = () =>{

    const [firstLetter, setFirstLetter] = useState('')
    const [secondLetter, setSecondLetter] = useState('')
    const [thirdLetter, setThirdLetter] = useState('')
    const [message, setMessage] = useState('');
    const [showSuprise, setShowSurpise] = useState(false);
    const [showFlipCard, setShowFlipCard] = useState(true);


    const correctName = ['T', 'r', 'i', 'n', 'h'];

    const aLittleSuprise = () => {
        const enteredName = [
            firstLetter.toUpperCase(),
            secondLetter.toUpperCase(),
            thirdLetter.toUpperCase(),
        ].join('');

        if (enteredName === "TIH") {
            setMessage("Correct! That's my name! 🎉");
            setShowSurpise(true);
            setShowFlipCard(false);
            
        } else {
            setMessage("Oops, that's not my name. Try again!");
        }
    }

    const cards = Array.from({ length: 10 }, (_, index) => (
       <div className="flip-card-container">
            <div className="flip-card" key={index}>
                <div className="flip-card-inner">
                    <div className="flip-card-front" >
                    </div>
                    <div className="flip-card-back">
                        <h3>{correctName[index % correctName.length]}</h3>
                    </div>
                </div>
            </div>
        </div> 
    ));
    

    return (
        <main className="public__main">
            {cards}
            <button onClick={aLittleSuprise}>Submit</button>
            <p>{message}</p>
            <section className='center-section'>
                <div className="xaochin-section">
                </div>
            </section>
            
            
            <section className="details">
                <p> my name is trinh i am a computer science student at uhcl i know a bit of python javascript c java react redux expressJs nodeJs blender html css git version control mySQL just a bit of this a that figuring things out i worked on this <a href='https://trinhdangdang.github.io/pacman-inspired-game/'>PACMAN & SPONGEBOB</a> i put stuffs i worked on here<a href='https://github.com/TrinhDangDang'> https://github.com/TrinhDangDang</a></p>
                <p>life long leaner</p>
                <p>perfectioist turns procrastinator</p>
                <p>worrier to warrier</p>
                <p>shameless fighter</p>
            </section>
            <div className="features-left">
                        <h1>The quickest way to create modern presentation</h1>
                        <p>Best software platform for running an internet business. We build the most powerful and flexible tools for internet commerce.</p>
                    </div>
                    <div className="features-right">
                        <div className="features-card first">
                            <img src="https://assets.website-files.com/62ce97d15218c10ce2fc3a24/62ce9a5a8730bad1850e8516_Group%2018.png" loading="lazy" width="195" alt="" className="features-card-img"/>
                            <div className="features-card-title">Managment</div>
                            <p>Software platform for running your new internet business</p>
                        </div>
                        <div className="features-card second">
                            <img src="https://assets.website-files.com/62ce97d15218c10ce2fc3a24/62ce9a5a9e01c66cd417563f_Group%2017.png" loading="lazy" width="195" alt="" className="features-card-img"/>
                            <div className="features-card-title">Entertainment</div>
                            <p>Software platform for running your new internet business</p>
                        </div>
                        <div className="features-card third">
                            <img src="https://assets.website-files.com/62ce97d15218c10ce2fc3a24/62ce9a5a9ceda35231ae8194_Group%2015.png" loading="lazy" width="195" alt="" className="features-card-img"/>
                            <div className="features-card-title">Marketing</div>
                            <p>Software platform for running your new internet business</p>
                        </div>
                        <div className="features-card fourth">
                            <img src="https://assets.website-files.com/62ce97d15218c10ce2fc3a24/62ce9a5a50a221779aa0ca84_Group%2016.png" loading="lazy" width="195" alt="" className="features-card-img"/>
                            <div className="features-card-title">References</div>
                            <p>Software platform for running your new internet business</p>
                        </div>
                    </div>
            <section className="resume">
                If you like you can check out my resume here
            </section>
            <section>
                you can contact me at trinhdangdang@gmail.com or shoot me a direct message on this website after creating an account
            </section>
        </main>
    )
}

export default About