import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  audioSrc: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      // Müzik çalıyorken buton tıklanırsa, müziği duraklat
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Müzik duraklatılmışken veya henüz başlamadıysa, buton tıklanırsa çalmaya başla veya kaldığı yerden devam et
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 opacity-60 hover:opacity-100 transition-opacity">
      <button
        onClick={togglePlay}
        className="bg-gray-800/70 p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700/70 transition-colors"
        aria-label={isPlaying ? "Müziği Durdur" : "Müziği Başlat"}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />
    </div>
  );
};

export default AudioPlayer;
