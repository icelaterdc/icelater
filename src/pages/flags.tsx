import React from 'react';

const TuranFlagDisplay = () => {
  // Bayrak URL'leri
  const centralFlag = "https://upload.wikimedia.org/wikipedia/commons/3/37/Turan_flag.svg"; // Turan bayrağı (örnek URL)
  const outerFlags = [
    "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg",                      // Türkiye
    "https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Azerbaijan.svg",                   // Azerbaycan
    "https://upload.wikimedia.org/wikipedia/commons/d/d3/Flag_of_Kazakhstan.svg",                   // Kazakistan
    "https://upload.wikimedia.org/wikipedia/commons/c/c7/Flag_of_Kyrgyzstan.svg",                   // Kırgızistan
    "https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Turkmenistan.svg",                // Türkmenistan
    "https://upload.wikimedia.org/wikipedia/commons/8/84/Flag_of_Uzbekistan.svg",                  // Özbekistan
    "https://upload.wikimedia.org/wikipedia/commons/5/5e/Flag_of_the_Turkish_Republic_of_Northern_Cyprus.svg" // Kuzey Kıbrıs
  ];

  return (
    <div className="flag-container">
      <style>{`
        /* Sayfa genel ayarları */
        .flag-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        /* Merkezi Turan bayrağı */
        .central-flag img {
          width: 220px;
          height: 220px;
          border-radius: 50%;
          border: 5px solid #fff;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
          z-index: 2;
        }
        /* Dönme dolap kapsayıcısı */
        .rotating-flags {
          position: absolute;
          width: 500px;
          height: 500px;
          animation: rotate 120s linear infinite;
        }
        /* Her bir dış bayrak konumlandırması: 
           CSS değişkeni (--i) ile her bayrak için açıyı hesaplar,
           ardından dışarıya 220px kaydırır ve bayrağın düz görünmesini sağlar. */
        .flag {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: rotate(calc((360deg / 7) * var(--i))) translate(220px) rotate(calc(-1 * (360deg / 7) * var(--i)));
        }
        .flag img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        /* Yavaş dönüş animasyonu */
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      {/* Merkezi Turan bayrağı */}
      <div className="central-flag">
        <img src={centralFlag} alt="Turan Bayrağı" />
      </div>
      {/* Dış bayraklar: 7 Türk devletinin bayrağı */}
      <div className="rotating-flags">
        {outerFlags.map((flagUrl, index) => (
          <div className="flag" key={index} style={{ '--i': index }}>
            <img src={flagUrl} alt={`Türk Devleti Bayrağı ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TuranFlagDisplay;
                         
