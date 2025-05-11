import React from 'react';

const TuranFlagPage = () => {
  const centralFlag = "https://upload.wikimedia.org/wikipedia/commons/3/37/Turan_flag.svg";
  
  const outerFlags = [
    "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg",        
    "https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Azerbaijan.svg",     
    "https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kazakhstan.svg",     
    "https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_Kyrgyzstan.svg",     
    "https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Turkmenistan.svg",   
    "https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Uzbekistan.svg",     
    "https://upload.wikimedia.org/wikipedia/commons/5/5e/Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg" 
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
          width: 600px;
          height: 600px;
        }

        /* Merkezi Turan Bayrağı Stili */
        .central-flag {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 250px;
          height: 250px;
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
          width: 600px;
          height: 600px;
          transform: translate(-50%, -50%);
          animation: rotateContainer 180s linear infinite;
        }

        /* Her Dış Bayrak İçin Ortak Stil */
        .outer-flag {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 150px;
          height: 150px;
          margin-top: -75px;
          margin-left: -75px;
          /* Çember yarıçapını 300px yerine 280px yaptık */
          transform: rotate(calc((360deg / 7) * var(--i))) translateX(280px);
          transition: transform 0.3s ease-in-out;
        }

        .outer-flag img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          /* Kenarlık 4px → 2px olarak inceltildi */
          border: 2px solid #00e5ff; 
          /* Box-shadow biraz hafifletildi */
          box-shadow: 0 0 10px 2px rgba(0, 229, 255, 0.6);
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
          transform: rotate(calc((360deg / 7) * var(--i))) translateX(280px) scale(1.1);
        }

        .central-flag:hover {
          transform: translate(-50%, -50%) scale(1.05);
        }

        /* Neon Detayları: Bayrakların Öncesi Dekoratif Çember */
        .outer-flag:before {
          content: '';
          position: absolute;
          /* Genişlik/ yükseklik 170px → 160px,
             top/left -10px → -5px, kenarlık 2px → 1px */
          top: -5px;
          left: -5px;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          border: 1px solid rgba(0, 229, 255, 0.4);
          /* Biraz daha hafif bir parlama */
          box-shadow: 0 0 10px 3px rgba(0, 229, 255, 0.3);
          z-index: -1;
        }

        /* Responsive Ayarlar (900px ve altı) */
        @media (max-width: 900px) {
          .main-wrapper {
            width: 500px;
            height: 500px;
          }
          .central-flag {
            width: 200px;
            height: 200px;
          }
          .rotating-container {
            width: 500px;
            height: 500px;
          }
          .outer-flag {
            width: 120px;
            height: 120px;
            margin-top: -60px;
            margin-left: -60px;
            /* 220px yerine 200px'e çekildi, biraz daha yakın */
            transform: rotate(calc((360deg / 7) * var(--i))) translateX(200px);
          }
          .outer-flag:hover {
            transform: rotate(calc((360deg / 7) * var(--i))) translateX(200px) scale(1.1);
          }
          .outer-flag:before {
            /* Küçülen bayrak boyutuna orantılı: 120 + 10 = 130 → 125 */
            top: -5px;
            left: -5px;
            width: 130px;
            height: 130px;
          }
        }

        /* Ekstra Neon Glow ve Pulsasyon Efektleri */
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Dekoratif Çizgiler ve Hareket Efektleri */
        .decorative-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, transparent, #00e5ff, transparent);
          top: 10%;
          opacity: 0.3;
          animation: slideLine 4s linear infinite;
        }

        @keyframes slideLine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .decorative-line.second {
          top: 90%;
          animation-duration: 6s;
        }

        /* İçerik Wrapper: Merkezi elemanların hizalanması */
        .content-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* Ek Sparkle Efektleri */
        .sparkle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #00e5ff;
          border-radius: 50%;
          box-shadow: 0 0 15px 5px rgba(0, 229, 255, 0.5);
          animation: sparkleAnim 2s infinite;
        }

        @keyframes sparkleAnim {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.5); opacity: 0; }
        }

        .sparkle.one   { top: 20%; left: 25%; }
        .sparkle.two   { top: 40%; left: 70%; }
        .sparkle.three { top: 65%; left: 50%; }
        .sparkle.four  { top: 80%; left: 30%; }

        /* İlave gölge ve geçiş efektleri */
        .central-flag,
        .outer-flag img {
          filter: brightness(1.05);
        }

        .central-flag img,
        .outer-flag img {
          transition: transform 0.5s ease, box-shadow 0.5s ease, filter 0.5s ease;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #0f2027;
        }

        .decorative-line.three {
          top: 50%;
          animation-duration: 5s;
        }

        .outer-flag:hover img {
          transform: scale(1.08);
        }

        /* Daha küçük cihazlar için ek medya sorguları */
        @media (max-width: 767px) {
          .main-wrapper {
            width: 100vmin;
            height: 100vmin;
            max-width: 500px;
            max-height: 500px;
          }
          .central-flag {
            width: 30vmin;
            height: 30vmin;
            max-width: 180px;
            max-height: 180px;
          }
          .rotating-container {
            width: 100vmin;
            height: 100vmin;
            max-width: 500px;
            max-height: 500px;
          }
          .outer-flag {
            width: 15vmin;
            height: 15vmin;
            max-width: 100px;
            max-height: 100px;
            margin-top: calc(-1 * (15vmin / 2));
            margin-left: calc(-1 * (15vmin / 2));
            transform: rotate(calc((360deg / 7) * var(--i))) translateX(38vmin);
          }
          .outer-flag:hover {
            transform: rotate(calc((360deg / 7) * var(--i))) translateX(38vmin) scale(1.1);
          }
          .outer-flag:before {
            top: -4px;
            left: -4px;
            width: calc(15vmin + 8px);
            height: calc(15vmin + 8px);
          }
        }

        @media (max-width: 480px) {
          .main-wrapper {
            width: 90vmin;
            height: 90vmin;
          }
          .central-flag {
            width: 30vmin;
            height: 30vmin;
          }
          .outer-flag {
            width: 12vmin;
            height: 12vmin;
            margin-top: calc(-1 * (12vmin / 2));
            margin-left: calc(-1 * (12vmin / 2));
            transform: rotate(calc((360deg / 7) * var(--i))) translateX(34vmin);
          }
          .outer-flag:hover {
            transform: rotate(calc((360deg / 7) * var(--i))) translateX(34vmin) scale(1.1);
          }
          .outer-flag:before {
            top: -3px;
            left: -3px;
            width: calc(12vmin + 6px);
            height: calc(12vmin + 6px);
          }
        }
      `}</style>

      {/* Dekoratif Çizgiler */}
      <div className="decorative-line"></div>
      <div className="decorative-line second"></div>
      <div className="decorative-line three"></div>

      <div className="content-wrapper">
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

        {/* Sparkle Efektleri */}
        <div className="sparkle one"></div>
        <div className="sparkle two"></div>
        <div className="sparkle three"></div>
        <div className="sparkle four"></div>
      </div>
    </div>
  );
};

export default TuranFlagPage;
