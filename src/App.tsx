// App.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Header from './components/Header';
import DiscordCard from './components/DiscordCard';
import GitHubRepos from './components/GitHubRepos';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import { ChevronDown } from 'lucide-react';
import GameModal from './components/GameModal';

// InteractiveEffects: Sadece imleç etrafında sis efekti (iz bırakmıyor)
function InteractiveEffects() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Sis efekti: biraz daha büyük ve daha soluk
  const mistStyle = {
    background: 'radial-gradient(circle, rgba(0,123,255,0.3) 0%, rgba(0,123,255,0) 80%)',
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
    <>
      {/* Neon fare takipçisi (iz bırakmadan, sadece imleç etrafında) */}
      <div
        style={{
          position: 'fixed',
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
          width: '50px', // boyut arttırıldı
          height: '50px',
          borderRadius: '50%',
          pointerEvents: 'none',
          ...mistStyle,
        }}
      />
    </>
  );
}

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    document.title = "IceLater | Full-Stack Developer";
  }, []);

  // Idle (hareketsizlik) kontrolü: 30 saniye etkileşim olmazsa idle true olacak
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
    <div className="bg-gray-900 text-white min-h-screen relative">
      {/* Arka plan ve fare/touch efektleri */}
      <InteractiveEffects />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
        style={{ scaleX }}
      />
      <Header />
      <AudioPlayer audioSrc="/music/music.mp3" />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-gray-900"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 py-16 relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              <span className="text-blue-500">IceLater</span> | Full-Stack Developer
            </motion.h1>
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
      <section id="about" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <AboutSection />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-900/50">
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
      <section id="contact" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <ContactSection />
        </div>
      </section>

      <Footer />

      {/* Idle durumunda, ekranın sol alt köşesinde wait image (üstte, sabit overlay) */}
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

      {/* Game Modal: Resme tıklanınca açılır */}
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
