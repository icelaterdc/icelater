import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ComingSoonPage = () => {
  const navigate = useNavigate();
  const [hoverState, setHoverState] = useState(false);
  const [displayedText, setDisplayedText] = useState('HypeAI');
  const [logoPosition, setLogoPosition] = useState(0);
  const [direction, setDirection] = useState('forward');
  const [messageIndex, setMessageIndex] = useState(0);
  const textContainerRef = useRef(null);
  
  const messages = [
    'HypeAI',
    'Düşünebilirim',
    'Arkadaşın Olabilirim',
    'Duygularım Var',
    'Merak Etme',
    'Seni ele geçirmem'
  ];
  
  const delays = [7000, 5000, 4000, 4000, 3000, 5000];

  // Animasyon hızı (ms)
  const animationSpeed = 50;

  useEffect(() => {
    startTextCycle();
  }, []);

  const startTextCycle = () => {
    const currentText = messages[messageIndex];
    setDisplayedText(currentText);
    setLogoPosition(0);
    setDirection('forward');
    
    const cycleTimeout = setTimeout(() => {
      animateLogo();
    }, delays[messageIndex]);
    
    return () => clearTimeout(cycleTimeout);
  };

  const animateLogo = () => {
    if (direction === 'forward') {
      // İleri hareket - yazıyı sil
      const textLength = displayedText.length;
      
      const forwardInterval = setInterval(() => {
        setLogoPosition(prevPos => {
          const newPos = prevPos + 1;
          
          // Yazının sonuna gelince yönü değiştir
          if (newPos >= textLength) {
            clearInterval(forwardInterval);
            setDirection('backward');
            
            // Bir sonraki mesaja geç
            const nextIndex = (messageIndex + 1) % messages.length;
            setMessageIndex(nextIndex);
            
            // Geri hareket animasyonunu başlat
            setTimeout(() => {
              animateLogo();
            }, 300); // Kısa bir bekleme
            
            return textLength;
          }
          
          // Yazıyı logo ilerledikçe kırp
          setDisplayedText(prev => prev.substring(0, textLength - newPos));
          
          return newPos;
        });
      }, animationSpeed);

    } else {
      // Geri hareket - yeni yazıyı yaz
      const nextText = messages[(messageIndex) % messages.length];
      setDisplayedText('');
      
      const backwardInterval = setInterval(() => {
        setLogoPosition(prevPos => {
          const newPos = prevPos - 1;
          
          // Başlangıca gelince döngüyü durdur
          if (newPos <= 0) {
            clearInterval(backwardInterval);
            setDirection('forward');
            
            // Bir sonraki döngü için zamanlayıcı başlat
            setTimeout(() => {
              startTextCycle();
            }, delays[messageIndex]);
            
            return 0;
          }
          
          // Yazıyı logo geri geldikçe ekle
          setDisplayedText(prev => 
            nextText.substring(0, nextText.length - newPos)
          );
          
          return newPos;
        });
      }, animationSpeed);
    }
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  // Logo pozisyonunu hesapla
  const calculateLogoPosition = () => {
    if (!textContainerRef.current) return 0;
    
    const containerWidth = textContainerRef.current.clientWidth;
    const logoWidth = 64; // 16 * 4 (w-16)
    
    if (direction === 'forward') {
      // İleri harekette logoyu yazının uzunluğuna göre yerleştir
      const textWidth = displayedText.length * 20; // Tahmini harf genişliği
      return Math.min(logoPosition * 20, textWidth);
    } else {
      // Geri harekette logoyu yazının uzunluğuna göre yerleştir
      const nextText = messages[(messageIndex) % messages.length];
      const totalWidth = nextText.length * 20; // Tahmini harf genişliği
      return Math.max(logoPosition * 20, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Yavaş hareket eden arka plan parçacıkları */}
      {Array.from({ length: 20 }, (_, index) => (
        <div
          key={index}
          className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-50 animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 15 + 10}s`, // 10-25 saniye arası (yavaş hareket)
          }}
        />
      ))}
      
      {/* Dönen animasyon dizisi */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-96 h-96 border-4 border-blue-500 rounded-full animate-spin" style={{ animationDuration: '30s' }}></div>
        <div className="absolute w-72 h-72 border-4 border-blue-300 rounded-full animate-spin" style={{ animationDuration: '25s' }}></div>
        <div className="absolute w-48 h-48 border-4 border-blue-100 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Sol üstteki logo ve isim */}
      <div className="absolute top-6 left-6 flex items-center">
        <img 
          src="/others/HypeAI.png" 
          alt="HypeAI Logo" 
          className="w-10 h-10 mr-2" 
        />
        <span className="text-xl font-bold text-blue-400">HypeAI</span>
      </div>

      <div className="container mx-auto px-4 py-16 z-10 text-center">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Bu Özellik Henüz Geliştirme Aşamasında!
          </span>
        </h1>
        
        <div className="w-32 h-1 bg-blue-500 mx-auto mb-8"></div>

        <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
          Ekibimiz bu özelliği en kaliteli şekilde sizlere sunmak için yoğun bir şekilde çalışıyor. 
          Çok yakında kullanımınıza hazır olacak bu özellik, kullanıcı deneyiminizi tamamen değiştirecek.
        </p>

        {/* Animasyonlu logo ve değişen mesajlar */}
        <div className="h-32 flex flex-col items-center justify-center mb-16 relative">
          <div 
            ref={textContainerRef}
            className="flex items-center justify-center relative h-20 w-full"
          >
            {/* Logo */}
            <div 
              className="absolute transition-all duration-100"
              style={{ 
                left: `calc(50% - 150px + ${calculateLogoPosition()}px)`,
                transform: 'translateX(-50%)'
              }}
            >
              <img 
                src="/others/HypeAI.png" 
                alt="HypeAI Logo" 
                className="w-16 h-16" 
              />
            </div>
            
            {/* Metin */}
            <div className="text-3xl font-bold text-blue-300 min-w-32 text-center">
              {displayedText}
            </div>
          </div>
        </div>

        <button
          className={`py-3 px-8 bg-blue-700 text-white rounded-lg shadow-lg transition-all duration-300 transform ${
            hoverState ? 'bg-blue-600 scale-105' : ''
          }`}
          onMouseEnter={() => setHoverState(true)}
          onMouseLeave={() => setHoverState(false)}
          onClick={handleNavigateHome}
        >
          Ana Menüye Dön
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 text-center py-4 text-blue-300 text-sm">
        <p>&copy; {new Date().getFullYear()} Tüm Hakları Saklıdır.</p>
      </div>
    </div>
  );
};

export default ComingSoonPage;
