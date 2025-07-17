import React from 'react';
import './Phobia.css';

const Phobia = () => {
  return (
    <div className="phobia-body">
      <h1>Phobia Frenzy</h1>
      <marquee direction="right">
        <div className="freaky-text">Can you feel it? The fear creeping in...</div>
      </marquee>

      <div className="content">
        <p><b><i>Ever had a fear so strange that it seems almost too bizarre to exist? Welcome to the world of phobias. Here, we unravel the most unexpected, unsettling fears that may make you question the very fabric of your mind.</i></b></p>
      </div>

      <marquee>
        <div className="freaky-text">I can't escape. I'm trapped in my mind. The fear never stops.</div>
      </marquee>

      <hr />

      <div className="brainrot-boxes">
        {phobiaData.map((phobia, index) => (
          <div key={index} className="brainrot-box">
            <img src={phobia.image} alt={phobia.alt} />
            <a href={phobia.link} className="brainrot-button">{phobia.name}</a>
          </div>
        ))}
      </div>

      <hr />

      <div className="distraction-links">
        <h3>
          <a href="https://gamingonphone.com/wp-content/uploads/2022/06/Subway-Surfers-Characters-Guide-Cover.jpg" target="_blank" rel="noopener noreferrer">
            Click here for a strange image...
          </a>
        </h3>
        <br />
        <h3>
          <a href="https://www.youtube.com/watch?v=wXo2znf4sZA" target="_blank" rel="noopener noreferrer">
            Or watch this eerie video...
          </a>
        </h3>
      </div>

      <br />
      <br />

    </div>
  );
};


const phobiaData = [
  {
    image: "https://i0.wp.com/bepsych.com/wp-content/uploads/2023/11/How-people-deal-with-cacophobia.jpg?resize=811%2C625&ssl=1",
    alt: "Cacophobia",
    link: "https://en.wikipedia.org/wiki/Glossophobia",
    name: "Cacophobia (Fear of Ugliness)"
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5F655ai9Kf1Hg7u2QxMb9mlTHSf6ft7pmJw&s",
    alt: "Atychiphobia",
    link: "https://en.wikipedia.org/wiki/Cacophobia",
    name: "Atychiphobia (Fear of Failure)"
  },
  {
    image: "https://humanfocus.co.uk/wp-content/uploads/nyctophobia.jpg",
    alt: "Nyctophobia",
    link: "https://en.wikipedia.org/wiki/Atychiphobia",
    name: "Nyctophobia (Fear of Darkness)"
  },
  {
    image: "https://www.verywellmind.com/thmb/0lLBKVpTnvhHQsOUQvkSA3BArGg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-200569619-008-56ff4e7e3df78c7d9e4d5848.jpg",
    alt: "Glossophobia",
    link: "https://en.wikipedia.org/wiki/Nyctophobia",
    name: "Glossophobia (Fear of Public-Speaking)"
  },
  {
    image: "https://pbs.twimg.com/media/Fzj-ehuXwAQOdVR.jpg",
    alt: "Arachibutyrophobia",
    link: "https://en.wikipedia.org/wiki/Scolionophobia",
    name: "Arachibutyrophobia (Fear of Butter Sticking to Your Mouth)"
  },
  {
    image: "https://images-cdn.ubuy.co.in/635232f523b8ca64831b10d9-dell-desktop-computer-package-with.jpg",
    alt: "Cyberphobia",
    link: "https://en.wikipedia.org/wiki/Arachibutyrophobia",
    name: "Cyberphobia (Fear of Computers)"
  },
  {
    image: "https://www.thesaurus.com/e/wp-content/uploads/2022/04/20220224_punctuation_asterisk_800x800.png",
    alt: "Erotophobia",
    link: "https://en.wikipedia.org/wiki/Erotophobia",
    name: "Erotophobia (Fear of ***)"
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTOkl7IMOSm_rh0tiU9a1OropsvGMp8pPiLA&s",
    alt: "Scolionophobia",
    link: "https://en.wikipedia.org/wiki/Cyberphobia",
    name: "Scolionophobia (Fear of School)"
  }
];

export default Phobia;
