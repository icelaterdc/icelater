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

  // Sis efekti: Daha yumuşak geçişli ve ortası daha parlak
  const mistStyle = {
    // Daha yumuşak geçişli ve ortası parlak olan gradyan, kenarları pürüzlü olacak şekilde
    background: 'radial-gradient(circle at center, rgba(10,130,255,0.20) 0%, rgba(10,130,255,0.08) 40%, rgba(10,130,255,0.04) 70%, rgba(10,130,255,0) 100%)',
    filter: 'blur(8px)',
    borderRadius: '70%', // Daha pürüzlü kenarlar için
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
          width: '85px', // Biraz daha büyük yapıldı
          height: '85px', // Biraz daha büyük yapıldı
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
  const [visibleChars, setVisibleChars] = useState<number[]>([]);
  
  // Bir metni rastgele şekilde harflerini belirtecek/solduracak fonksiyon
  const animateText = (text, isAppearing) => {
    if (isAppearing) {
      // Belirme animasyonu için tüm karakterleri önce gizle
      setVisibleChars([]);
      
      // Bir dizinin tüm indekslerini al
      const allIndices = [...Array(text.length).keys()];
      
      // Ana yazı için özel düzenleme (tüm karakterlerin aynı anda belirmesi için)
      if (text === "IceLater Full-Stack Developer") {
        // "IceLater" ve kalan kısmı için ayrı indeks grupları
        const iceIndices = allIndices.slice(0, 8); // "IceLater" için
        const restIndices = allIndices.slice(8);   // " Full-Stack Developer" için
        
        // Tüm IceLater harflerini aynı anda göster
        setTimeout(() => {
          setVisibleChars(prev => [...prev, ...iceIndices]);
        }, 150); // Biraz daha hızlı
        
        // Full-Stack Developer kısmını da aynı anda göster
        setTimeout(() => {
          setVisibleChars(prev => [...prev, ...restIndices]);
        }, 450); // Biraz daha hızlı
      } else {
        // Diğer metinler için rastgele sırayla harfleri belirt
        const randomOrder = [...allIndices].sort(() => Math.random() - 0.5);
        
        // Çok yavaş şekilde harfleri belirt
        randomOrder.forEach((index, i) => {
          setTimeout(() => {
            setVisibleChars(prev => [...prev, index]);
          }, 150 + i * 150); // Biraz daha hızlı geçişler
        });
      }
    } else {
      // Soldurma animasyonu için tüm karakterleri göster
      const allIndices = [...Array(text.length).keys()];
      setVisibleChars(allIndices);
      
      // Rastgele sırayla harfleri soldur
      const randomOrder = [...allIndices].sort(() => Math.random() - 0.5);
      randomOrder.forEach((index, i) => {
        setTimeout(() => {
          setVisibleChars(prev => prev.filter(idx => idx !== index));
        }, i * 100); // Biraz daha hızlı solma
      });
    }
  };
  
  useEffect(() => {
    let timer;
    
    if (fadeDirection === "in") {
      // Metni göster
      if (animationState === "main") {
        setDisplayText("IceLater Full-Stack Developer");
        animateText("IceLater Full-Stack Developer", true);
        timer = setTimeout(() => {
          setFadeDirection("out");
        }, 7000); // 7 saniye ana yazı (biraz daha hızlı)
      } else if (animationState === "hello") {
        setDisplayText("Hello, I'm IceLater");
        animateText("Hello, I'm IceLater", true);
        timer = setTimeout(() => {
          setFadeDirection("out");
        }, 4500); // 4.5 saniye hello yazısı (biraz daha hızlı)
      } else if (animationState === "icy") {
        setDisplayText("Sometimes Icy");
        animateText("Sometimes Icy", true);
        timer = setTimeout(() => {
          setFadeDirection("out");
        }, 4500); // 4.5 saniye icy yazısı (biraz daha hızlı)
      }
    } else if (fadeDirection === "out") {
      // Metni soldur
      animateText(displayText, false);
      
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
      }, displayText.length * 100 + 300); // Tüm harflerin solması için yeterli süre (biraz daha hızlı)
    }
    
    return () => clearTimeout(timer);
  }, [animationState, fadeDirection]);
  
  // IceLater kontrolü - "Hello, I'm IceLater" için r harfi mavi olacak
  const getCharColor = (char: string, index: number, text: string) => {
    if (text === "IceLater Full-Stack Developer") {
      // IceLater tamamen mavi (0-7 indeksleri)
      if (index >= 0 && index <= 7) {
        return "#3b82f6";
      }
    } else if (text === "Hello, I'm IceLater") {
      // IceLater tamamen mavi (10-17 indeksleri)
      if (index >= 10 && index <= 17) {
        // "r" mavi, "o" beyaz olacak şekilde
        if (index === 14) { // r harfi
          return "#3b82f6";
        } else if (index === 15) { // o harfi
          return "white";
        } else {
          return "#3b82f6";
        }
      }
    } else if (text === "Sometimes Icy") {
      // Icy tamamen mavi (10-12 indeksleri)
      if (index >= 10 && index <= 12) {
        return "#3b82f6";
      }
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
            color: getCharColor(char, index, displayText)
          }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
}

