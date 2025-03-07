// App.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import DiscordCard from './components/DiscordCard';
import GitHubRepos from './components/GitHubRepos';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import GameModal from './components/GameModal';
import { ChevronDown } from 'lucide-react';

/* 
  AnimatedHeroText: 
  Bu bileşen, aşağıdaki sırayla animasyon uygular:
  1. "IceLater Full-Stack Developer" (başlangıçta 5 saniye sabit, 
     'IceLater' kısmı her zaman mavi),
  2. ardından harfler rastgele sırayla (karma şekilde) solup
  3. "Hello, I'm IceLater" harfleri rastgele sırayla belirir (3 saniye),
  4. sonra yine harfler rastgele solup,
  5. "Sometimes Icy" harfleri rastgele sırayla belirir (3 saniye) ve
  6. sonrasında tekrar ana metinle döngü başa döner.
*/
const AnimatedHeroText: React.FC = () => {
  const texts = [
    "IceLater Full-Stack Developer",
    "Hello, I'm IceLater",
    "Sometimes Icy"
  ];
  const displayDurations = [5000, 3000, 3000]; // ms
  const fadeDuration = 1000; // ms (fade-out ve fade-in süresi)
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [phase, setPhase] = useState<"display" | "fadeOut" | "fadeIn">("display");
  const [letterDelays, setLetterDelays] = useState<number[]>([]);

  const currentText = texts[currentTextIndex];

  // Geçiş başladığında, her harf için rastgele bir delay oluştur.
  useEffect(() => {
    const delays = currentText.split("").map(() => Math.random() * 0.5);
    setLetterDelays(delays);
  }, [currentText]);

  // Her faz için zamanlayıcı ayarla.
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === "display") {
      timer = setTimeout(() => setPhase("fadeOut"), displayDurations[currentTextIndex]);
    } else if (phase === "fadeOut") {
      timer = setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        setPhase("fadeIn");
      }, fadeDuration);
    } else if (phase === "fadeIn") {
      timer = setTimeout(() => setPhase("display"), fadeDuration);
    }
    return () => clearTimeout(timer);
  }, [phase, currentTextIndex, texts, displayDurations, fadeDuration]);

  // Variants; fadeIn için başlangıç: opacity 0, y +20; fadeOut için opacity 0, y -20.
  const letterVariants = {
    initial: (custom: number) =>
      phase === "fadeIn" ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 },
    animate: (custom: number) =>
      phase === "fadeIn"
        ? { opacity: 1, y: 0 }
        : phase === "fadeOut"
        ? { opacity: 0, y: -20 }
        : { opacity: 1, y: 0 },
  };

  return (
    <motion.h1
      className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      {currentText.split("").map((char, index) => {
        // 'IceLater' kısmı her zaman mavi olsun.
        let isIceLater = false;
        const pos = currentText.indexOf("IceLater");
        if (pos !== -1 && index >= pos && index < pos + "IceLater".length) {
          isIceLater = true;
        }
        return (
          <motion.span
            key={index}
            custom={letterDelays[index] || 0}
            variants={letterVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: letterDelays[index] || 0, duration: 0.5 }}
            style={{
              color: isIceLater ? "#3b82f6" : "inherit",
              display: 'inline-block',
              marginRight: '2px'
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </motion.h1>
  );
};

/*
  InteractiveEffects:
  İmlecin etrafında, neon ışığın altından hafifçe yayıldığı bir sis efekti.
  - Boyut: 75px
  - Kenarlarda kademeli azalma (daha organik, neon ışık efekti)
*/
function InteractiveEffects() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const mistStyle = {
    background: 'radial-gradient(circle at 50% 70%, rgba(0,123,255,0.25) 0%, rgba(0,123,255,0.15) 60%, rgba(0,123,255,0) 100%)'
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
        width: '75px',
        height: '75px',
        borderRadius: '50%',
        pointerEvents: 'none',
        ...mistStyle
      }}
    />
  );
}

function App() {
  useEffect(() => {
    document.title = "IceLater Full-Stack Developer";
  }, []);

  // Idle kontrolü: 30 saniye hareketsizlikte idle true
  const [idle, setIdle] = useState(false);
  const idleTimerRef = React.useRef<number | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (idle) setIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => setIdle(true), 30000);
  }, [idle]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetIdleTimer));
    resetIdleTimer();
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetIdleTimer));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  // Game modal kontrolü
  const [gameModalOpen, setGameModalOpen] = useState(false);
  const handleWaitImageClick = () => {
    setGameModalOpen(true);
    setIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  };
  const closeGameModal = () => {
    setGameModalOpen(false);
    resetIdleTimer();
  };

  return (
    <div className="min-h-screen relative" style={{ background: '#0d0d0d', color: '#ffffff' }}>
      {/* Arka plan ve fare/touch efekti */}
      <InteractiveEffects />
      <Header />
      <AudioPlayer audioSrc="/music/music.mp3" />

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative pt-20 text-center"
        style={{ background: 'linear-gradient(to bottom, rgba(96,165,250,0.4), #0d0d0d)' }}
      >
        <div className="container mx-auto px-4 md:px-6 py-16 relative z-10">
          <AnimatedHeroText />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center mt-12"
          >
            <a
              href="#about"
              className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
            >
              <span className="mb-2">Scroll Down</span>
              <ChevronDown className="animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20" style={{ background: '#0d0d0d' }}>
        <div className="container mx-auto px-4 md:px-6">
          <h2
            style={{
              fontFamily: "'Permanent Marker', cursive",
              fontSize: '3rem',
              marginBottom: '1rem',
              textAlign: 'center',
              color: '#ffffff'
            }}
          >
            Who am I ?
          </h2>
          <AboutSection />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20" style={{ background: '#141414' }}>
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

      {/* Contact Section */}
      <section id="contact" className="py-20" style={{ background: '#0d0d0d' }}>
        <div className="container mx-auto px-4 md:px-6">
          <ContactSection />
        </div>
      </section>

      <Footer />

      {/* Idle durumunda sol alt köşede wait image */}
      {idle && !gameModalOpen && (
        <div
          onClick={handleWaitImageClick}
          style={{
            position: 'fixed',
            left: '20px',
            bottom: '20px',
            cursor: 'pointer',
            animation: 'slideUp 1s forwards',
            zIndex: 999,
          }}
        >
          <img
            src="/game-pictures/wait-anime.png"
            alt="Wait Anime"
            style={{ width: '100px', height: 'auto', display: 'block' }}
          />
        </div>
      )}

      {/* Game Modal */}
      {gameModalOpen && <GameModal onClose={closeGameModal} />}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default App;
