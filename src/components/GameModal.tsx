// components/GameModal.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

// Oyun durumlarını tanımlayan enum
enum GameState {
  WAITING,
  START,
  PLAYING,
  PAUSED,
  FAILED,
}

const GameModal: React.FC = () => {
  // İdle tespiti için state ve timer
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<number | null>(null);

  // Modal ve oyun durumları
  const [modalOpen, setModalOpen] = useState(false);
  const [gameState, setGameState] = useState<GameState>(GameState.WAITING);

  // Canvas referansı ve animasyon frame id
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Oyun için diğer state’ler (örneğin, skor sıfırlama gibi eklemeler yapabilirsiniz)

  // Idle timer fonksiyonu – her etkileşimde yeniden başlatılır
  const resetIdleTimer = useCallback(() => {
    if (idle) {
      // Eğer idle modunda iken etkileşim olursa, bekleme resmi geri çekilsin
      setIdle(false);
    }
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
    }
    idleTimer.current = window.setTimeout(() => {
      setIdle(true);
    }, 30000); // 30 saniye
  }, [idle]);

  // Global etkileşimleri dinle
  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetIdleTimer));
    resetIdleTimer();
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetIdleTimer));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdleTimer]);

  // Bekleme resmine tıklayınca modalı aç
  const handleWaitImageClick = () => {
    setModalOpen(true);
    setIdle(false);
    setGameState(GameState.START);
  };

  // Modalı kapatma: kapanırken oyun döngüsü iptal edilir, durumlar resetlenir
  const closeModal = () => {
    setModalOpen(false);
    setIdle(false);
    cancelAnimationFrame(animationRef.current);
    setGameState(GameState.WAITING);
    resetIdleTimer();
  };

  // Oyun grafiklerini geliştirilmiş şekilde oluşturmak için
  useEffect(() => {
    if (!modalOpen || !canvasRef.current || gameState === GameState.WAITING) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Oyun nesneleri
    let score = 0;

    // Gelişmiş arka plan: Yumuşak gradient ve parallax hareket eden bulutlar
    const backgroundGradient = ctx.createLinearGradient(0, 0, 0, height);
    backgroundGradient.addColorStop(0, '#1e3c72');
    backgroundGradient.addColorStop(1, '#2a5298');

    interface Cloud {
      x: number;
      y: number;
      speed: number;
      radius: number;
    }
    let clouds: Cloud[] = [];
    for (let i = 0; i < 5; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * (height / 2),
        speed: 0.2 + Math.random() * 0.5,
        radius: 30 + Math.random() * 20,
      });
    }

    // Kuş nesnesi – gradient ve hafif gölge efektiyle
    let bird = { x: width / 4, y: height / 2, radius: 20, velocity: 0 };
    const gravity = 0.6;
    const flapStrength = -10;

    // Engeller (sütunlar): gelişmiş çizgiler, gradient ve yuvarlak köşeler
    interface Obstacle {
      x: number;
      width: number;
      gapY: number;
      gapHeight: number;
    }
    let obstacles: Obstacle[] = [];
    const obstacleSpeed = 3;
    const obstacleInterval = 1500; // milisaniye
    let lastObstacleTime = Date.now();

    // Oyun döngüsü
    const gameLoop = () => {
      // Güncel boyutları al
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      // Arka planı çiz: gradient
      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(0, 0, width, height);

      // Parallax bulutları güncelle ve çiz
      clouds.forEach((cloud) => {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.radius * 2 < 0) {
          cloud.x = width + cloud.radius;
          cloud.y = Math.random() * (height / 2);
        }
        const cloudGradient = ctx.createRadialGradient(
          cloud.x,
          cloud.y,
          cloud.radius * 0.2,
          cloud.x,
          cloud.y,
          cloud.radius
        );
        cloudGradient.addColorStop(0, 'rgba(255,255,255,0.8)');
        cloudGradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = cloudGradient;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Oyun oynanıyorsa: kuşa yerçekimi uygulama ve engeller oluşturma
      if (gameState === GameState.PLAYING) {
        bird.velocity += gravity;
        bird.y += bird.velocity;
        const now = Date.now();
        if (now - lastObstacleTime > obstacleInterval) {
          const gapHeight = 150;
          const gapY = Math.random() * (height - gapHeight - 40) + 20;
          obstacles.push({ x: width, width: 60, gapY, gapHeight });
          lastObstacleTime = now;
        }
      }

      // Engelleri güncelle ve çiz (gradientli, yuvarlatılmış sütunlar)
      ctx.fillStyle = '#66cc66';
      obstacles.forEach((obs) => {
        obs.x -= obstacleSpeed;
        // Üst sütun
        const topGradient = ctx.createLinearGradient(0, 0, 0, obs.gapY);
        topGradient.addColorStop(0, '#55aa55');
        topGradient.addColorStop(1, '#337733');
        ctx.fillStyle = topGradient;
        ctx.beginPath();
        ctx.moveTo(obs.x, 0);
        ctx.lineTo(obs.x + obs.width, 0);
        ctx.lineTo(obs.x + obs.width, obs.gapY - 10);
        ctx.quadraticCurveTo(obs.x + obs.width, obs.gapY, obs.x + obs.width - 10, obs.gapY);
        ctx.lineTo(obs.x + 10, obs.gapY);
        ctx.quadraticCurveTo(obs.x, obs.gapY, obs.x, obs.gapY - 10);
        ctx.closePath();
        ctx.fill();

        // Alt sütun
        const botY = obs.gapY + obs.gapHeight;
        const botGradient = ctx.createLinearGradient(0, botY, 0, height);
        botGradient.addColorStop(0, '#55aa55');
        botGradient.addColorStop(1, '#337733');
        ctx.fillStyle = botGradient;
        ctx.beginPath();
        ctx.moveTo(obs.x, height);
        ctx.lineTo(obs.x + obs.width, height);
        ctx.lineTo(obs.x + obs.width, botY + 10);
        ctx.quadraticCurveTo(obs.x + obs.width, botY, obs.x + obs.width - 10, botY);
        ctx.lineTo(obs.x + 10, botY);
        ctx.quadraticCurveTo(obs.x, botY, obs.x, botY + 10);
        ctx.closePath();
        ctx.fill();

        // Çarpışma kontrolü
        if (
          bird.x + bird.radius > obs.x &&
          bird.x - bird.radius < obs.x + obs.width &&
          (bird.y - bird.radius < obs.gapY || bird.y + bird.radius > obs.gapY + obs.gapHeight)
        ) {
          setGameState(GameState.FAILED);
        }
      });
      obstacles = obstacles.filter((obs) => obs.x + obs.width > 0);

      // Kuşu çiz – gradient ve gölge efektiyle
      const birdGradient = ctx.createRadialGradient(bird.x, bird.y, bird.radius * 0.3, bird.x, bird.y, bird.radius);
      birdGradient.addColorStop(0, '#ffdd00');
      birdGradient.addColorStop(1, '#ffaa00');
      ctx.fillStyle = birdGradient;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Skor çizimi – stilize metin
      ctx.fillStyle = 'white';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${Math.floor(score)}`, 30, 50);
      if (gameState === GameState.PLAYING) {
        score += 0.05;
      }

      // Duruma göre overlay ekranlar
      ctx.textAlign = 'center';
      if (gameState === GameState.START) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 56px sans-serif';
        ctx.fillText('Tap to Start', width / 2, height / 2);
      } else if (gameState === GameState.PAUSED) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 56px sans-serif';
        ctx.fillText('Paused', width / 2, height / 2);
      } else if (gameState === GameState.FAILED) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 64px sans-serif';
        ctx.fillText('Game Over', width / 2, height / 2 - 40);
        ctx.font = 'bold 32px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Tap to Restart', width / 2, height / 2 + 20);
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    // Canvas etkileşimi: Kuş için "flap" ve oyun durumlarının değiştirilmesi
    const handleCanvasClick = () => {
      if (gameState === GameState.START) {
        setGameState(GameState.PLAYING);
        bird.velocity = flapStrength;
      } else if (gameState === GameState.PLAYING) {
        bird.velocity = flapStrength;
      } else if (gameState === GameState.FAILED) {
        // Yeniden başlat: nesneleri resetle
        bird = { x: width / 4, y: height / 2, radius: 20, velocity: 0 };
        obstacles = [];
        score = 0;
        setGameState(GameState.START);
      }
    };

    canvas.addEventListener('click', handleCanvasClick);
    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationRef.current);
    };
  }, [modalOpen, gameState]);

  return (
    <>
      {/* Eğer sayfa idle ise ve modal açık değilse, sol alt köşede bekleme resmi animasyonlu şekilde belirir.
          Eğer etkileşim olursa (resetIdleTimer) resim animasyonlu şekilde geri çekilir. */}
      {idle && !modalOpen && (
        <div
          onClick={handleWaitImageClick}
          style={{
            position: 'fixed',
            left: '20px',
            bottom: '20px',
            cursor: 'pointer',
            animation: 'slideUp 1s forwards',
            zIndex: 999,
          }}
        >
          <img
            src="/game-pictures/wait-anime.png"
            alt="Wait Anime"
            style={{ width: '100px', height: 'auto', display: 'block' }}
          />
        </div>
      )}

      {/* Modal: Tüm ekranı kaplayan oyun penceresi */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Üstte kapatma butonu */}
          <div style={{ position: 'relative', padding: '10px' }}>
            <div
              style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }}
              onClick={closeModal}
            >
              <X size={32} color="white" />
            </div>
          </div>
          {/* Oyun canvas’ı */}
          <canvas ref={canvasRef} style={{ flex: 1 }} />
        </div>
      )}

      {/* CSS Animasyon tanımlamaları */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default GameModal;
            
