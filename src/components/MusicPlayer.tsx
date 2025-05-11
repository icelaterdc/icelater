import React, { useState, useEffect } from 'react';

interface Track {
  title: string;
  artist?: string;
  duration: number; 
  cover?: string;
}

const MusicPlayer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loopMode, setLoopMode] = useState(false);

  const handlePlay = async () => {
    if (query.trim() === '') return;
    try {
      const response = await fetch('/api/music/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (data.track) {
        setCurrentTrack(data.track);
        setDuration(data.track.duration);
        setProgress(0);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Müzik başlatılırken hata:', error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(async () => {
        try {
          const response = await fetch('/api/music/status');
          const data = await response.json();
          if (data.track) {
            setCurrentTrack(data.track);
            setProgress(data.progress);
            setDuration(data.track.duration);
          }
        } catch (error) {
          console.error('Status bilgisi çekilirken hata:', error);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handleStop = async () => {
    try {
      await fetch('/api/music/stop', { method: 'POST' });
      setIsPlaying(false);
      setCurrentTrack(null);
      setProgress(0);
      setDuration(0);
    } catch (error) {
      console.error('Müzik durdurulurken hata:', error);
    }
  };

  const handleNext = async () => {
    try {
      await fetch('/api/music/next', { method: 'POST' });
    } catch (error) {
      console.error('Sonraki parçaya geçilirken hata:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      await fetch('/api/music/previous', { method: 'POST' });
    } catch (error) {
      console.error('Önceki parçaya geçilirken hata:', error);
    }
  };

  const toggleLoop = async () => {
    try {
      const newLoopMode = !loopMode;
      await fetch('/api/music/loop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loop: newLoopMode }),
      });
      setLoopMode(newLoopMode);
    } catch (error) {
      console.error('Döngü modu değiştirilirken hata:', error);
    }
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-md mx-auto my-8">
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Müzik ismi..."
          className="w-full p-2 rounded-md text-gray-900"
        />
        <button
          onClick={handlePlay}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 p-2 rounded-md"
        >
          Çal
        </button>
      </div>

      {isPlaying && currentTrack && (
        <div className="mt-6">
          <div className="flex items-center space-x-4">
            {currentTrack.cover && (
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-16 h-16 rounded-md"
              />
            )}
            <div>
              <h3 className="text-lg font-bold">{currentTrack.title}</h3>
              <p className="text-sm text-gray-400">
                {currentTrack.artist || 'Bilinmeyen Sanatçı'}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{new Date(progress * 1000).toISOString().substr(14, 5)}</span>
              <span>{new Date(duration * 1000).toISOString().substr(14, 5)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-around">
            <button
              onClick={handlePrevious}
              className="text-gray-300 hover:text-white"
            >
              Önceki
            </button>
            <button
              onClick={handleStop}
              className="text-gray-300 hover:text-white"
            >
              Durdur
            </button>
            <button onClick={handleNext} className="text-gray-300 hover:text-white">
              Sonraki
            </button>
            <button
              onClick={toggleLoop}
              className={`text-gray-300 hover:text-white ${
                loopMode ? 'text-blue-500' : ''
              }`}
            >
              Döngü
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
