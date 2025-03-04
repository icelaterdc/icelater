// components/GameModal.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';

enum GameState {
  START,
  PLAYING,
  PAUSED,
  FAILED,
}

interface GameModalProps {
  onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ onClose }) => {
  // Kapatma için Esc tuşu dinleniyor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
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
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            cursor: 'pointer',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      </div>
      {/* Oyun canvas'ı */}
      <div style={{ flex: 1 }}>
        <InteractiveGameCanvas />
      </div>
    </div>
  );
};

const InteractiveGameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [gameState, setGameState] = useState<GameState>(GameState.START);

  // Oyun değişkenleri
  let score = 0;
  let lastTime = performance.now();
  let lastObstacleTime = performance.now();
  let bird = { x: window.innerWidth / 4, y: window.innerHeight / 2, radius: 20, velocity: 0 };
  const gravity = 0.5;
  const flapStrength = -10;
  let obstacles: Array<{ x: number; width: number; gapY: number; gapHeight: number }> = [];
  const obstacleSpeed = 3;
  const obstacleInterval = 1500;

  // Parallax bulutlar
  type Cloud = { x: number; y: number; speed: number; radius: number };
  let clouds: Cloud[] = [];
  for (let i = 0; i < 5; i++) {
    clouds.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * (window.innerHeight / 2),
      speed: 0.2 + Math.random() * 0.5,
      radius: 30 + Math.random() * 20,
    });
  }

  // Yuvarlatılmış dikdörtgen çizimi için yardımcı fonksiyon
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  };

  const gameLoop = (time: number) => {
    const delta = time - lastTime;
    lastTime = time;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Güncel pencere boyutları
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Temizle
    ctx.clearRect(0, 0, width, height);

    // Arka plan: gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#1e3c72');
    bgGradient.addColorStop(1, '#2a5298');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Bulutları güncelle ve çiz
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

    if (gameState === GameState.PLAYING) {
      // Kuş fiziği
      bird.velocity += gravity;
      bird.y += bird.velocity;

      // Engelleri ekle
      if (time - lastObstacleTime > obstacleInterval) {
        const gapHeight = 150;
        const gapY = Math.random() * (height - gapHeight - 100) + 50;
        obstacles.push({ x: width, width: 60, gapY, gapHeight });
        lastObstacleTime = time;
      }
    }

    // Engelleri güncelle, çiz ve çarpışma kontrolü
    obstacles.forEach((obs) => {
      obs.x -= obstacleSpeed;
      // Üst engel
      ctx.fillStyle = '#55aa55';
      roundRect(ctx, obs.x, 0, obs.width, obs.gapY, 10);
      // Alt engel
      const bottomY = obs.gapY + obs.gapHeight;
      ctx.fillStyle = '#337733';
      roundRect(ctx, obs.x, bottomY, obs.width, height - bottomY, 10);

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

    // Tavan ve zemin çarpışması
    if (bird.y + bird.radius > height || bird.y - bird.radius < 0) {
      setGameState(GameState.FAILED);
    }

    // Kuşu çiz: radial gradient ve gölge efektiyle
    const birdGradient = ctx.createRadialGradient(
      bird.x,
      bird.y,
      bird.radius * 0.2,
      bird.x,
      bird.y,
      bird.radius
    );
    birdGradient.addColorStop(0, '#ffdd00');
    birdGradient.addColorStop(1, '#ffaa00');
    ctx.fillStyle = birdGradient;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Skoru güncelle ve çiz
    if (gameState === GameState.PLAYING) {
      score += delta * 0.01;
    }
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${Math.floor(score)}`, 30, 50);

    // Farklı oyun durumlarına göre overlay ekranları çiz
    ctx.textAlign = 'center';
    if (gameState === GameState.START) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 56px sans-serif';
      ctx.fillText('Tap to Start', width / 2, height / 2);
    } else if (gameState === GameState.PAUSED) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 56px sans-serif';
      ctx.fillText('Paused', width / 2, height / 2);
    } else if (gameState === GameState.FAILED) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText('Game Over', width / 2, height / 2 - 40);
      ctx.font = 'bold 32px sans-serif';
      ctx.fillStyle = 'white';
      ctx.fillText('Tap to Restart', width / 2, height / 2 + 20);
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  };

  // Canvas tıklaması: oyunu başlat, flap uygula veya yeniden başlat
  const handleCanvasClick = () => {
    if (gameState === GameState.START) {
      setGameState(GameState.PLAYING);
      bird.velocity = flapStrength;
    } else if (gameState === GameState.PLAYING) {
      bird.velocity = flapStrength;
    } else if (gameState === GameState.FAILED) {
      // Oyunu sıfırla
      bird = { x: window.innerWidth / 4, y: window.innerHeight / 2, radius: 20, velocity: 0 };
      obstacles = [];
      score = 0;
      setGameState(GameState.START);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.addEventListener('click', handleCanvasClick);
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameState]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default GameModal;
