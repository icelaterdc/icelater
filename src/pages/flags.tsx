import React from 'react';

/* 
  TuranFlagPage: Bu sayfa, merkezi Turan bayrağı ve etrafında dönen 7 Türk devletinin bayrağını içerir.
  Tasarım; neon açık mavi çerçeveler, detaylı hover efektleri, dekoratif animasyonlar ve responsive
  düzenlemeler ile yüksek kaliteli bir estetik sunar.
*/

const TuranFlagPage = () => {
  // Merkezi bayrak: Turan bayrağı URL'si (örnek URL)
  const centralFlag = "https://upload.wikimedia.org/wikipedia/commons/3/37/Turan_flag.svg";
  
  // Dış bayraklar: 7 Türk devletinin bayrak URL'leri
  const outerFlags = [
    "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg",        // Türkiye
    "https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Azerbaijan.svg",    // Azerbaycan
    "https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kazakhstan.svg",    // Kazakistan
    "https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_Kyrgyzstan.svg",    // Kırgızistan
    "https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Turkmenistan.svg",  // Türkmenistan
    "https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Uzbekistan.svg",    // Özbekistan
    "https://upload.wikimedia.org/wikipedia/commons/5/5e/Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg" // KKTC
  ];

  return (
    <div className="page-container">
      <style jsx>{`
        /* GENEL SAYFA AYARLARI */
        .page-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          background: radial-gradient(circle at center, #0f2027, #203a43, #2c5364);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* ANA WRAPPER
           - Hem desktop hem mobilde orantılı görünüm için
           - 90vmin ile ekranın en küçük boyutunun %90'ını kullanıyoruz
           - 600px'i geçmeyecek şekilde sınır koyuyoruz
        */
        .main-wrapper {
          position: relative;
          width: min(90vmin, 600px);
          height: min(90vmin, 600px);
        }

        /* MERKEZİ TURAN BAYRAĞI
           - vmin tabanlı boyut; max 250px ile sınırlı
        */
        .central-flag {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30vmin;
          height: 30vmin;
          max-width: 250px;
          max-height: 250px;
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

        /* DIŞ BAYRAKLARIN DÖNDÜĞÜ KAPSAYICI
           - Ana wrapper boyutunun tamamını kaplayacak
           - Sonsuz döngüyle dönüyor
        */
        .rotating-container {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%);
          animation: rotateContainer 180s linear infinite;
        }

        /* HER DIŞ BAYRAK İÇİN ORTAK STİL
           - vmin ile boyut, max 150px ile sınırlı
           - translateX(...) değeri de vmin tabanlı
        */
        .outer-flag {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12vmin;
          height: 12vmin;
          max-width: 150px;
          max-height: 150px;
          margin-top: calc(-1 * (12vmin / 2));
          margin-left: calc(-1 * (12vmin / 2));
          /* 32vmin uzaklıkta dairesel yay */
          transform: rotate(calc((360deg / 7) * var(--i))) translateX(32vmin);
          transition: transform 0.3s ease-in-out;
        }

        .outer-flag img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 4px solid #00e5ff; /* Neon açık mavi */
          box-shadow: 0 0 20px 3px rgba(0, 229, 255, 0.6);
          object-fit: cover;
          transition: transform 0.5s ease, box-shadow 0.5s ease, filter 0.5s ease;
          filter: brightness(1.05);
        }

        /* DÖNME ANİMASYONU */
        @keyframes rotateContainer {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* HOVER EFEKTLERİ */
        .central-flag:hover {
          transform: translate(-50%, -50%) scale(1.05);
        }

        .outer-flag:hover {
          transform: rotate(calc((360deg / 7) * var(--i))) translateX(32vmin) scale(1.1);
        }
        .outer-flag:hover img {
          transform: scale(1.08);
        }

        /* NEON DETAY: BAYRAKLARIN ÖNCESİNDE DEKORATİF ÇEMBER */
        .outer-flag:before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          width: calc(100% + 20px);
          height: calc(100% + 20px);
          border-radius: 50%;
          border: 2px solid rgba(0, 229, 255, 0.4);
          box-shadow: 0 0 15px 5px rgba(0, 229, 255, 0.3);
          z-index: -1;
        }

        /* DEKORATİF ÇİZGİLER */
        .decorative-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, transparent, #00e5ff, transparent);
          top: 10%;
          opacity: 0.3;
          animation: slideLine 4s linear infinite;
        }
        .decorative-line.second {
          top: 90%;
          animation-duration: 6s;
        }
        .decorative-line.three {
          top: 50%;
          animation-duration: 5s;
        }

        @keyframes slideLine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        /* SPARKLE EFEKTLERİ */
        .sparkle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #00e5ff;
          border-radius: 50%;
          box-shadow: 0 0 15px 5px rgba(0, 229, 255, 0.5);
          animation: sparkleAnim 2s infinite;
        }
        .sparkle.one   { top: 20%; left: 25%; }
        .sparkle.two   { top: 40%; left: 70%; }
        .sparkle.three { top: 65%; left: 50%; }
        .sparkle.four  { top: 80%; left: 30%; }

        @keyframes sparkleAnim {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.5); opacity: 0; }
        }

        /* EK PULSASYON EFEKTİ (Opsiyonel) */
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

        /* CONTENT WRAPPER */
        .content-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
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
              <div
                className="outer-flag"
                key={index}
                style={{ '--i': index }}
              >
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
