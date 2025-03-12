import React from 'react';

const TuranFlagPage = () => {
  // Merkezi Turan bayrağı URL'si (örnek)
  const centralFlag = "https://upload.wikimedia.org/wikipedia/commons/3/37/Turan_flag.svg";

  // 7 Türk devletinin bayrak URL'leri
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
        /* Genel sayfa ayarları */
        .page-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: radial-gradient(circle, #0f2027, #203a43, #2c5364);
          overflow: hidden;
        }
        
        /* Merkezi Turan bayrağı */
        .central-flag {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 6px solid #00e5ff; /* Neon açık mavi çerçeve */
          box-shadow: 0 0 25px 5px rgba(0, 229, 255, 0.7);
          background: #000;
          transition: transform 0.5s ease, box-shadow 0.5s ease;
          z-index: 10;
        }
        
        .central-flag img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        
        /* Dış bayrakların döndüğü konteyner (çember) */
        .rotating-container {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 720px;
          height: 720px;
          transform: translate(-50%, -50%);
          animation: rotateContainer 180s linear infinite;
        }
        
        /* Her dış bayrağın konumlandırılması:
           Burada, çemberin yarıçapı 270px olarak belirlendi.
           (Merkezi bayrağın yarıçapı 150px + dış bayrağın yarıçapı 90px + 30px boşluk = 270px) */
        .outer-flag {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: rotate(calc((360deg / 7) * var(--i)))
                     translate(270px)
                     rotate(calc(-1 * (360deg / 7) * var(--i)));
          transition: transform 0.3s ease-in-out;
        }
        
        .outer-flag img {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          border: 4px solid #00e5ff; /* Neon açık mavi çerçeve */
          box-shadow: 0 0 20px 3px rgba(0, 229, 255, 0.6);
          object-fit: cover;
          transition: transform 0.5s ease, box-shadow 0.5s ease;
        }
        
        /* Dönen çember animasyonu:
           Döndürme esnasında konteynerin ortalama konumunu korumak için translate(-50%, -50%) ile birlikte uygulanır. */
        @keyframes rotateContainer {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        /* Hover efektleri */
        .outer-flag:hover {
          transform: rotate(calc((360deg / 7) * var(--i)))
                     translate(270px)
                     rotate(calc(-1 * (360deg / 7) * var(--i))) scale(1.1);
        }
        
        .central-flag:hover {
          transform: translate(-50%, -50%) scale(1.05);
        }
        
        /* Mobil uyumluluk:
           Ekran genişliği 600px altına düştüğünde, dış bayrakların bulunduğu çember gizlenecek,
           merkezi bayrak ise ekrana büyük şekilde yerleşecektir. */
        @media (max-width: 600px) {
          .rotating-container {
            display: none;
          }
          .central-flag {
            width: 80vw;
            height: 80vw;
            border-width: 8px;
          }
        }
        
        /* Genel geçiş ve sayfa içi uyum */
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
      
      {/* Merkezi Turan bayrağı */}
      <div className="central-flag">
        <img src={centralFlag} alt="Turan Bayrağı" />
      </div>
      
      {/* Dış bayrakların bulunduğu dönen çember */}
      <div className="rotating-container">
        {outerFlags.map((flagUrl, index) => (
          <div className="outer-flag" key={index} style={{ '--i': index }}>
            <img src={flagUrl} alt={`Türk Devleti Bayrağı ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TuranFlagPage;
