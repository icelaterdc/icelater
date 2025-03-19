import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import DiscordCard from './components/DiscordCard';
import GitHubRepos from './components/GitHubRepos';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import AICard from './components/AICard';

// İmleç etrafında pürüzlü sis efekti
function InteractiveEffects() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mistStyle = {
    background:
      'radial-gradient(circle at center, rgba(10,130,255,0.30) 0%, rgba(10,130,255,0.15) 30%, rgba(10,130,255,0.05) 60%, rgba(10,130,255,0) 100%)',
    filter: 'blur(12px) contrast(1.2)', // Pürüzlü görünüm için blur ve contrast
    borderRadius: '50%',
    width: '120px',
    height: '120px',
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

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollTop = useRef(0);

  useEffect(() => {
    document.title = "IceLater Full-Stack Developer";
  }, []);

  // Scroll pozisyonuna göre aktif bölümü ve snap efektini yönetiyoruz.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const currentScrollTop = container.scrollTop;
      const isScrollingDown = currentScrollTop > prevScrollTop.current;
      prevScrollTop.current = currentScrollTop;
      if (currentScrollTop < window.innerHeight * 0.5) {
        setActiveSection("home");
        container.classList.add("snap-active");
      } else if (currentScrollTop < window.innerHeight * 1.5) {
        setActiveSection("about");
        if (isScrollingDown) {
          container.classList.remove("snap-active");
        } else {
          container.classList.add("snap-active");
        }
      } else {
        setActiveSection("other");
        container.classList.remove("snap-active");
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="page-container text-white">
      {/* SVG filtresi tanımı */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
      </svg>

      <InteractiveEffects />
      <Header />
      <AudioPlayer audioSrc="/music/music.mp3" />

      {/* Home Bölümü */}
      <section id="home" className="snap flex items-center justify-center relative pt-20">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: activeSection === "home" ? 1 : 0 }}
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
            {/* Scroll Down Tasarımı */}
            <motion.div
              translate="no"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.75, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col items-center mt-8"
            >
              <div className="animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-400"
                >
                  <path d="M12 5v14" />
                  <path d="M19 12l-7 7-7-7" />
                </svg>
              </div>
              <p className="text-sm text-gray-400 mt-2 animate-pulse">Scroll Down</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* About Bölümü */}
      <section
        id="about"
        className="snap py-20"
        style={{ position: "relative", zIndex: 5, scrollMarginTop: '30px' }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: activeSection === "home" ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 md:px-6"
        >
          <h2 className="text-6xl font-permanent-marker text-center mb-10">
            Who am I ?
          </h2>
          <AboutSection />
        </motion.div>
      </section>

      {/* GitHub Projects Bölümü */}
      <section id="projects" className="non-snap py-4">
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

      {/* Artificial Intelligence Bölümü */}
      <section className="non-snap py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Artificial Intelligence
          </h2>
          <div className="flex flex-row flex-nowrap justify-center items-center gap-4">
            <div className="w-1/2 min-w-[150px] max-w-[300px]">
              <AICard
                title="Chat With AI"
                gifSrc="/others/ai-left.gif"
                link="/ai"
              />
            </div>
            <div className="w-1/2 min-w-[150px] max-w-[300px]">
              <AICard
                title="Create Image With AI"
                gifSrc="/others/ai-right.gif"
                link="/ai"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Bölümü */}
      <section id="contact" className="non-snap py-12">
        <div className="container mx-auto px-4 md:px-6">
          <ContactSection />
        </div>
      </section>

      {/* Footer (çeviri hariç tutulması için translate="no" ile sarıldı) */}
      <div translate="no">
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
