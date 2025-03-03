import React, { useState, useRef, useEffect } from 'react';

interface Track {
  title: string;
  artist?: string;
  audioUrl: string;
}

// Örnek veriler; gerçek kullanımda backend üzerinden Distube ile arama yapabilirsiniz.
const dummyTracks: Track[] = [
  { title: 'Track 1', artist: 'Artist 1', audioUrl: '/music/track1.mp3' },
  { title: 'Track 2', artist: 'Artist 2', audioUrl: '/music/track2.mp3' },
  { title: 'Track 3', artist: 'Artist 3', audioUrl: '/music/track3.mp3' },
];

// Bu fonksiyon, girilen sorguya göre müzik araması yapar.
// Gerçek projede burada Distube kullanan backend API çağrısı yapılmalıdır.
async function searchTracks(query: string): Promise<Track[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = dummyTracks.filter(track =>
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        (track.artist && track.artist.toLowerCase().includes(query.toLowerCase()))
      );
      resolve(results.length > 0 ? results : dummyTracks);
    }, 500);
  });
}

const MusicPlayer: React.FC = () => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Herhangi bir kontrol değiştiğinde (şarkı, loop, oynatma durumu) yeni parçayı yükle
  useEffect(() => {
    if (tracks.length > 0 && audioRef.current) {
      audioRef.current.src = tracks[currentIndex].audioUrl;
      audioRef.current.loop = isLooping;
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error('Playback error:', error));
      }
    }
  }, [currentIndex, tracks, isLooping, isPlaying]);

  // Şarkı bittiğinde eğer loop kapalıysa otomatik sonraki parçaya geçiş
  const handleEnded = () => {
    if (!isLooping && currentIndex < tracks.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (!isLooping) {
      setIsPlaying(false);
    }
  };

  // Arama kutusundan isim alıp çalmaya başlama
  const handlePlayClick = async () => {
    if (query.trim() === '') return;
    try {
      const results = await searchTracks(query);
      if (results.length > 0) {
        setTracks(results);
        setCurrentIndex(0);
        setIsPlaying(true);
        if (audioRef.current) {
          audioRef.current.src = results[0].audioUrl;
          audioRef.current.loop = isLooping;
          await audioRef.current.play();
        }
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
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
        .catch(error => console.error('Playback error:', error));
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

  return (
    <div className="my-12 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Müzik Arama</h2>
      <div className="flex items-center gap-4">
        <input 
          type="text" 
          placeholder="Müzik adı girin..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none"
        />
        <button 
          onClick={handlePlayClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Çal
        </button>
      </div>

      {/* Arama sonucu bulunan parçalar varsa, şık bir kontrol barı göster */}
      {tracks.length > 0 && (
        <div className="mt-6 border-t border-gray-600 pt-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="font-bold">{tracks[currentIndex].title}</p>
              {tracks[currentIndex].artist && (
                <p className="text-sm text-gray-300">{tracks[currentIndex].artist}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleLoop} 
                className="hover:text-blue-400 transition-colors" 
                title="Döngü"
              >
                {isLooping ? "Döngü Açık" : "Döngü Kapalı"}
              </button>
              <button 
                onClick={playPrevious} 
                className="hover:text-blue-400 transition-colors" 
                title="Önceki"
              >
                Önceki
              </button>
              <button 
                onClick={togglePlayPause} 
                className="hover:text-blue-400 transition-colors" 
                title={isPlaying ? "Duraklat" : "Devam Et"}
              >
                {isPlaying ? "Duraklat" : "Devam Et"}
              </button>
              <button 
                onClick={playNext} 
                className="hover:text-blue-400 transition-colors" 
                title="Sonraki"
              >
                Sonraki
              </button>
            </div>
          </div>
          <audio 
            ref={audioRef} 
            onEnded={handleEnded} 
            className="hidden" 
          />
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
