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

// Yeni: InteractiveEffects bileşeni
function InteractiveEffects() {
  // Fare pozisyonu (neon ışık)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // Fare basılı mı?
  const [isDragging, setIsDragging] = useState(false);
  // Sürükleme izleri (tek tek halkacıklar)
  const [trails, setTrails] = useState([]);
  // Tıklama efektleri
  const [clickEffects, setClickEffects] = useState([]);
  // Çizim için sürekli nokta dizisi (free drawing)
  const [drawingPoints, setDrawingPoints] = useState([]);
  // Dummy state, çizimin opaklığının güncellenmesi için
  const [tick, setTick] = useState(0);

  const fadeDuration = 2000; // ms, çizgi ve izlerin solma süresi

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Eğer basılıysa (sürükleme veya çizim)
      if (isDragging) {
        // Sürükleme izleri için küçük daireler ekle
        const id = Date.now() + Math.random();
        const newTrail = { id, x: e.clientX, y: e.clientY };
        setTrails((prev) => [...prev, newTrail]);
        // 2 saniye sonra iz otomatik silinsin
        setTimeout(() => {
          setTrails((prev) => prev.filter((trail) => trail.id !== id));
        }, 2000);

        // Aynı anda free drawing için nokta kaydı
        setDrawingPoints((prev) => [...prev, { x: e.clientX, y: e.clientY, t: Date.now() }]);
      }
    };

    const handleMouseDown = (e) => {
      setIsDragging(true);
      // Yeni çizime başlamak için mevcut free drawing dizisini temizle
      setDrawingPoints([{ x: e.clientX, y: e.clientY, t: Date.now() }]);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Fare bırakıldıktan sonra çizim noktaları solmaya devam edecek;
      // burada temizleme işlemi de yapılabilir, ancak opaklık hesaplaması yeterli.
    };

    const handleClick = (e) => {
      // Eğer tıklama, sürüklemenin bir parçası değilse (fare basılı değilse)
      if (!isDragging) {
        const id = Date.now() + Math.random();
        const newClickEffect = { id, x: e.clientX, y: e.clientY };
        setClickEffects((prev) => [...prev, newClickEffect]);
        // 1 saniye sonra tıklama efekti silinsin
        setTimeout(() => {
          setClickEffects((prev) => prev.filter((ce) => ce.id !== id));
        }, 1000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleClick);
    };
  }, [isDragging]);

  // Dummy tick her 50ms de bir güncellenecek, böylece çizim opaklıkları yeniden hesaplanır
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Neon fare işaretçisi */}
      <div
        style={{
          position: 'fixed',
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          pointerEvents: 'none',
          boxShadow: '0 0 8px 4px rgba(0,123,255,0.6)',
        }}
      />

      {/* Sürükleme izleri: Küçük daireler, fadeOut animasyonu */}
      {trails.map((trail) => (
        <div
          key={trail.id}
          style={{
            position: 'fixed',
            left: trail.x,
            top: trail.y,
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            pointerEvents: 'none',
            backgroundColor: 'rgba(0,123,255,0.5)',
            animation: 'fadeOut 2s forwards',
          }}
        />
      ))}

      {/* Tıklama efekti */}
      {clickEffects.map((ce) => (
        <div
          key={ce.id}
          style={{
            position: 'fixed',
            left: ce.x,
            top: ce.y,
            transform: 'translate(-50%, -50%)',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            pointerEvents: 'none',
            backgroundColor: 'rgba(0,123,255,0.4)',
            animation: 'fadeOut 1s forwards',
          }}
        />
      ))}

      {/* Free drawing: Kullanıcı fare basılıyken çizdiği noktaları SVG ile birleştiriyoruz.
          Çizginin ilk kısımları (daha eski noktalar) zamanla daha soluk görünecek */}
      {drawingPoints.length > 1 && (
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
          {drawingPoints.map((point, index) => {
            if (index < drawingPoints.length - 1) {
              const nextPoint = drawingPoints[index + 1];
              // Her segment için opaklık, o segmentin başlangıç zamanına göre hesaplanır
              const elapsed = Date.now() - point.t;
              const opacity = Math.max(0, 1 - elapsed / fadeDuration);
              return (
                <line
                  key={index}
                  x1={point.x}
                  y1={point.y}
                  x2={nextPoint.x}
                  y2={nextPoint.y}
                  stroke={`rgba(0,123,255,${opacity})`}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              );
            }
            return null;
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
      {/* Arka plan ve mouse etkileşimleri için overlay */}
      <InteractiveEffects />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
        style={{ scaleX }}
      />

      <Header />

      {/* Audio Player: Sağ altta yer alan buton üzerinden müzik kontrolü */}
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
