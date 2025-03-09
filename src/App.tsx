import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import DiscordCard from './components/DiscordCard';
import GitHubRepos from './components/GitHubRepos';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';

function InteractiveEffects() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mistStyle = {
    background: 'radial-gradient(circle at center, rgba(10,130,255,0.20) 0%, rgba(10,130,255,0.08) 40%, rgba(10,130,255,0.04) 70%, rgba(10,130,255,0) 100%)',
    filter: 'blur(8px)',
    borderRadius: '70%',
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) setMousePos({ x: touch.clientX, y: touch.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      left: mousePos.x,
      top: mousePos.y,
      transform: 'translate(-50%, -50%)',
      width: '85px',
      height: '85px',
      pointerEvents: 'none',
      ...mistStyle,
    }} />
  );
}

function AnimatedTitle() {
  const [displayText, setDisplayText] = useState("IceLater Full-Stack Developer");
  const [animationState, setAnimationState] = useState<"main" | "hello" | "icy">("main");
  const [fadeDirection, setFadeDirection] = useState<"in" | "out">("in");
  const [visibleChars, setVisibleChars] = useState<number[]>([]);
  
  const animateText = (text: string, isAppearing: boolean) => {
    const allIndices = [...Array(text.length).keys()];
    if (isAppearing) {
      setVisibleChars([]);
      if (text === "IceLater Full-Stack Developer") {
        setTimeout(() => setVisibleChars(allIndices.slice(0, 8)), 150);
        setTimeout(() => setVisibleChars(allIndices), 450);
      } else {
        const randomOrder = [...allIndices].sort(() => Math.random() - 0.5);
        randomOrder.forEach((index, i) => {
          setTimeout(() => setVisibleChars(prev => [...prev, index]), 150 + i * 150);
        });
      }
    } else {
      const randomOrder = [...allIndices].sort(() => Math.random() - 0.5);
      randomOrder.forEach((index, i) => {
        setTimeout(() => setVisibleChars(prev => prev.filter(idx => idx !== index)), i * 100);
      });
    }
  };
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (fadeDirection === "in") {
      animateText(displayText, true);
      timer = setTimeout(() => setFadeDirection("out"), 
        displayText === "IceLater Full-Stack Developer" ? 7000 : 4500);
    } else {
      animateText(displayText, false);
      timer = setTimeout(() => {
        setAnimationState(prev => prev === "main" ? "hello" : prev === "hello" ? "icy" : "main");
        setFadeDirection("in");
      }, displayText.length * 100 + 300);
    }
    return () => clearTimeout(timer);
  }, [animationState, fadeDirection]);

  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
      {displayText.split("").map((char, index) => (
        <span key={index} style={{ 
          opacity: visibleChars.includes(index) ? 1 : 0,
          transition: "opacity 0.3s ease",
          color: displayText === "IceLater Full-Stack Developer" && index < 8 ? "#3b82f6" :
                 displayText === "Hello, I'm IceLater" && index >= 10 ? "#3b82f6" :
                 displayText === "Sometimes Icy" && index >= 10 ? "#3b82f6" : "white"
        }}>
          {char}
        </span>
      ))}
    </h1>
  );
}

function App() {
  const snapContainerRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(Date.now());

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!snapContainerRef.current || !contentContainerRef.current || isScrolling.current) return;
      
      e.preventDefault();
      const now = Date.now();
      if (now - lastScrollTime.current < 800) return;
      lastScrollTime.current = now;

      const delta = e.deltaY;
      const isScrollingDown = delta > 0;
      const snapContainer = snapContainerRef.current;
      const contentContainer = contentContainerRef.current;

      const snapBottom = snapContainer.scrollHeight - snapContainer.clientHeight;
      const atSnapBottom = snapContainer.scrollTop >= snapBottom - 1;
      const atContentTop = contentContainer.scrollTop <= 0;

      if (isScrollingDown) {
        if (atSnapBottom) {
          contentContainer.scrollTop += delta;
        } else {
          snapContainer.scrollTop += delta;
        }
      } else {
        if (atContentTop) {
          snapContainer.scrollTop += delta;
        } else {
          contentContainer.scrollTop += delta;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    document.title = "IceLater Full-Stack Developer";
  }, []);

  return (
    <div className="app-root">
      <InteractiveEffects />
      <Header />
      <AudioPlayer audioSrc="/music/music.mp3" />

      <div ref={snapContainerRef} className="snap-container">
        <section id="home" className="snap">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-800/30 to-gray-950"></div>
          </div>
          <div className="container mx-auto px-4 md:px-6 py-16 relative z-10">
            <div className="flex flex-col items-center text-center mb-12">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <DiscordCard />
            </motion.div>
          </div>
        </section>

        <section id="about" className="snap py-20 bg-gray-950">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-6xl font-permanent-marker text-center mb-10">Who am I ?</h2>
            <AboutSection />
          </div>
        </section>
      </div>

      <div ref={contentContainerRef} className="content-container">
        <section id="projects" className="py-20 bg-gray-950/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">My GitHub Projects</h2>
              <p className="text-gray-300">
                Explore my latest repositories and contributions on GitHub.
              </p>
            </div>
            <GitHubRepos />
          </div>
        </section>

        <section id="contact" className="py-20 bg-gray-950">
          <div className="container mx-auto px-4 md:px-6">
            <ContactSection />
          </div>
        </section>

        <Footer />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        .font-permanent-marker { font-family: 'Permanent Marker', cursive; }
      `}</style>
    </div>
  );
}

export default App;
