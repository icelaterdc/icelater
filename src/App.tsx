import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Header from './components/Header';
import DiscordCard from './components/DiscordCard';
import GitHubRepos from './components/GitHubRepos';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import { ChevronDown } from 'lucide-react';

function InteractiveEffects() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const mistStyle = {
    background: 'radial-gradient(circle at center, rgba(10,130,255,0.20) 0%, rgba(10,130,255,0.08) 40%, rgba(10,130,255,0.04) 70%, rgba(10,130,255,0) 100%)',
    filter: 'blur(8px)',
    borderRadius: '70%',
  };

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleTouchMove = (e) => {
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

function AnimatedTitle() {
  const [displayText, setDisplayText] = useState("IceLater Full-Stack Developer");
  const [animationState, setAnimationState] = useState("main");
  const [fadeDirection, setFadeDirection] = useState("in");
  const [visibleChars, setVisibleChars] = useState([]);

  const animateText = (text, isAppearing) => {
    if (isAppearing) {
      setVisibleChars([]);
      const allIndices = [...Array(text.length).keys()];
      if (text === "IceLater Full-Stack Developer") {
        const iceIndices = allIndices.slice(0, 8);
        const restIndices = allIndices.slice(8);
        setTimeout(() => setVisibleChars(prev => [...prev, ...iceIndices]), 150);
        setTimeout(() => setVisibleChars(prev => [...prev, ...restIndices]), 450);
      } else {
        const randomOrder = [...allIndices].sort(() => Math.random() - 0.5);
        randomOrder.forEach((index, i) => {
          setTimeout(() => setVisibleChars(prev => [...prev, index]), 150 + i * 150);
        });
      }
    } else {
      const allIndices = [...Array(text.length).keys()];
      setVisibleChars(allIndices);
      const randomOrder = [...allIndices].sort(() => Math.random() - 0.5);
      randomOrder.forEach((index, i) => {
        setTimeout(() => setVisibleChars(prev => prev.filter(idx => idx !== index)), i * 100);
      });
    }
  };

  useEffect(() => {
    let timer;
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
        if (animationState === "main") setAnimationState("hello");
        else if (animationState === "hello") setAnimationState("icy");
        else setAnimationState("main");
        setFadeDirection("in");
      }, displayText.length * 100 + 300);
    }
    return () => clearTimeout(timer);
  }, [animationState, fadeDirection]);

  const getCharColor = (char, index, text) => {
    if (text === "IceLater Full-Stack Developer" && index >= 0 && index <= 7) return "#3b82f6";
    if (text === "Hello, I'm IceLater" && index >= 10 && index <= 18) return "#3b82f6";
    if (text === "Sometimes Icy" && index >= 10 && index <= 12) return "#3b82f6";
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

// Intersection Observer ile animasyonu tetikleyen özel bir bileşen
function AnimatedSection({ children, id }) {
  const controls = useAnimation();
  const [ref, setRef] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start({ opacity: 1, y: 0 });
        }
      },
      { threshold: 0.1 }
    );

    if (ref) observer.observe(ref);
    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, controls]);

  return (
    <motion.section
      ref={setRef}
      id={id}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.section>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "IceLater Full-Stack Developer";
    const style = document.createElement('style');
    style.innerHTML = `
      ::-webkit-scrollbar {
        width: 10px;
      }
      ::-webkit-scrollbar-track {
        background: #111827;
      }
      ::-webkit-scrollbar-thumb {
        background: #3b82f6;
        border-radius: 5px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #2563eb;
      }
      footer {
        min-height: 100vh; /* Footer'ın mobilde yeterince yer kaplamasını sağlar */
      }
    `;
    document.head.appendChild(style);
    setTimeout(() => setIsLoading(false), 500);

    // Scroll kontrolü: En alta ulaşıldığında footer'ı görünür tut
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const footer = document.querySelector('footer');

      if (scrollPosition >= documentHeight - 10) { // En alta yakınsa
        footer.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.head.removeChild(style);
    };
  }, []);

  const handleScrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen relative">
      <InteractiveEffects />
      <Header />
      <AudioPlayer audioSrc="/music/music.mp3" />

      <AnimatedSection id="home">
        <div className="min-h-screen flex items-center justify-center relative pt-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-800/30 to-gray-950"></div>
          </div>
          <div className="container mx-auto px-4 md:px-6 py-16 relative z-10">
            <div className="flex flex-col items-center text-center mb-12">
              <AnimatedTitle />
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex justify-center mt-12"
            >
              <a href="#about" className="flex flex-col items-center text-gray-400 hover:text-white transition-colors" onClick={handleScrollToAbout}>
                <span className="mb-2">Scroll Down</span>
                <ChevronDown className="animate-bounce" />
              </a>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      <div className="h-48 bg-gradient-to-b from-gray-950 to-gray-950"></div>

      <AnimatedSection id="about">
        <div className="py-20 bg-gray-950">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-6xl font-permanent-marker text-center mb-10">Who am I ?</h2>
            <AboutSection />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="projects">
        <div className="py-20 bg-gray-950/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">My GitHub Projects</h2>
              <p className="text-gray-300">Explore my latest repositories and contributions on GitHub.</p>
            </div>
            <GitHubRepos />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="contact">
        <div className="py-20 bg-gray-950">
          <div className="container mx-auto px-4 md:px-6">
            <ContactSection />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="footer">
        <Footer />
      </AnimatedSection>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        .font-permanent-marker {
          font-family: 'Permanent Marker', cursive;
        }
      `}</style>
    </div>
  );
}

export default App;
