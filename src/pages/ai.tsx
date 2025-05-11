import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

const ComingSoonPage = () => {
  const navigate = useNavigate();
  const [hoverState, setHoverState] = useState(false);

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
            animationDuration: `${Math.random() * 15 + 10}s`, 
          }}
        />
      ))}

      {/* Dönen animasyon dizisi */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-96 h-96 border-4 border-blue-500 rounded-full animate-spin" style={{ animationDuration: '30s' }}></div>
        <div className="absolute w-72 h-72 border-4 border-blue-300 rounded-full animate-spin" style={{ animationDuration: '25s' }}></div>
        <div className="absolute w-48 h-48 border-4 border-blue-100 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Header: %75 opak arkaplan ile */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-gray-900 bg-opacity-75 py-4">
        <div className="container mx-auto px-4 flex items-center">
          <img 
            src="/others/HypeAI.png" 
            alt="HypeAI Logo" 
            className="w-10 h-10 mr-2" 
          />
          <span className="text-xl font-bold text-blue-400">HypeAI</span>
        </div>
      </header>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-16 z-10 text-center mt-16">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Özellik Henüz Geliştirme Aşamasında!
          </span>
        </h1>
        
        <div className="w-32 h-1 bg-blue-500 mx-auto mb-8"></div>

        <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
          Bu özellik henüz geliştirme aşamasında.
          Tamamlandıktan sonra ücretsiz şekilde yapay zeka özelliklerine erişim sağlayabileceksiniz.
        </p>

        {/* Sabit Logo ve HypeAI Yazısı */}
        <div className="h-32 flex flex-col items-center justify-center mb-16 relative">
          <div className="flex items-center">
            <img 
              src="/others/HypeAI.png" 
              alt="HypeAI Logo" 
              className="w-16 h-16 mr-3" 
            />
            <span className="text-3xl font-bold text-blue-300">HypeAI</span>
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
        <p>© {new Date().getFullYear()} Tüm Hakları Saklıdır.</p>
      </div>
    </div>
  );
};

export default ComingSoonPage;
