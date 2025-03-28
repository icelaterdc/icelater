import React from 'react';
import { motion } from 'framer-motion';

interface ModalCardProps {
  imageSrc: string;
  author: string;
  description: string;
  onGo: () => void;
}

const ModalCard: React.FC<ModalCardProps> = ({ imageSrc, author, description, onGo }) => {
  return (
    <div className="flex flex-col items-center bg-gray-800 rounded-xl p-4 shadow-md">
      <div className="w-20 h-20 mb-2">
        <img
          src={imageSrc}
          alt={author}
          className="w-20 h-20 object-cover rounded-full border-2 border-gray-700"
        />
      </div>
      <h4 className="text-lg font-semibold mb-1">{author}</h4>
      <p className="text-gray-400 text-center mb-4">{description}</p>
      <motion.button
        whileHover={{ filter: 'brightness(150%)', boxShadow: '0px 0px 8px rgba(59,130,246,0.8)' }}
        onClick={onGo}
        className="px-4 py-2 border border-gray-400 bg-blue-600 text-white rounded-full transition-all duration-200"
      >
        Go
      </motion.button>
    </div>
  );
};

export default ModalCard;
