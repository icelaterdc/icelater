import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import DiscordCard from './components/DiscordCard';
import GitHubRepos from './components/GitHubRepos';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';

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
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleTouchMove = (e) => {
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
  const [visibleChars, setVisibleChars] = useState([]);
  
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
  
  // IceLater kontrolü
  const getCharColor = (char, index, text) => {
    if (text === "IceLater Full-Stack Developer") {
      // IceLater tamamen mavi (0-7 indeksleri)
      if (index >= 0 && index <= 7) {
        return "#3b82f6";
      }
    } else if (text === "Hello, I'm IceLater") {
      // "IceLater" tamamen mavi (10-17 indeksleri)
      if (index >= 10 && index <= 18) {
        return "#3b82f6";
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

// Bileşenlerin görünürlüğünü kontrol eden özel hook
function useElementVisibility(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
}

function App() {
  // Sayfa yükleme durumu için
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  
  // Kaydırma durumunu takip et
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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

  // Bölüm referansları
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  
  // Bileşenlerin görünürlüğünü izle
  const [projectsContentRef, projectsVisible] = useElementVisibility(0.1);
  const [contactContentRef, contactVisible] = useElementVisibility(0.1);

  // Kaydırma pozisyonuna göre opaklık hesapla
  const calculateHomeOpacity = () => {
    if (!homeRef.current) return 1;
    
    const homeRect = homeRef.current.getBoundingClientRect();
    const viewport = window.innerHeight;
    
    // Home bölümünün ekrandan çıkma oranını hesapla
    const visiblePortion = Math.min(viewport, Math.max(0, homeRect.bottom)) / viewport;
    
    // Home alanı ekrandan çıkarken kademeli olarak sönükleş
    return Math.max(0, Math.min(1, visiblePortion * 1.5));
  };
  
  const calculateAboutOpacity = () => {
    if (!aboutRef.current) return 0;
    
    const aboutRect = aboutRef.current.getBoundingClientRect();
    const viewport = window.innerHeight;
    
    // About bölümünün ekrana girme oranını hesapla
    const visibleTop = Math.max(0, viewport - aboutRect.top);
    const visiblePortion = Math.min(viewport, visibleTop) / viewport;
    
    // About alanı ekrana girerken kademeli olarak belir
    return Math.max(0, Math.min(1, visiblePortion * 1.5));
  };
  
  // Home ve About bölümlerinin opaklığını hesapla
  const homeOpacity = calculateHomeOpacity();
  const aboutOpacity = calculateAboutOpacity();

  return (
    <div className="bg-gray-950 text-white min-h-screen relative">
      {/* Arka plan ve fare/touch efekti */}
      <InteractiveEffects />
      <Header />
      <AudioPlayer audioSrc="/music/music.mp3" />

      {/* Hero Section */}
      <section 
        id="home" 
        ref={homeRef}
        className="min-h-screen flex items-center justify-center relative pt-20"
        style={{ 
          opacity: homeOpacity,
          transition: "opacity 0.5s ease"
        }}
      >
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
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        ref={aboutRef}
        className="py-20 bg-gray-950"
        style={{ 
          opacity: aboutOpacity,
          transition: "opacity 0.5s ease",
          position: "relative",
          zIndex: aboutOpacity > 0.5 ? 10 : 5
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-6xl font-permanent-marker text-center mb-10">Who am I ?</h2>
          <AboutSection />
        </div>
      </section>

      {/* Projects Section */}
      <section 
        id="projects" 
        ref={projectsRef}
        className="py-20 bg-gray-950/50"
      >
        <div 
          ref={projectsContentRef}
          className="container mx-auto px-4 md:px-6"
          style={{
            opacity: projectsVisible ? 1 : 0,
            transition: "opacity 0.8s ease"
          }}
        >
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
      <section 
        id="contact" 
        ref={contactRef}
        className="py-20 bg-gray-950"
      >
        <div 
          ref={contactContentRef}
          className="container mx-auto px-4 md:px-6"
          style={{
            opacity: contactVisible ? 1 : 0,
            transition: "opacity 0.8s ease"
          }}
        >
          <ContactSection />
        </div>
      </section>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        
        .font-permanent-marker {
          font-family: 'Permanent Marker', cursive;
        }
        
        /* Normal scroll behavior */
        html {
          scroll-behavior: auto;
        }
        
        /* Prevent any scroll animations */
        * {
          scroll-snap-align: none;
          scroll-snap-stop: normal;
        }
      `}</style>
    </div>
  );
}

export default App;
