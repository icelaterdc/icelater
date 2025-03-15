import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Cpu, Code, Rocket, RefreshCw } from 'lucide-react';

const ComingSoonPage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hoverState, setHoverState] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        if (newProgress >= 75) {
          clearInterval(interval);
          setAnimationComplete(true);
          return 75;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleNavigateHome = () => {
    navigate('/');
  };

  const getRandomDelay = () => {
    return Math.random() * 6 + 's';
  };

  const particleElements = Array.from({ length: 20 }, (_, index) => (
    <div
      key={index}
      className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-50 animate-pulse"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: getRandomDelay(),
        animationDuration: `${Math.random() * 8 + 2}s`,
      }}
    />
  ));

  const getProgressColor = () => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animasyonlu arka plan parçacıkları */}
      {particleElements}
      
      {/* Dönen animasyon dizisi */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-96 h-96 border-4 border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute w-72 h-72 border-4 border-blue-300 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute w-48 h-48 border-4 border-blue-100 rounded-full animate-spin" style={{ animationDuration: '12s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-16 z-10 text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full opacity-50"></div>
          </div>
        </div>
        
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

        <div className="max-w-xl mx-auto mb-12">
          <div className="flex items-center mb-2">
            <span className="text-sm text-blue-300">Geliştirme Durumu: %{progress}</span>
            <span className="ml-auto text-sm text-blue-300">%75 (Hedef)</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full ${getProgressColor()} transition-all duration-300 ease-out rounded-full`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-16">
          <div className="bg-blue-900 bg-opacity-30 rounded-lg p-6 w-64 backdrop-blur-sm">
            <Cpu className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Gelişmiş Teknoloji</h3>
            <p className="text-blue-200 text-sm">En son teknolojileri kullanarak geliştirilen bu özellik, performans ve kullanıcı deneyimini optimize eder.</p>
          </div>
          <div className="bg-blue-900 bg-opacity-30 rounded-lg p-6 w-64 backdrop-blur-sm">
            <Code className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Temiz Kod</h3>
            <p className="text-blue-200 text-sm">Uzman geliştiricilerimiz tarafından yazılan sağlam ve ölçeklenebilir kod yapısı.</p>
          </div>
          <div className="bg-blue-900 bg-opacity-30 rounded-lg p-6 w-64 backdrop-blur-sm">
            <Rocket className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Yenilikçi Özellikler</h3>
            <p className="text-blue-200 text-sm">Sektördeki en yenilikçi özellikleri sizlere sunmak için çalışıyoruz.</p>
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
