import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Page404 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A192F] text-white overflow-hidden">
      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-bold mb-4"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          404 - Uzayda Kayboldunuz!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl mb-8"
        >
          Aradığınız sayfa bu galakside bulunamadı. Ama endişelenmeyin, sizi ana yörüngeye geri döndürebiliriz.
        </motion.p>
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#39FF14] text-black px-6 py-3 rounded-full font-bold"
          >
            Ana Sayfaya Dön
          </motion.button>
        </Link>
      </div>
      {/* Arka Plan Animasyonu */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="stars"></div>
        <div className="twinkling"></div>
      </motion.div>
    </div>
  );
};

export default Page404;
