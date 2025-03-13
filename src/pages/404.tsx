import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Page404 = () => {
  return (
    <div className="page-404">
      {/* Arka Plan Efektleri */}
      <div className="stars"></div>
      <div className="twinkling"></div>

      {/* Animasyonlu Gezegen İkonları */}
      <motion.img 
        src="https://cdn-icons-png.freepik.com/512/3336/3336008.png" 
        alt="Gezegen 1" 
        className="planet planet-1"
        initial={{ x: -50, y: -50, opacity: 0 }}
        animate={{
          x: [-50, 0, 50, 0, -50],
          y: [-50, 50, 0, -50, -50],
          opacity: [0, 0.4, 0.4, 0.4, 0],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{ duration: 20, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
      />
      <motion.img 
        src="https://www.iconpacks.net/icons/2/free-star-icon-2768-thumb.png" 
        alt="Gezegen 2" 
        className="planet planet-2"
        initial={{ x: 50, y: 50, opacity: 0 }}
        animate={{
          x: [50, 0, -50, 0, 50],
          y: [50, -50, 0, 50, 50],
          opacity: [0, 0.3, 0.3, 0.3, 0],
          rotate: [0, -90, -180, -270, -360]
        }}
        transition={{ duration: 25, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
      />
      <motion.img 
        src="others/moon.png" 
        alt="Gezegen 3" 
        className="planet planet-3"
        initial={{ x: 0, y: 0, opacity: 0 }}
        animate={{
          x: [0, 30, 0, -30, 0],
          y: [0, -30, 0, 30, 0],
          opacity: [0, 0.5, 0.5, 0.5, 0],
          rotate: [0, 45, 90, 135, 180]
        }}
        transition={{ duration: 30, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
      />

      {/* Ana İçerik */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-7xl md:text-8xl font-extrabold mb-6"
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
          Sanırım yanlış bir galaksiye ışınlandınız. Endişelenmeyin; sizi evrenin merkezine geri götürebiliriz.
        </motion.p>
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0px 0px 15px rgba(0, 0, 139, 0.7)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#00008B] text-white px-8 py-3 rounded-full font-bold tracking-wider"
          >
            Ana Sayfaya Dön
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default Page404;
