import React from 'react';
import ModalCard from './ModalCard';

interface GameModalContentProps {
  onClose: () => void;
}

const GameModalContent: React.FC<GameModalContentProps> = ({ onClose }) => {
  const handleChessGo = () => {
    window.location.href = '/games/chess';
  };

  const handleSnakeGo = () => {
    window.location.href = '/games/snake';
  };

  const handleFootballGo = () => {
    window.location.href = '/games/football';
  };

  return (
    <div className="flex flex-col gap-6">
      <ModalCard
        imageSrc="/images/chess.png"
        author="Satranç"
        description="Strateji ve zekanın buluştuğu klasik oyunumuz."
        onGo={handleChessGo}
      />
      <ModalCard
        imageSrc="/images/snake.png"
        author="Yılan Oyunu"
        description="Retro nostaljiyle dolu, eğlenceli bir yılan oyunu."
        onGo={handleSnakeGo}
      />
      <ModalCard
        imageSrc="/images/football.png"
        author="Futbol"
        description="Sahada heyecan dorukta! Hemen oynayın."
        onGo={handleFootballGo}
      />
    </div>
  );
};

export default GameModalContent;
