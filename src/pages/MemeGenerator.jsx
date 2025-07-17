import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MemeGenerator() {
  const [memes, setMemes] = useState([]);
  const [usedMemes, setUsedMemes] = useState(new Set());
  const [currentMeme, setCurrentMeme] = useState(null);
  const [after, setAfter] = useState(null);

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const response = await axios.get(
        `https://www.reddit.com/r/memes.json?limit=100${after ? `&after=${after}` : ''}`
      );

      const posts = response.data.data.children;
      const newAfter = response.data.data.after;
      setAfter(newAfter);

      const imagePosts = posts.filter(
        (post) =>
          post.data.url &&
          (post.data.url.endsWith('.jpg') ||
            post.data.url.endsWith('.png') ||
            post.data.url.endsWith('.webp'))
      );

      const newMemes = imagePosts.map((post) => post.data);
      setMemes((prevMemes) => [...prevMemes, ...newMemes]);
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
  };

  const getRandomMeme = () => {
    if (memes.length === 0) return;

    let randomMeme;
    let tries = 0;

    do {
      randomMeme = memes[Math.floor(Math.random() * memes.length)];
      tries++;
    } while (usedMemes.has(randomMeme.url) && tries < 20);

    if (tries >= 20) {
      setUsedMemes(new Set());
    } else {
      setUsedMemes((prevSet) => new Set(prevSet).add(randomMeme.url));
    }

    setCurrentMeme(randomMeme);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingTop: '80px',
        paddingBottom: '80px',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '10px',
          padding: '20px',
          maxWidth: '800px',
          width: '90%',
          height: '80vh',
          overflowY: 'auto'
        }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '20px', textAlign: 'center' }}>
          Random Meme Generator
        </h1>
        {currentMeme ? (
          <>
            <img
              src={currentMeme.url}
              alt="Meme"
              style={{
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'contain',
                borderRadius: '10px',
                marginBottom: '20px'
              }}
            />
            <p style={{ fontSize: '1.2rem', marginBottom: '20px', textAlign: 'center' }}>
              {currentMeme.title}
            </p>
          </>
        ) : (
          <p style={{ marginBottom: '20px' }}>No memes available. Try again!</p>
        )}
        <button
          onClick={getRandomMeme}
          style={{
            backgroundColor: '#6a0dad',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            fontSize: '1.2rem',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Get a new Meme
        </button>
        <button
          onClick={fetchMemes}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Load More Memes
        </button>
      </div>
    </div>
  );
}

export default MemeGenerator;
