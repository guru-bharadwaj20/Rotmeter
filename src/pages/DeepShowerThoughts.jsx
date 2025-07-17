import React from 'react';

const DeepShowerThoughts = () => {
    return (
        <div>
            <style>
                {`
                    body {
                        font-family: 'Poppins', sans-serif;
                        margin: 0;
                        padding: 0;
                        color: #333;
                    }

                    .main-container {
                        padding: 30px 20px;
                        max-width: 900px;
                        margin: 40px auto;
                        background-color: rgba(255, 255, 255, 0.85);
                        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
                        border-radius: 12px;
                        transition: transform 0.3s ease;
                    }

                    .main-container:hover {
                        transform: translateY(-5px);
                    }

                    .main-container h1 {
                        font-size: 48px;
                        color: #2C3E50;
                        text-align: center;
                        font-weight: 700;
                        margin-bottom: 20px;
                        text-transform: uppercase;
                    }

                    .main-container h2 {
                        font-size: 32px;
                        color: #2980B9;
                        margin-bottom: 20px;
                        text-align: center;
                        font-weight: 600;
                    }

                    .thought {
    font-size: 20px;
    line-height: 1.8;
    margin-bottom: 20px;
    padding: 20px;
    border-left: 6px solid #2980B9;
    background-color: #ECF0F1; /* Light background */
    color: #000; /* Changed text color to black */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: background-color 0.3s ease;
    word-wrap: break-word;
}

.thought:hover {
    background-color: #D5E8F7;
}
                    }

                    .main-container p {
                        margin-bottom: 20px;
                    }

                    .main-container .cta-button {
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #2980B9;
                        color: white;
                        font-weight: 600;
                        text-decoration: none;
                        border-radius: 8px;
                        transition: background-color 0.3s ease;
                        margin-top: 30px;
                        text-align: center;
                    }

                    .main-container .cta-button:hover {
                        background-color: #1A5F7A;
                    }

                    .background {
                        background: url('https://media.istockphoto.com/id/1368214406/photo/water-running-from-a-black-rain-shower-head.jpg?s=612x612&w=0&k=20&c=fBIC-HqnXRnAoJzKt5M9-0cxlQY5xyy9Ckep_feWFfc=') center center no-repeat;
                        background-size: cover;
                        background-attachment: fixed;
                    }
                `}
            </style>
            <div className="background">
                <main className="main-container">
                    <h1>Deep Shower Thoughts</h1>
                    <section className="thoughts">
                        <h2>Shower Thoughts: The Deep Paradox of Brain Rot Maxing</h2>
                        <p className="thought">"I’m procrastinating by procrastinating." <br />If I’m aware that I’m procrastinating, does that mean I’m actually just delaying my awareness of procrastination? Am I maxing the procrastination, or is the procrastination maxing me?</p>
                        <p className="thought">"Every second I spend on my phone is both time I’m wasting and time I’m losing forever." <br />But, like, the phone is literally designed to make me feel like I’m not wasting time, even though I definitely am. It's like a paradoxical illusion — I can escape time… but only by losing it.</p>
                        <p className="thought">"The more I 'brain rot' by watching videos on YouTube, the more I feel like I’m upgrading to a new level of awareness... but it’s just the awareness of my own laziness." <br />Maybe the true maxing isn't the number of videos I watch, but the ever-increasing realization that I could be doing something better — and doing nothing is the most efficient form of rebellion against productivity culture.</p>
                        <p className="thought">"I wonder if the people who created social media ever imagined they were giving us a tool to reach enlightenment... through endless memes and cat videos." <br />Or maybe this is their version of the Matrix — we think we're getting smarter, but really we're just getting better at being distracted.</p>
                        <p className="thought">"Every time I finish a series, I feel a strange sense of accomplishment... as if binge-watching is some form of personal achievement." <br />Like, I spent hours and hours absorbing someone else’s creativity, and somehow, this has earned me a deep sense of fulfillment. Is this really living, or just existing at a slower pace?</p>
                        <p className="thought">"Brain rot maxing is the only form of self-improvement that requires absolutely no effort, yet still feels like an achievement." <br />Like, who needs self-help books or meditation when I can max out my brain rot levels in one sitting? The paradox of modern life: spending hours doing nothing while convincing myself I’ve learned something profound.</p>
                        <p className="thought">"In the digital age, we don’t just consume content — we binge on it like it's a buffet, but instead of getting full, we just get hungrier." <br />There's always more content to consume. Just when I think I've seen it all, there’s a new algorithmic suggestion that promises to 'enlighten' me further. But deep down, I know it’s just another distraction.</p>
                        <p className="thought">"Does the brain rot affect the mind, or does it just affect how we perceive time? When I look back at a 4-hour binge, did I even experience those hours?" <br />It’s like the time passes, but it doesn’t really pass. It’s not that I wasted those hours — they’ve just disappeared. Do I actually remember anything from what I watched? Or is my mind just pretending?</p>
                        <p className="thought">"Maybe true brain rot isn’t the excessive consumption of content... but the inability to stop once you start. It’s the addictive, passive spiral that convinces you that you need more, but you’re not sure exactly what it is." <br />Every moment spent mindlessly scrolling feels like I’m just moments away from a revelation. But no. It's never a revelation — just more of the same dopamine hits. It’s like trying to catch a falling star with a fishing net.</p>
                        <p className="thought">"If the human brain is capable of anything, why are we all just wasting hours watching things that don’t even require thought?" <br />Maybe our brains are just too advanced for their own good. We’ve reached a point where thinking is optional, and sometimes, thinking is just exhausting. So, we outsource our thoughts to whatever's playing on the screen.</p>
                        <p className="thought">"At some point, I stopped being a person and became a walking, talking algorithm... responding to notifications, clicking links, getting lost in a labyrinth of my own design." <br />If I’m constantly fed content tailored to me, am I even making choices anymore, or is the algorithm making them for me? Can I really say I’m ‘maxing’ my brain, or is my brain just being maxed by the digital world?</p>
                        <p className="thought">"The more I think about brain rot maxing, the more I realize... maybe I’ve been ‘maxing’ my brain by doing nothing and calling it everything." <br />Every moment of non-action feels like an accomplishment when I’ve convinced myself that resting or staring at a screen is just as important as active learning. At what point does the nothingness become the everything?</p>
                        <p className="thought">"If brain rot maxing is the ultimate escape from self-improvement culture, what happens when we max out and there’s nowhere left to go?" <br />Maybe the answer is simple: You stop. You un-max. You reclaim your brain. But then, what would I do with all this free time? Probably watch another video.</p>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default DeepShowerThoughts;