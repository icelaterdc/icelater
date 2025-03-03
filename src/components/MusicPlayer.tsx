import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRedo } from 'react-icons/fa';

interface Track {
  title: string;
  artist?: string;
  audioUrl: string;
  duration: number; // saniye cinsinden toplam süre
}

// Gerçek uygulamada, bu fonksiyon Distube, ytdl‑core ve yt‑dlp kullanarak 
// arama yapan sunucu API’nizi çağıracaktır.
async function searchTracks(query: string): Promise<Track[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error('Parça arama işlemi başarısız oldu.');
  }
  const data = await res.json();
  return data.tracks;
}

const MusicPlayer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLInputElement | null>(null);

  // Parça değiştiğinde veya oynatma/döngü durumu güncellendiğinde yeni URL’yi yükle
  useEffect(() => {
    if (tracks.length > 0 && audioRef.current) {
      audioRef.current.src = tracks[currentIndex].audioUrl;
      audioRef.current.loop = isLooping;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentIndex, tracks, isLooping, isPlaying]);

  // Audio elementinden güncel zamanı ve toplam süreyi güncelle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      if (progressBarRef.current && duration) {
        progressBarRef.current.value = ((audio.currentTime / duration) * 100).toString();
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (!isLooping && currentIndex < tracks.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (!isLooping) {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [duration, isLooping, currentIndex, tracks.length]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const results = await searchTracks(query);
      if (results.length > 0) {
        setTracks(results);
        setCurrentIndex(0);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (currentIndex < tracks.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  };

  const toggleLoop = () => {
    setIsLooping(prev => !prev);
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && duration) {
      const newTime = (parseFloat(e.target.value) / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="my-12 bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Müzik Arama</h2>
      <div className="flex items-center gap-4">
        <input 
          type="text" 
          placeholder="Müzik adı girin..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 rounded border border-gray-700 bg-gray-800 text-white focus:outline-none"
        />
        <button 
          onClick={handleSearch}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
        >
          Çal
        </button>
      </div>

      {tracks.length > 0 && (
        <div className="mt-6 border-t border-gray-700 pt-4">
          {/* Parça Bilgileri ve Kontroller */}
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <p className="text-white font-bold">{tracks[currentIndex].title}</p>
              {tracks[currentIndex].artist && (
                <p className="text-gray-400 text-sm">{tracks[currentIndex].artist}</p>
              )}
            </div>
            <div className="flex items-center gap-6">
              <button onClick={playPrevious} className="text-white hover:text-green-400" title="Önceki">
                <FaStepBackward size={20} />
              </button>
              <button onClick={togglePlayPause} className="text-white hover:text-green-400" title={isPlaying ? "Duraklat" : "Oynat"}>
                {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
              </button>
              <button onClick={playNext} className="text-white hover:text-green-400" title="Sonraki">
                <FaStepForward size={20} />
              </button>
              <button onClick={toggleLoop} className="text-white hover:text-green-400" title="Döngü">
                <FaRedo size={20} className={isLooping ? "text-green-400" : ""} />
              </button>
            </div>
          </div>
          {/* İlerleme Barı */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-gray-400 text-sm">{formatTime(currentTime)}</span>
            <input 
              ref={progressBarRef}
              type="range" 
              min="0" 
              max="100" 
              defaultValue="0"
              onChange={handleProgressChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-gray-400 text-sm">{formatTime(duration)}</span>
          </div>
          <audio ref={audioRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
