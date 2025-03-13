import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Page404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0A192F] to-black text-white overflow-hidden relative px-4">
      {/* Arka Plan Animasyonu: Yıldızlar ve Parıldama */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="stars"></div>
        <div className="twinkling"></div>
      </motion.div>

      {/* Ana İçerik */}
      <div className="relative z-10 max-w-2xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-7xl md:text-8xl font-extrabold mb-6"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          404
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Uzayda Kayboldunuz!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg md:text-xl mb-10"
        >
          Aradığınız sayfa bu galakside bulunamadı. Endişelenmeyin; sizi evrenin merkezine geri götürebiliriz.
        </motion.p>
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0px 0px 20px rgba(57,255,20,0.8)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#39FF14] text-black px-8 py-3 rounded-full font-bold tracking-wider"
          >
            Ana Sayfaya Dön
          </motion.button>
        </Link>
      </div>

      {/* Ekstra: Yavaş Dönen Yörünge Çemberi */}
      <motion.div 
        className="absolute border-2 border-[#39FF14] rounded-full"
        style={{ width: '300px', height: '300px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Page404;
