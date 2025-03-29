import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // Modal açıkken kaydırma pozisyonunu koru ve kaydırmayı engelle
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY; // Mevcut kaydırma pozisyonunu al
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`; // Sayfayı sabitle
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden'; // Kaydırmayı engelle
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = 'auto'; // Kaydırmayı geri aç
      window.scrollTo(0, parseInt(scrollY || '0') * -1); // Orijinal pozisyona dön
    }
    // Bileşen kaldırıldığında varsayılan ayarlara dön
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-2xl p-8 relative max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
      {/* Kapatma butonu modalın altına taşındı */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          className="text-gray-400 hover:text-white transition-colors bg-gray-700 rounded-full p-3"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default Modal;
