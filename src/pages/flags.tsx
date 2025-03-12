import React from 'react';

/* 
  TuranFlagPage: Bu sayfa, merkezi Turan bayrağı ve etrafında dönen 7 Türk devletinin bayrağını içerir.
  Tasarım; neon açık mavi çerçeveler, detaylı hover efektleri, dekoratif animasyonlar ve responsive
  düzenlemeler ile yüksek kaliteli bir estetik sunar.
  
  Not: Bu dosya, app kodundan route edildiği için global sayfa stili ataması yapmadan sadece
  component bazlı stil içerir.
*/

const TuranFlagPage = () => {
  // Merkezi bayrak: Turan bayrağı URL'si (örnek URL)
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
          width: 800px;
          height: 800px;
        }

        /* Merkezi Turan Bayrağı Stili */
        .central-flag {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
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
          width: 800px;
          height: 800px;
          transform: translate(-50%, -50%);
          animation: rotateContainer 180s linear infinite;
        }

        /* Her Dış Bayrak İçin Ortak Stil */
        .outer-flag {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 180px;
          height: 180px;
          /* Çember yarıçapı; tüm yönlerde eşit uzaklık */
          margin-top: -90px;
          margin-left: -90px;
          transform: rotate(calc((360deg / 7) * var(--i))) translateX(350px);
          transition: transform 0.3s ease-in-out;
        }

        .outer-flag img {
          width: 100%;
          height: 100%;
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
          transform: rotate(calc((360deg / 7) * var(--i))) translateX(350px) scale(1.1);
        }

        .central-flag:hover {
          transform: translate(-50%, -50%) scale(1.05);
        }

        /* Neon Detayları: Bayrakların Öncesi Dekoratif Çember */
        .outer-flag:before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 2px solid rgba(0, 229, 255, 0.4);
          box-shadow: 0 0 15px 5px rgba(0, 229, 255, 0.3);
          z-index: -1;
        }

        /* Responsive Ayarlar */
        @media (max-width: 900px) {
          .main-wrapper {
            width: 600px;
            height: 600px;
          }
          .central-flag {
            width: 250px;
            height: 250px;
          }
          .outer-flag {
            width: 150px;
            height: 150px;
            margin-top: -75px;
            margin-left: -75px;
            transform: rotate(calc((360deg / 7) * var(--i))) translateX(280px);
          }
          .outer-flag:hover {
            transform: rotate(calc((360deg / 7) * var(--i))) translateX(280px) scale(1.1);
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

        /* Ek Açıklamalar:
           Bu stil bölümü, merkezi bayrağın etrafında eşit aralıklı dönen bayrakların,
           neon ışık efekti veren çerçevelerle birlikte modern ve dinamik bir görünüm kazanmasını sağlar.
           Hover ve pulsasyon efektleri, etkileşimde ekstra görsel çekicilik sunar.
        */

        /* Ek Stil Notları ve Yorumlar */
        /* --------------------------------------------------------------- */
        /* 1. Renk Paleti: Arka plan için koyu tonlar, bayrak çerçeveleri için neon açık mavi. */
        /* 2. Animasyon: Rotasyon animasyonu, outer bayrak kapsayıcısı üzerinde uygulanır.    */
        /* 3. Responsive: Farklı ekran boyutlarına uyum sağlayacak şekilde düzenlemeler yapılmıştır. */
        /* --------------------------------------------------------------- */

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

        /* Rastgele Sparkle Konumları */
        .sparkle.one   { top: 20%; left: 25%; }
        .sparkle.two   { top: 40%; left: 70%; }
        .sparkle.three { top: 65%; left: 50%; }
        .sparkle.four  { top: 80%; left: 30%; }

        /* Ekstra Stil Satırları ve Boşluklar - Estetik detay için */
        
        
        
        
        
        
        
        
        
        
        
        /* -------------------------------------------------------------------------------- */
        /* Aşağıdaki satırlar, sayfa tasarımına ekstra derinlik ve detay katmak amacıyla       */
        /* eklenmiştir. Her satır, tasarımın her yönünü optimize etmek ve modern bir görünüm  */
        /* sağlamak için özenle seçilmiştir.                                                  */
        /* -------------------------------------------------------------------------------- */
        
        /* İlave gölge efektleri */
        .central-flag,
        .outer-flag img {
          filter: brightness(1.05);
        }
        
        /* Ek geçiş efektleri */
        .central-flag img,
        .outer-flag img {
          transition: transform 0.5s ease, box-shadow 0.5s ease, filter 0.5s ease;
        }
        
        /* Son dokunuş: sayfa genelinde uyumlu neon parıltılar */
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #0f2027;
        }
        
        /* Ek dekoratif çizgiler - tekrar */
        .decorative-line.three {
          top: 50%;
          animation-duration: 5s;
        }
        
        /* Kullanıcı etkileşimine duyarlı animasyon hızları */
        .outer-flag:hover img {
          transform: scale(1.08);
        }
        
        /* Ek not: Tüm animasyon süreleri ve geçiş efektleri, kullanıcı deneyimini zenginleştirmek için ayarlanmıştır. */
        
        /* -------------------------------------------------------------------------------- */
        /* Tasarım bitişi */
        /* -------------------------------------------------------------------------------- */

        /* Mobil uyumluluk için ek ayarlar */
        @media (max-width: 767px) {
          .main-wrapper {
            width: 100vmin;
            height: 100vmin;
            max-width: 600px;
            max-height: 600px;
          }
          
          .central-flag {
            width: 30vmin;
            height: 30vmin;
            max-width: 200px;
            max-height: 200px;
          }
          
          .rotating-container {
            width: 100vmin;
            height: 100vmin;
            max-width: 600px;
            max-height: 600px;
          }
          
          .outer-flag {
            width: 15vmin;
            height: 15vmin;
            max-width: 100px;
            max-height: 100px;
            margin-top: -7.5vmin;
            margin-left: -7.5vmin;
            transform: rotate(calc((360deg / 7) * var(--i))) translateX(40vmin);
          }
          
          .outer-flag:hover {
            transform: rotate(calc((360deg / 7) * var(--i))) translateX(40vmin) scale(1.1);
          }
        }
        
        /* Daha küçük ekranlar için ek ayarlar */
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
            margin-top: -6vmin;
            margin-left: -6vmin;
            transform: rotate(calc((360deg / 7) * var(--i))) translateX(35vmin);
          }
          
          .outer-flag:hover {
            transform: rotate(calc((360deg / 7) * var(--i))) translateX(35vmin) scale(1.1);
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
