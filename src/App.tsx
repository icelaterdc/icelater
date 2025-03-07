import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import DiscordCard from './components/DiscordCard';
import GitHubRepos from './components/GitHubRepos';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import { ChevronDown } from 'lucide-react';

// InteractiveEffects: Sadece imleç etrafında sis efekti (iz bırakmadan)
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

// Hareketli yazı bileşeni (AnimatedTitle aynı kalıyor)
function AnimatedTitle() {
  // ... AnimatedTitle bileşeninin içeriği değişmediği için aynı kaldı ...
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    document.title = "IceLater Full-Stack Developer";
    const style = document.createElement('style');
    style.innerHTML = `/* Scrollbar stilleri aynı kalıyor */`;
    document.head.appendChild(style);
    
    setTimeout(() => setIsLoading(false), 500);
    return () => document.head.removeChild(style);
  }, []);

  const handleScrollToAbout = (e) => {
    e.preventDefault();
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    let lastScrollTop = 0;
    let isScrolling = false;
    const threshold = 100;
    const animationDuration = 800;

    const isBetweenSections = () => {
      const home = document.getElementById('home');
      const about = document.getElementById('about');
      if (!home || !about) return false;

      const homeBottom = home.offsetTop + home.offsetHeight;
      const aboutTop = about.offsetTop;
      const currentPos = window.scrollY + window.innerHeight/2;

      return currentPos > homeBottom - threshold && currentPos < aboutTop + threshold;
    };

    const handleScroll = () => {
      if (isScrolling || !isBetweenSections()) return;

      const currentScroll = window.scrollY;
      const direction = currentScroll > lastScrollTop ? 'down' : 'up';
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

      isScrolling = true;
      const targetSection = direction === 'down' ? 'about' : 'home';
      document.getElementById(targetSection)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      setTimeout(() => isScrolling = false, animationDuration);
    };

    const handleTouch = (e) => {
      if (!isBetweenSections()) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const currentY = touch.clientY;
      const deltaY = currentY - (window.touchStartY || currentY);
      window.touchStartY = currentY;

      if (Math.abs(deltaY) < threshold) return;

      isScrolling = true;
      const targetSection = deltaY > 0 ? 'home' : 'about';
      document.getElementById(targetSection)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      setTimeout(() => isScrolling = false, animationDuration);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', (e) => window.touchStartY = e.touches[0].clientY);
    window.addEventListener('touchmove', handleTouch, { passive: false });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', () => {});
      window.removeEventListener('touchmove', handleTouch);
    };
  }, []);

  return (
    <div className="bg-gray-950 text-white min-h-screen relative">
      <InteractiveEffects />
      <Header />
      <AudioPlayer audioSrc="/music/music.mp3" />

      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center mt-12"
          >
            <a
              href="#about"
              className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
              onClick={handleScrollToAbout}
            >
              <span className="mb-2">Scroll Down</span>
              <ChevronDown className="animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      <section id="about" className="py-20 bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-6xl font-permanent-marker text-center mb-10">Who am I ?</h2>
          <AboutSection />
        </div>
      </section>

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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        .font-permanent-marker { font-family: 'Permanent Marker', cursive; }
      `}</style>
    </div>
  );
}

export default App;
