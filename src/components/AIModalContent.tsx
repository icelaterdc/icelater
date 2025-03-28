import React from 'react';
import ModalCard from './ModalCard';

interface AIModalContentProps {
  onClose: () => void;
}

const AIModalContent: React.FC<AIModalContentProps> = ({ onClose }) => {
  const handleChatGo = () => {
    window.location.href = '/chat-ai';
  };

  const handleImagineGo = () => {
    window.location.href = '/imagine-ai';
  };

  return (
    <div className="flex flex-col gap-6">
      <ModalCard
        imageSrc="/images/chat-ai.png"
        author="Chat AI"
        description="Konuşarak destek al, sorularını yanıtla."
        onGo={handleChatGo}
      />
      <ModalCard
        imageSrc="/images/imagine-ai.png"
        author="Imagine AI"
        description="Hayal gücünü konuştur, resimler oluştur."
        onGo={handleImagineGo}
      />
    </div>
  );
};

export default AIModalContent;
