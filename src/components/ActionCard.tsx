import React from 'react';
import { motion } from 'framer-motion';

interface ActionCardProps {
  imageSrc: string;
  author: string;
  description: string;
  link: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ imageSrc, author, description, link }) => {
  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-gray-700 to-gray-800 rounded-2xl p-6 shadow-lg">
      <img
        src={imageSrc}
        alt={author}
        className="w-28 h-28 rounded-full mb-4 object-cover border-2 border-blue-500"
      />
      <h4 className="text-xl font-semibold text-white">{author}</h4>
      <p className="text-gray-300 text-center mt-2">{description}</p>
      <motion.a
        href={link}
        className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-full border-2 border-blue-500 font-medium transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] hover:border-blue-400"
        whileHover={{ scale: 1.1 }} 
      >
        Go
      </motion.a>
    </div>
  );
};

export default ActionCard;
