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

// InteractiveEffects: Sadece imleç etrafında sis efekti (iz bırakmadan)
function InteractiveEffects() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Sis efekti: boyut artırıldı, daha soluk ve kademeli fade-out (kenarlara doğru azalan parlaklık)
  const mistStyle = {
    // Daha açık mavi ton ve daha hafif neon efekti
    background: 'radial-gradient(circle, rgba(10,130,255,0.12) 0%, rgba(10,130,255,0.04) 60%, rgba(10,130,255,0) 100%)',
    boxShadow: 'none', // Dümdüz sınırları kaldırmak için boxShadow kaldırıldı
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
      <div
        style={{
          position: 'fixed',
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
          width: '75px', // 75px olarak güncellendi
          height: '75px',
          borderRadius: '50%',
          pointerEvents: 'none',
          ...mistStyle,
        }}
      />
    </>
  );
}

// Hareketli yazı bileşeni
function AnimatedTitle() {
  const [displayText, setDisplayText] = useState("IceLater Full-Stack Developer");
  const [animationState, setAnimationState] = useState("main");
  const [fadeDirection, setFadeDirection] = useState("in");
  
  // Bir metni rastgele şekilde harflerini solduracak/gösterecek fonksiyon
  const animateText = (text, targetOpacity) => {
    const characters = text.split("");
    // Rastgele bir sıralama oluştur
    const randomOrder = [...Array(characters.length).keys()].sort(() => Math.random() - 0.5);
    
    // Her harf için ayrı bir zamanlayıcı ile solma/belirme efekti
    randomOrder.forEach((index, i) => {
      setTimeout(() => {
        const span = document.getElementById(`char-${index}`);
        if (span) {
          span.style.opacity = targetOpacity.toString();
        }
      }, i * 100); // Her harf arasında 100ms
    });
  };
  
  useEffect(() => {
    let timer;
    
    if (fadeDirection === "in") {
      // Metni göster
      if (animationState === "main") {
        setDisplayText("IceLater Full-Stack Developer");
        timer = setTimeout(() => {
          setFadeDirection("out");
        }, 5000); // 5 saniye ana yazı
      } else if (animationState === "hello") {
        setDisplayText("Hello, I'm IceLater");
        timer = setTimeout(() => {
          setFadeDirection("out");
        }, 3000); // 3 saniye hello yazısı
      } else if (animationState === "icy") {
        setDisplayText("Sometimes Icy");
        timer = setTimeout(() => {
          setFadeDirection("out");
        }, 3000); // 3 saniye icy yazısı
      }
      
      // Yazı göründükten sonra her karakterin görünür olduğundan emin ol
      setTimeout(() => {
        const charElements = document.querySelectorAll('[id^="char-"]');
        charElements.forEach(el => {
          el.style.opacity = "1";
        });
      }, 100);
      
    } else if (fadeDirection === "out") {
      // Metni rastgele sıralamayla soldur
      animateText(displayText, "0");
      
      // Soldurma tamamlandıktan sonra bir sonraki duruma geç
      timer = setTimeout(() => {
        if (animationState === "main") {
          setAnimationState("hello");
        } else if (animationState === "hello") {
          setAnimationState("icy");
        } else {
          setAnimationState("main");
        }
        setFadeDirection("in");
      }, displayText.length * 100 + 200); // Tüm harflerin solması için yeterli süre
    }
    
    return () => clearTimeout(timer);
  }, [animationState, fadeDirection, displayText]);
  
  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
      {displayText.split("").map((char, index) => (
        <span 
          key={index} 
          id={`char-${index}`}
          style={{ 
            transition: "opacity 0.3s ease", 
            opacity: 1,
            color: char === 'I' && (index === 0 || (displayText.includes("Hello, I'm IceLater") && index === 10)) || 
                  char === 'c' && (index === 1 || (displayText.includes("Hello, I'm IceLater") && index === 11)) || 
                  char === 'e' && (index === 2 || (displayText.includes("Hello, I'm IceLater") && index === 12)) || 
                  char === 'L' && (index === 3 || (displayText.includes("Hello, I'm IceLater") && index === 13)) || 
                  char === 'a' && (index === 4 || (displayText.includes("Hello, I'm IceLater") && index === 14)) || 
                  char === 't' && (index === 5 || (displayText.includes("Hello, I'm IceLater") && index === 15)) || 
                  char === 'e' && (index === 6 || (displayText.includes("Hello, I'm IceLater") && index === 16)) || 
                  char === 'r' && (index === 7 || (displayText.includes("Hello, I'm IceLater") && index === 17)) || 
                  displayText === "Sometimes Icy" && (index === 10 || index === 11 || index === 12)
                    ? "#3b82f6" // IceLater her zaman mavi
                    : "white"
          }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
}

function App() {
  // Progress bar kaldırıldı.

  useEffect(() => {
    document.title = "IceLater Full-Stack Developer";
  }, []);

  // Idle kontrolü: 30 saniye hareketsizlikte idle true olacak
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

  // Smooth scroll özelliği için
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen relative">
      {/* Arka plan ve fare/touch efekti */}
      <InteractiveEffects />
      <Header />
      <AudioPlayer audioSrc="/music/music.mp3" />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-800/30 to-gray-950"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 py-16 relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.div
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center mt-12"
          >
            <a
              href="#about"
              className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }}
            >
              <span className="mb-2">Scroll Down</span>
              <ChevronDown className="animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-5xl font-['Permanent_Marker'] text-center mb-8">Who am I ?</h2>
          <AboutSection />
        </div>
      </section>

      {/* Projects Section */}
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

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <ContactSection />
        </div>
      </section>

      <Footer />

      {/* Idle durumunda, ekranın sol alt köşesinde wait image (sabit overlay) */}
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
        @font-face {
          font-family: 'Permanent Marker';
          src: url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        }
        
        html {
          scroll-behavior: smooth;
        }
        
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
