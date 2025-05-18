import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './App.css'; // CSS dosyası eklendi
import Header from './components/Header';
import DiscordCard from './components/DiscordCard';
import GitHubRepos from './components/GitHubRepos';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import FeatureCard from './components/FeatureCard';
import Modal from './components/Modal';
import AIModalContent from './components/AIModalContent';
import GamesModalContent from './components/GamesModalContent';
import GalleryModalContent from './components/GalleryModalContent';

function InteractiveEffects() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        setMousePos({ x: touch.clientX, y: touch.clientY });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div
      className="neon-mist"
      style={{
        left: mousePos.x,
        top: mousePos.y,
      }}
    />
  );
}

function AnimatedTitle() {
  const [displayText, setDisplayText] = useState("IceLater Full-Stack Developer");
  const [animationState, setAnimationState] = useState("main");
  const [fadeDirection, setFadeDirection] = useState("in");
  const [visibleChars, setVisibleChars] = useState<number[]>([]);

  const animateText = (text: string, isAppearing: boolean) => {
    if (isAppearing) {
      setVisibleChars([]);
      const allIndices = [...Array(text.length).keys()];
      if (text === "IceLater Full-Stack Developer") {
        const iceIndices = allIndices.slice(0, 8);
        const restIndices = allIndices.slice(8);
        setTimeout(() => {
          setVisibleChars(prev => [...prev, ...iceIndices]);
        }, 150);
        setTimeout(() => {
          setVisibleChars(prev => [...prev, ...restIndices]);
        }, 450);
      } else {
        const randomOrder = [...allIndices].sort(() => Math.random() - 0.5);
        randomOrder.forEach((index, i) => {
          setTimeout(() => {
            setVisibleChars(prev => [...prev, index]);
          }, 150 + i * 150);
        });
      }
    } else {
      const allIndices = [...Array(text.length).keys()];
      setVisibleChars(allIndices);
      const randomOrder = [...allIndices].sort(() => Math.random() - 0.5);
      randomOrder.forEach((index, i) => {
        setTimeout(() => {
          setVisibleChars(prev => prev.filter(idx => idx !== index));
        }, i * 100);
      });
    }
  };

  useEffect(() => {
    let timer: any;
    if (fadeDirection === "in") {
      if (animationState === "main") {
        setDisplayText("IceLater Full-Stack Developer");
        animateText("IceLater Full-Stack Developer", true);
        timer = setTimeout(() => setFadeDirection("out"), 7000);
      } else if (animationState === "hello") {
        setDisplayText("Hello, I'm IceLater");
        animateText("Hello, I'm IceLater", true);
        timer = setTimeout(() => setFadeDirection("out"), 4500);
      } else if (animationState === "icy") {
        setDisplayText("Sometimes Icy");
        animateText("Sometimes Icy", true);
        timer = setTimeout(() => setFadeDirection("out"), 4500);
      }
    } else if (fadeDirection === "out") {
      animateText(displayText, false);
      timer = setTimeout(() => {
        if (animationState === "main") {
          setAnimationState("hello");
        } else if (animationState === "hello") {
          setAnimationState("icy");
        } else {
          setAnimationState("main");
        }
        setFadeDirection("in");
      }, displayText.length * 100 + 300);
    }
    return () => clearTimeout(timer);
  }, [animationState, fadeDirection]);

  const getCharColor = (char: string, index: number, text: string) => {
    if (text === "IceLater Full-Stack Developer") {
      if (index >= 0 && index <= 7) return "#3b82f6";
    } else if (text === "Hello, I'm IceLater") {
      if (index >= 10 && index <= 18) return "#3b82f6";
    } else if (text === "Sometimes Icy") {
      if (index >= 10 && index <= 12) return "#3b82f6";
    }
    return "white";
  };

  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
      {displayText.split("").map((char, index) => (
        <span
          key={index}
          style={{
            opacity: visibleChars.includes(index) ? 1 : 0,
            transition: "opacity 0.3s ease",
            color: getCharColor(char, index, displayText),
          }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
}

// App bileşeni aşağıda devam ediyor (değişmediği için aynı)

export default App;