function App() {
  // Sayfa yükleme durumu için
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    document.title = "IceLater Full-Stack Developer";
    
    // Scrollbar rengini değiştirmek için stil ekleme
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
    `;
    document.head.appendChild(style);
    
    // Sayfa yükleme durumunu simüle et
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => {
      document.head.removeChild(style);
    };
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

  // Scroll down butonu için smooth scroll özelliği
  const handleScrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
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
              onClick={handleScrollToAbout}
            >
              <span className="mb-2">Scroll Down</span>
              <ChevronDown className="animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Boşluk bölümü - Snap kaydırma için */}
      <div className="spacer-section h-48 bg-gradient-to-b from-gray-950 to-gray-950"></div>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-6xl font-permanent-marker text-center mb-10">Who am I ?</h2>
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
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        
        .font-permanent-marker {
          font-family: 'Permanent Marker', cursive;
        }
        
        /* Sadece belirli bölgeler için snap scrolling ayarları */
        .spacer-section {
          scroll-snap-align: start;
        }
        
        #home {
          scroll-snap-align: start;
        }
        
        #about {
          scroll-snap-align: start;
        }
        
        /* Sayfa kaydırma davranışını düzenle */
        html {
          scroll-behavior: smooth;
          scroll-snap-type: y mandatory;
        }
        
        /* Özel kaydırma davranışı */
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
      `}</style>

      {/* Özel kaydırma davranışı için JavaScript */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            let lastScrollTop = 0;
            let isScrollingToSection = false;
            let scrollTimeout;
            
            // Threshold değerleri - daha düşük değerler kaydırmayı daha hassas yapar
            const scrollThreshold = 10;
            
            window.addEventListener('scroll', function() {
              const currentScroll = window.scrollY || document.documentElement.scrollTop;
              const homeSection = document.getElementById('home');
              const aboutSection = document.getElementById('about');
              const spacerSection = document.querySelector('.spacer-section');
              
              if (!homeSection || !aboutSection || !spacerSection || isScrollingToSection) return;
              
              const homeSectionBottom = homeSection.getBoundingClientRect().bottom;
              const spacerSectionTop = spacerSection.getBoundingClientRect().top;
              const spacerSectionBottom = spacerSection.getBoundingClientRect().bottom;
              const aboutSectionTop = aboutSection.getBoundingClientRect().top;
              
              // Eğer spacer bölümü veya yakınlarında isek ve kaydırma yapılıyorsa
              if ((spacerSectionTop <= 200 && aboutSectionTop > -200) || 
                  (homeSectionBottom > -200 && homeSectionBottom < 200)) {
                
                clearTimeout(scrollTimeout);
                
                scrollTimeout = setTimeout(() => {
                  isScrollingToSection = true;
                  
                  // Aşağı kaydırılıyorsa about bölümüne git
                  if (currentScroll > lastScrollTop + scrollThreshold) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                  } 
                  // Yukarı kaydırılıyorsa home bölümüne git
                  else if (currentScroll < lastScrollTop - scrollThreshold) {
                    homeSection.scrollIntoView({ behavior: 'smooth' });
                  }
                  
                  // Animasyon bitiminde flag'i sıfırla
                  setTimeout(() => {
                    isScrollingToSection = false;
                  }, 1000);
                }, 5); // Daha hassas kaydırma için timeout değeri azaltıldı
              }
              
              lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            }, { passive: true });
            
            // Dokunmatik cihazlar için özel kaydırma desteği
            let touchStartY = 0;
            let touchEndY = 0;
            const touchThreshold = 50; // Kaydırma için eşik değeri
            
            document.addEventListener('touchstart', function(e) {
              touchStartY = e.touches[0].clientY;
            }, { passive: true });
            
            document.addEventListener('touchend', function(e) {
              touchEndY = e.changedTouches[0].clientY;
              
              const homeSection = document.getElementById('home');
              const aboutSection = document.getElementById('about');
              const spacerSection = document.querySelector('.spacer-section');
              
              if (!homeSection || !aboutSection || !spacerSection || isScrollingToSection) return;
              
              const spacerSectionTop = spacerSection.getBoundingClientRect().top;
              const spacerSectionBottom = spacerSection.getBoundingClientRect().bottom;
              const aboutSectionTop = aboutSection.getBoundingClientRect().top;
              
              // Eğer spacer bölümü veya yakınlarında isek
              if ((spacerSectionTop <= 200 && aboutSectionTop > -200) || 
                  (spacerSectionTop <= 0 && spacerSectionBottom >= 0)) {
                
                isScrollingToSection = true;
                
                // Yukarıdan aşağıya kaydırma (about bölümüne)
                if (touchStartY > touchEndY && Math.abs(touchStartY - touchEndY) > touchThreshold) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
                // Aşağıdan yukarıya kaydırma (home bölümüne)
                else if (touchStartY < touchEndY && Math.abs(touchStartY - touchEndY) > touchThreshold) {
                  homeSection.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Animasyon bitiminde flag'i sıfırla
                setTimeout(() => {
                  isScrollingToSection = false;
                }, 1000);
              }
            }, { passive: true });
          });
        `
      }} />
    </div>
  );
}

export default App;
