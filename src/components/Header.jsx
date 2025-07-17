import React , {useRef} from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo.jpg';
import './header.css';
import clickSound from '../assets/OOF.mp3';

function Header() {
    const audioRef = useRef(new Audio(clickSound));

  const playSound = () => {
    audioRef.current.play();  
  };
  
  return (
    <header className="bg-gray-800 bg-opacity-70 backdrop-blur-md text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">

      <div className="flex items-center space-x-2">
        <img src={logo} alt="Brainrot Logo" className="h-8 w-8" />
        <Link to="/" className="text-xl font-bold">Brainrot</Link>
      </div>

      <nav className="hidden md:flex space-x-6">
        <Link to="/fandom" className="nav-button" onClick={playSound}>Fandom Galore</Link>
        <Link to="/DeepShowerThoughts" className="nav-button" onClick={playSound}>Deep Shower Thoughts</Link>
        <Link to="/MemeGenerator" className="nav-button" onClick={playSound}>Meme Machine</Link>
        <Link to="/Phobia" className="nav-button" onClick={playSound}>Phobias & Fears</Link>
        <Link to="/About" className="nav-button" onClick={playSound}>About Us</Link>
      </nav>


      <div className="space-x-4">
        <Link to="/login" className="nav-button" onClick={playSound}>Login</Link>
        <Link to="/register" className="nav-button" onClick={playSound}>Register</Link>
      </div>
    </header>
  );
}

export default Header;
