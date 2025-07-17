import React from 'react';
import './About.css';

import PeterImg from '../assets/Peter.png';
import JakeImg from '../assets/Jake.webp';
import FreshImg from '../assets/Fresh.png';
import FrankImg from '../assets/Frank.webp';

const brainRotters = [
    { id: 1, name: 'Guru', imgSrc: PeterImg },
    { id: 2, name: 'Shashank', imgSrc: JakeImg },
    { id: 3, name: 'Aarya', imgSrc: FreshImg },
    { id: 4, name: 'Rachit', imgSrc: FrankImg }
];

const About = () => {
    return (
        <div className="about-container">
            <h1 className="main-title">Mind Melt Zone</h1>
            <h2><b>Dive to the Chaos</b></h2>

            <div className="content">
                <p>
                    Lost in memes and wild thoughts? You’re in the right place. We embrace the madness, dive into the absurd, and explore the unknown. From mind-bending memes to deep dives into forgotten history, we push the limits of brainrot and bring the unpredictable to life. Ready to dive in?
                </p>
            </div>

            <h3 className="goal-heading">Our Goal - To extract a puzzle of feelings from you!</h3>

            <div className="brain-rotters-section">
                <h2 className="brain-rotters-title">The Brain-Rotters</h2>
                <div className="rotter-boxes">
                    {brainRotters.map((rotter) => (
                        <div key={rotter.id} className="rotter-box">
                            <img src={rotter.imgSrc} alt={rotter.name} className="rotter-img" />
                            <button className="rotter-button">{rotter.name}</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
