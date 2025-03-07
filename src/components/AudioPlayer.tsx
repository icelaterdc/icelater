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
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Ses çalma hatası:", error));
    }
  };

  // Bileşeni geçici olarak gizlemek için bu koşulu ekleyebilirsiniz
  const isVisible = false; // Şu anlık görünmesin diye false yaptık

  if (!isVisible) {
    return null; // Bileşen render edilmez, yani görünmez
  }

  return (
    <div className="opacity-60 hover:opacity-100 transition-opacity">
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
