import React from 'react';

const TuranFlagPage = () => {
  // Merkezi bayrak: Turan bayrağı URL'si
  const centralFlag = "https://upload.wikimedia.org/wikipedia/commons/3/37/Turan_flag.svg";
  
  // Dış bayraklar: 7 Türk devletinin bayrak URL'leri
  const outerFlags = [
    "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg",        // Türkiye
    "https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Azerbaijan.svg",     // Azerbaycan
    "https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kazakhstan.svg",     // Kazakistan
    "https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_Kyrgyzstan.svg",     // Kırgızistan
    "https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Turkmenistan.svg",  // Türkmenistan
    "https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Uzbekistan.svg",    // Özbekistan
    "https://upload.wikimedia.org/wikipedia/commons/5/5e/Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg" // Kuzey Kıbrıs
  ];

  return (
    <div className="page-container">
      <style jsx>{`
        /* Genel Sayfa Ayarları */
        .page-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: radial-gradient(circle at center, #0f2027, #203a43, #2c5364);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Ana Wrapper: Merkezi içerik için konumlandırma */
        .main-wrapper {
          position: relative;
          width: 90vw;
          height: 90vh;
          max-width: 800px;
          max-height: 800px;
        }

        /* Merkezi Turan Bayrağı Stili */
        .central-flag {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 280px;
          height: 280px;
          border-radius: 50%;
          border: 6px solid #00e5ff; /* Neon açık mavi */
          box-shadow: 0 0 25px 5px rgba(0, 229, 255, 0.7);
          background: #000;
          z-index: 10;
          transition: transform 0.5s ease, box-shadow 0.5s ease;
        }

        .central-flag img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        /* Dış Bayrakların Döndüğü Kapsayıcı */
        .rotating-container {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%);
          animation: rotateContainer 180s linear infinite;
        }

        /* Her Dış Bayrak İçin Ortak Stil */
        .outer-flag {
          position: absolute;
          top: 50%;
          left: 50%;
          /* Çember yarıçapı - tam ortalı olacak şekilde ayarlandı */
          transform: rotate(calc((360deg / 7) * var(--i))) translate(calc(min(40vw, 350px))) rotate(calc(-1 * (360deg / 7) * var(--i)));
          transition: transform 0.3s ease-in-out;
        }

        .outer-flag img {
          width: min(20vw, 160px);
          height: min(20vw, 160px);
          border-radius: 50%;
          border: 4px solid #00e5ff; /* Neon açık mavi */
          box-shadow: 0 0 20px 3px rgba(0, 229, 255, 0.6);
          object-fit: cover;
          transition: transform 0.5s ease, box-shadow 0.5s ease;
        }

        /* Dönen Kapsayıcı Animasyonu */
        @keyframes rotateContainer {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* Hover Efektleri */
        .outer-flag:hover {
          transform: rotate(calc((360deg / 7) * var(--i))) translate(calc(min(40vw, 350px))) rotate(calc(-1 * (360deg / 7) * var(--i))) scale(1.1);
        }

        .central-flag:hover {
          transform: translate(-50%, -50%) scale(1.05);
        }

        /* Responsive Ayarlar */
        @media (max-width: 768px) {
          .main-wrapper {
            width: 100%;
            height: 100%;
          }
          
          .central-flag {
            width: min(50vw, 200px);
            height: min(50vw, 200px);
          }
          
          .outer-flag {
            transform: rotate(calc((360deg / 7) * var(--i))) translate(calc(min(35vw, 250px))) rotate(calc(-1 * (360deg / 7) * var(--i)));
          }
          
          .outer-flag img {
            width: min(15vw, 100px);
            height: min(15vw, 100px);
          }
        }

        /* Extra small devices */
        @media (max-width: 480px) {
          .central-flag {
            width: 120px;
            height: 120px;
          }
          
          .outer-flag {
            transform: rotate(calc((360deg / 7) * var(--i))) translate(170px) rotate(calc(-1 * (360deg / 7) * var(--i)));
          }
          
          .outer-flag img {
            width: 70px;
            height: 70px;
          }
        }

        /* Tasarım bitişi */
      `}</style>

      <div className="main-wrapper">
        {/* Merkezi Turan Bayrağı */}
        <div className="central-flag">
          <img src={centralFlag} alt="Turan Bayrağı" />
        </div>
        
        {/* Dış Bayraklar: 7 Türk Devleti Bayrağı */}
        <div className="rotating-container">
          {outerFlags.map((flagUrl, index) => (
            <div className="outer-flag" key={index} style={{ '--i': index }}>
              <img src={flagUrl} alt={`Türk Devleti Bayrağı ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TuranFlagPage;
