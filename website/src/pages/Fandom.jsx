import React from "react";
import Meeseeks from '../assets/Meeseeks.webp';
import Poopybutthole from '../assets/Mr_poopy_butthole.webp';
import SpaceBeth from '../assets/SpaceBeth.jpg';
import Bojack from '../assets/bojackHorseman.webp';
import Todd from '../assets/ToddChavez.webp';
import PeanutButter from '../assets/MrPeanutButter.webp';
import Spongebob from '../assets/spongebob.png';
import Patrick from '../assets/patrick.png';
import Squidward from '../assets/squidward.png';
import Peter from '../assets/peter.png';
import Stewie from '../assets/stewie.png';
import Brian from '../assets/brian.webp';
import hoverSound from '../assets/beam_sound.mp3';
import './frenzy.css';

function Fandom() {
  const soundEffect = new Audio(hoverSound);
  const playSound = () => {
    soundEffect.currentTime = 0;
    soundEffect.play();
  };


  const shows = [
    {
      title: "Rick And Morty",
      characters: [
        {
          name: "Mr Meeseeks",
          description:
            "Mr. Meeseeks is a tall, powder-blue humanoid figure with elongated, narrow limbs. He has a large, bulbous head, beady black eyes, and a giant mouth that stretches across his face.",
          image: Meeseeks,
        },
        {
          name: "Mr. Poopybutthole",
          description:
            "Mr. Poopybutthole is a little yellow humanoid, with a sausage-shaped head, large eyes and a long nose.",
          image: Poopybutthole,
        },
        {
          name: "Space Beth",
          description:
            "Space Beth has a scar over her right eye and a piercing in her right eyebrow. Half her head is shaved, with a blue streak in the hair on the unshaven half.",
          image: SpaceBeth,
        },
      ],
    },
    {
      title: "Bojack Horseman",
      characters: [
        {
          name: "BoJack Horseman",
          description:
            "BoJack Horseman is bitter, depressed, self-loathing, narcissistic, and self-destructive. 1200-pound horse.",
          image: Bojack,
        },
        {
          name: "Todd Chavez",
          description:
            "Todd is a friendly, well-meaning, and mostly upbeat slacker who has been shown to possess a plethora of skills including an understanding of Japanese, entrepreneurial know-how, and artistic capabilities.",
          image: Todd,
        },
        {
          name: "Mr. PeanutButter",
          description:
            "Mr. Peanutbutter's demeanor is constantly energetic, nice, cheerful, kind, and playful.",
          image: PeanutButter,
        },
      ],
    },
    {
      title: "Family Guy",
      characters: [
        {
          name: "Peter Griffin",
          description: "The bumbling, overweight father who often gets himself into absurd situations.",
          image: Peter,
        },
        {
          name: "Stewie Griffin",
          description: "The evil-genius baby who constantly plots world domination.",
          image: Stewie,
        },
        {
          name: "Brian Griffin",
          description: "The family dog, who is also one of the most rational and sarcastic characters.",
          image: Brian,
        },
      ],
    },
    {
      title: "SpongeBob SquarePants",
      characters: [
        {
          name: "SpongeBob",
          description: "A cheerful sea sponge who loves his job.",
          image: Spongebob,
        },
        {
          name: "Patrick",
          description: "SpongeBob's best friend, a pink starfish.",
          image: Patrick,
        },
        {
          name: "Squidward",
          description: "Grumpy neighbor who plays the clarinet.",
          image: Squidward,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center p-8 space-y-20">
      {shows.map((show, showIndex) => (
        <div
          key={showIndex}
          className="show-container bg-gray-800 bg-opacity-70 rounded-lg shadow-lg p-12 w-4/5"
        >

          <h1 className="text-4xl font-bold text-white mb-12 text-center">
            {show.title}
          </h1>

        <div className="flex flex-wrap justify-center gap-12">
        {show.characters.map((character, charIndex) => (
          <div
            key={charIndex}
            onMouseEnter={playSound}
            className="character-card bg-gray-900 rounded-lg shadow-md p-4 transform transition duration-300 hover:scale-105 hover:shadow-[0_0_20px_10px] hover:shadow-purple-500"
          >
            <img
              src={character.image}
              alt={character.name}
              className="character-image w-full h-full object-cover mx-auto rounded-full"
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold text-white">
                {character.name}
              </h3>
              <p className="text-gray-300">{character.description}</p>
            </div>
          </div>
  ))}
</div>

        </div>
      ))}
    </div>
  );
}

export default Fandom;
