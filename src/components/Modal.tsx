import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  // Escape tuşuyla kapatma ve scroll kilitleme
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-2xl p-8 shadow-2xl max-w-lg w-full relative"
      >
        {children}
        {/* Kapatma (çarpı) butonu */}
        <button
          onClick={onClose}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 hover:text-white transition-colors duration-200 text-3xl"
        >
          &times;
        </button>
      </motion.div>
    </div>
  );
};

export default Modal;
