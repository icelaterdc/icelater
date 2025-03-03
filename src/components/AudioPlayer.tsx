import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  audioSrc: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (audioRef.current) {
          audioRef.current.play().then(() => {
            setIsPlaying(true);
            console.log('Audio çalmaya başladı.');
          }).catch(error => {
            console.error("Audio playback failed:", error);
          });
        }
      }
    };

    // Kullanıcı etkileşimleri için event listener ekleniyor
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [hasInteracted]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 opacity-60 hover:opacity-100 transition-opacity">
      <button
        onClick={toggleMute}
        className="bg-gray-800/70 p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700/70 transition-colors"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        muted={isMuted}
        className="hidden"
      />
    </div>
  );
};

export default AudioPlayer;
