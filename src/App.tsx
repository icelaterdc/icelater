import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import DiscordCard from './components/DiscordCard';
import GitHubRepos from './components/GitHubRepos';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';

// İmleç etrafında yumuşak sis efekti
function InteractiveEffects() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mistStyle = {
    background:
      'radial-gradient(circle at center, rgba(10,130,255,0.20) 0%, rgba(10,130,255,0.08) 40%, rgba(10,130,255,0.04) 70%, rgba(10,130,255,0) 100%)',
    filter: 'blur(8px)',
    borderRadius: '70%',
  };

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
      style={{
        position: 'fixed',
        left: mousePos.x,
        top: mousePos.y,
        transform: 'translate(-50%, -50%)',
        width: '85px',
        height: '85px',
        pointerEvents: 'none',
        ...mistStyle,
      }}
    />
  );
}

// Hareketli Yazı Bileşeni
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

// Home Page Component
function Home() {
  return (
    <section id="home" className="flex items-center justify-center relative pt-20 min-h-screen">
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-800/30 to-gray-950"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 py-16 relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.div
              translate="no"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatedTitle />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-2xl"
            >
              Building modern web applications with passion and precision.
              Transforming ideas into elegant, functional digital experiences.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <DiscordCard />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// About Page Component
function About() {
  return (
    <section id="about" className="py-20 bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-6xl font-permanent-marker text-center mb-10">
          Who am I ?
        </h2>
        <AboutSection />
      </div>
    </section>
  );
}

// Projects Page Component
function Projects() {
  return (
    <section id="projects" className="py-4 bg-gray-950/50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            My GitHub Projects
          </h2>
          <p className="text-gray-300">
            Explore my latest repositories and contributions on GitHub.
          </p>
        </div>
        <GitHubRepos />
      </div>
    </section>
  );
}

// Contact Page Component
function Contact() {
  return (
    <section id="contact" className="py-10 bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <ContactSection />
      </div>
    </section>
  );
}

// Main App Component with Routing
function App() {
  useEffect(() => {
    document.title = "IceLater Full-Stack Developer";
  }, []);

  return (
    <Router>
      <div className="page-container bg-gray-950 text-white">
        <InteractiveEffects />
        <Header />
        <AudioPlayer audioSrc="/music/music.mp3" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <div translate="no">
          <Footer />
        </div>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
          .font-permanent-marker { font-family: 'Permanent Marker', cursive; }
        `}</style>
      </div>
    </Router>
  );
}

export default App;


Ayrıca react router sürümünü de bana önerirsen güzel olur
