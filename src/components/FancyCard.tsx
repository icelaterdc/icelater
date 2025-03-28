import React from 'react';
import { motion } from 'framer-motion';

interface FancyCardProps {
  imageSrc: string;
  title: string;
  description: string;
  onClick: () => void;
}

const FancyCard: React.FC<FancyCardProps> = ({ imageSrc, title, description, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className="flex items-center p-4 bg-gray-800 rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300"
    >
      {/* Sol: Yuvarlak Resim */}
      <div className="w-16 h-16 mr-4">
        <img
          src={imageSrc}
          alt={title}
          className="w-16 h-16 object-cover rounded-full border-2 border-gray-700"
        />
      </div>
      {/* Orta: Başlık ve Açıklama */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
      {/* Sağ: Mavi Ok */}
      <motion.div
        whileHover={{ scale: 1.2, rotate: 15 }}
        className="ml-4 text-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default FancyCard;
        
