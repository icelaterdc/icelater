import React from 'react';
import ActionCard from './ActionCard';

const GamesModalContent: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <ActionCard
        imageSrc="/images/chess.jpg"
        author="Chess"
        description="Play chess against AI or friends."
        link="/games/chess"
      />
      <ActionCard
        imageSrc="/images/snake.jpg"
        author="Snake Game"
        description="Classic snake game with a modern twist."
        link="/games/snake"
      />
      <ActionCard
        imageSrc="/images/football.jpg"
        author="Football"
        description="Score goals in this fun football game."
        link="/games/football"
      />
    </div>
  );
};

export default GamesModalContent;
