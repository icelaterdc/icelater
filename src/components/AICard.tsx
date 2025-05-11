import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AICardProps {
  title: string;
  gifSrc: string;
  link: string;
}

const AICard: React.FC<AICardProps> = ({ title, gifSrc, link }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = gifSrc;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(true); 
  }, [gifSrc]);

  const cardStyle = {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '300px',
    height: '400px',
    borderRadius: '15px',
    overflow: 'hidden',
    border: `1px solid ${isHovered ? '#1E3A8A' : '#1f2937'}`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: isHovered
      ? '0 10px 20px rgba(30, 58, 138, 0.3)'
      : '0 4px 12px rgba(31, 41, 55, 0.2)',
    opacity: isLoaded ? 1 : 0, 
    transition: 'opacity 0.5s ease',
  };

  const headerStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: isHovered ? '#1E3A8A' : '#1f2937',
    color: 'white',
    padding: '12px',
    textAlign: 'center' as const,
    fontWeight: 'bold' as const,
    fontSize: '16px',
    borderTopLeftRadius: '14px',
    borderTopRightRadius: '14px',
    transition: 'background-color 0.3s ease',
  };

  const gifStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  };

  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <motion.div
        style={cardStyle}
        whileHover={{ scale: 1.05 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={headerStyle}>{title}</div>
        {isLoaded && <img src={gifSrc} alt={title} style={gifStyle} />}
      </motion.div>
    </Link>
  );
};

export default AICard;
