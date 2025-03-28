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
      className="flex items-center p-3 bg-gray-800 rounded-xl shadow-lg cursor-pointer transition-all duration-300 w-72 h-20"
      whileHover={{ boxShadow: '0px 0px 12px rgba(59, 130, 246, 0.8)' }}
    >
      {/* Sol: Yuvarlak Resim */}
      <div className="w-16 h-16 mr-3 flex-shrink-0">
        <img
          src={imageSrc}
          alt={title}
          className="w-16 h-16 object-cover rounded-full border-2 border-gray-700"
        />
      </div>
      {/* Orta: Başlık ve Açıklama */}
      <div className="flex-1">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      {/* Sağ: Kuyruklu Ok */}
      <motion.div
        className="ml-3"
        whileHover={{ filter: 'brightness(150%)' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Kuyruk kısmı */}
          <line x1="2" y1="12" x2="14" y2="12" />
          {/* Ok başı */}
          <polyline points="8 6 14 12 8 18" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default FancyCard;
