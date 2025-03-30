import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  imageSrc: string;
  title: string;
  description: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ imageSrc, title, description, onClick }) => {
  return (
    <div className="flex items-center bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl">
      <img
        src={imageSrc}
        alt={title}
        className="w-20 h-20 rounded-full mr-6 object-cover border-2 border-blue-500"
      />
      <div className="flex-1">
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <p className="text-gray-300 mt-1">{description}</p>
      </div>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-6 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]"
        whileHover={{ scale: 1.3, rotate: 15 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        onClick={onClick}
      >
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
      </motion.svg>
    </div>
  );
};

export default FeatureCard;
