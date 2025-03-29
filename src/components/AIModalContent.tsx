import React from 'react';
import ActionCard from './ActionCard';

const AIModalContent: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <ActionCard
        imageSrc="/images/chat-ai.jpg"
        author="Chat AI"
        description="Interact with our advanced chatbot."
        link="/ai/chat"
      />
      <ActionCard
        imageSrc="/images/imagine-ai.jpg"
        author="Imagine AI"
        description="Generate stunning images using AI."
        link="/ai/imagine"
      />
    </div>
  );
};

export default AIModalContent;
