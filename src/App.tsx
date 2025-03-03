import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Header from './components/Header';
import DiscordCard from './components/DiscordCard';
import GitHubRepos from './components/GitHubRepos';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import { ChevronDown } from 'lucide-react';

// Yeni: InteractiveEffects bileşeni (Desktop ve Mobil uyumlu)
function InteractiveEffects() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [trails, setTrails] = useState([]);
  const [clickEffects, setClickEffects] = useState([]);
  const [drawingPoints, setDrawingPoints] = useState([]);
  const [tick, setTick] = useState(0);
  const fadeDuration = 2000; // ms, iz ve çizimlerin solma süresi

  // Ortak bir "efekt" stili: sis bulutu efekti
  const mistStyle = {
    background: 'radial-gradient(circle, rgba(0,123,255,0.5) 0%, rgba(0,123,255,0) 70%)',
  };

  // Event handler’lar; touch event’leri de ekleniyor
  useEffect(() => {
    const addTrailAndPoint = (x, y) => {
      // Trail (iz) ekle
      const id = Date.now() + Math.random();
      const newTrail = { id, x, y };
      setTrails((prev) => [...prev, newTrail]);
      setTimeout(() => {
        setTrails((prev) => prev.filter((trail) => trail.id !== id));
      }, fadeDuration);

      // Aynı anda free drawing noktasını ekle
      setDrawingPoints((prev) => [...prev, { x, y, t: Date.now() }]);
    };

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (isDragging) {
        addTrailAndPoint(e.clientX, e.clientY);
      }
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      if (touch) {
        setMousePos({ x: touch.clientX, y: touch.clientY });
        if (isDragging) {
          addTrailAndPoint(touch.clientX, touch.clientY);
        }
      }
    };

    const handleMouseDown = (e) => {
      setIsDragging(true);
      setDrawingPoints([{ x: e.clientX, y: e.clientY, t: Date.now() }]);
    };

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      if (touch) {
        setIsDragging(true);
        setDrawingPoints([{ x: touch.clientX, y: touch.clientY, t: Date.now() }]);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    const handleClick = (e) => {
      // Tıklama, sürükleme değilse
      if (!isDragging) {
        const id = Date.now() + Math.random();
        const newClickEffect = { id, x: e.clientX, y: e.clientY };
        setClickEffects((prev) => [...prev, newClickEffect]);
        setTimeout(() => {
          setClickEffects((prev) => prev.filter((ce) => ce.id !== id));
        }, 1000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('click', handleClick);
    };
  }, [isDragging]);

  // Sürekli güncelleme, free drawing opaklık hesaplamaları için
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Neon fare takipçisi, sis bulutu efekti */}
      <div
        style={{
          position: 'fixed',
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          pointerEvents: 'none',
          ...mistStyle,
        }}
      />

      {/* Sürükleme izleri: Her biri sis bulutu şeklinde */}
      {trails.map((trail) => (
        <div
          key={trail.id}
          style={{
            position: 'fixed',
            left: trail.x,
            top: trail.y,
            transform: 'translate(-50%, -50%)',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            pointerEvents: 'none',
            ...mistStyle,
            animation: 'fadeOut 2s forwards',
          }}
        />
      ))}

      {/* Tıklama efekti: Sis bulutu şeklinde belirir */}
      {clickEffects.map((ce) => (
        <div
          key={ce.id}
          style={{
            position: 'fixed',
            left: ce.x,
            top: ce.y,
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            pointerEvents: 'none',
            ...mistStyle,
            animation: 'fadeOut 1s forwards',
          }}
        />
      ))}

      {/* Free drawing: Her nokta için sis bulutu efekti veren SVG circle */}
      {drawingPoints.length > 0 && (
        <svg
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          <defs>
            <radialGradient id="mistGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(0,123,255,0.5)" />
              <stop offset="100%" stopColor="rgba(0,123,255,0)" />
            </radialGradient>
          </defs>
          {drawingPoints.map((point, index) => {
            const elapsed = Date.now() - point.t;
            const opacity = Math.max(0, 1 - elapsed / fadeDuration);
            return (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={12}
                fill="url(#mistGradient)"
                fillOpacity={opacity}
              />
            );
          })}
        </svg>
      )}

      {/* Animasyon keyframe tanımlaması */}
      <style>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
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

  return (
    <div className="bg-gray-900 text-white min-h-screen relative">
      {/* Arka plan ve mouse/touch etkileşimleri için overlay */}
      <InteractiveEffects />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
        style={{ scaleX }}
      />

      <Header />

      {/* Audio Player */}
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
    </div>
  );
}

export default App;
      
