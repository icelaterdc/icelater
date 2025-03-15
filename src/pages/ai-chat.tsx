import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

const ComingSoonPage = () => {
  const navigate = useNavigate();
  const [hoverState, setHoverState] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [animationState, setAnimationState] = useState('initial'); // initial, moveOut, moveIn
  
  const messages = [
    'Düşünebilirim',
    'Arkadaşın Olabilirim',
    'Duygularım Var',
    'Merak Etme',
    'Seni ele geçirmem'
  ];
  
  const delays = [7000, 5000, 4000, 4000, 3000];

  useEffect(() => {
    // İlk mesajı başlat
    const initialTimeout = setTimeout(() => {
      startAnimation();
    }, 7000);

    return () => clearTimeout(initialTimeout);
  }, []);

  const startAnimation = () => {
    // Logo sağa hareket edip yazıyı siler
    setAnimationState('moveOut');
    
    setTimeout(() => {
      // Yeni mesajı ayarla
      setCurrentMessage(messages[messageIndex]);
      
      // Logo geri gelir ve yeni mesajı gösterir
      setAnimationState('moveIn');
      
      // Bir sonraki mesaj için zamanlayıcı
      const nextTimeout = setTimeout(() => {
        // Bir sonraki mesaja geç veya başa dön
        const nextIndex = (messageIndex + 1) % messages.length;
        setMessageIndex(nextIndex);
        
        // Animasyonu yeniden başlat
        startAnimation();
      }, delays[messageIndex]);
      
      return () => clearTimeout(nextTimeout);
    }, 1000); // Logo dışarı çıktıktan sonra 1 saniye bekle
  };

  const handleNavigateHome = () => {
    navigate('/');
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
            className={`flex items-center transition-all duration-1000 transform ${
              animationState === 'moveOut' ? 'translate-x-96 opacity-0' : 
              animationState === 'moveIn' ? 'translate-x-0 opacity-100' : 
              'translate-x-0 opacity-100'
            }`}
          >
            <img 
              src="/others/HypeAI.png" 
              alt="HypeAI Logo" 
              className="w-16 h-16 mr-3" 
            />
            <span className="text-3xl font-bold text-blue-300">
              {animationState === 'initial' ? 'HypeAI' : currentMessage}
            </span>
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
