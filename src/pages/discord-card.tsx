import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';

/* --- Yardımcı Fonksiyonlar --- */
const getStatusIcon = (status: string) => {
  const iconSize = 16;
  const iconPath = `/statusIcon/${status}.png`;
  return (
    <img
      src={iconPath}
      alt={status}
      className="w-4 h-4"
      style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
    />
  );
};

const badgeMapping = [
  { bit: 1, img: "/badges/brilliance.png" },
  { bit: 2, img: "/badges/aktif_gelistirici.png" },
  { bit: 4, img: "/badges/eski_isim.png" },
  { bit: 8, img: "/badges/gorev_tamamlandi.png" }
];

const formatDurationMs = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/* --- Tip Tanımlamaları --- */
type LanyardData = {
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    display_name?: string;
    global_name?: string;
    public_flags?: number;
    bannerURL?: string;
  };
  activities: Array<{
    id: string;
    name: string;
    type: number;
    state?: string;
    details?: string;
    timestamps?: {
      start: number;
      end?: number;
    };
    assets?: {
      large_image?: string;
    };
  }>;
  discord_status: string;
  listening_to_spotify: boolean;
  spotify: {
    timestamps: {
      start: number;
      end: number;
    };
    album: string;
    album_art_url: string;
    artist: string;
    song: string;
  } | null;
};

type APIResponse = {
  data: LanyardData;
  success: boolean;
};

/* --- Discord Kartını Resme Dönüştüren Bileşen --- */
const DiscordCardImage: React.FC = () => {
  const [data, setData] = useState<LanyardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Lanyard API'den veriyi çek (her 5 saniyede bir)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://api.lanyard.rest/v1/users/991409937022468169');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json: APIResponse = await res.json();
        if (!json.success) throw new Error('API response unsuccessful');
        setData(json.data);
        setError(null);
      } catch (err: any) {
        setError(`Veriler alınamadı: ${err.message}`);
        console.error(err);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Her saniye geçerli zamanı güncelle (Spotify progress için)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Kart render edildikten sonra DOM elementinden resim URL'si oluştur
  useEffect(() => {
    if (cardRef.current) {
      // DOM'un güncellendiğinden emin olmak için küçük bir gecikme ekliyoruz
      setTimeout(() => {
        toPng(cardRef.current!)
          .then((dataUrl) => {
            setImageUrl(dataUrl);
          })
          .catch((err) => {
            console.error('Resim oluşturulurken hata oluştu:', err);
          });
      }, 500);
    }
  }, [data, currentTime]);

  if (!data) {
    return (
      <div className="max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6 animate-pulse text-white text-center">
        Yükleniyor...
      </div>
    );
  }

  const { discord_user, activities, discord_status, listening_to_spotify, spotify } = data;
  const displayName = discord_user.display_name || discord_user.global_name || discord_user.username;
  const avatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp?size=1024`;

  // Custom status (konuşma balonu)
  const customActivity = activities.find(act => act.id === "custom" && act.state && act.state.trim() !== "");
  const customState = customActivity ? customActivity.state : null;

  // Spotify kartı
  let spotifyCard = null;
  if (listening_to_spotify && spotify) {
    const { start, end } = spotify.timestamps;
    const totalDuration = end - start;
    const elapsed = Math.min(Math.max(currentTime - start, 0), totalDuration);
    const progressPercent = (elapsed / totalDuration) * 100;

    spotifyCard = (
      <div className="mt-4 bg-gray-700/50 rounded-2xl p-4">
        <div className="flex items-center">
          <img
            src={spotify.album_art_url}
            alt={spotify.album}
            className="w-16 h-16 rounded-md object-cover mr-4"
          />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">{spotify.song}</h3>
            <p className="text-xs text-gray-300">
              {spotify.artist} &middot; {spotify.album}
            </p>
          </div>
          <div className="ml-2">
            <img src="/badges/spotify.png" alt="Spotify" className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full h-2 bg-gray-600 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-green-500 font-medium mt-1">
            <span>{formatDurationMs(elapsed)}</span>
            <span>{formatDurationMs(totalDuration)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Aktivite kartı (Spotify dışında)
  let activityCard = null;
  if (activities.length > 0) {
    const currentActivity = activities.find((a) => a.type !== 4);
    if (currentActivity) {
      activityCard = (
        <div className="mt-4 bg-gray-900 p-3 rounded-lg flex items-center">
          {currentActivity.assets?.large_image && (
            <img
              src={currentActivity.assets.large_image}
              alt={currentActivity.name}
              className="w-12 h-12 rounded-lg mr-3"
            />
          )}
          <div>
            <p className="text-sm text-blue-400 font-semibold">
              {currentActivity.name}
            </p>
            {currentActivity.details && (
              <p className="text-xs text-gray-300">{currentActivity.details}</p>
            )}
            {currentActivity.state && (
              <p className="text-xs text-gray-500">{currentActivity.state}</p>
            )}
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      {/* Discord kartının render edildiği alan */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl relative p-6"
      >
        {discord_user.bannerURL && discord_user.bannerURL !== "" && (
          <div
            className="h-24 w-full bg-cover bg-center rounded-t-2xl mb-4"
            style={{ backgroundImage: `url(${discord_user.bannerURL})` }}
          />
        )}
        <div className="flex items-center">
          <div className="relative w-20 h-20">
            <img
              src={avatarUrl}
              alt={discord_user.username}
              className="w-full h-full rounded-full border-4 border-gray-800 object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-gray-900 rounded-full p-1">
              {getStatusIcon(discord_status)}
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-white">{displayName}</h2>
            <p className="text-sm text-gray-300">{discord_user.username}</p>
            <div className="mt-1 bg-gray-900 inline-flex items-center px-2 py-1 rounded-lg">
              {badgeMapping.map((mapping) => (
                <img
                  key={mapping.bit}
                  src={mapping.img}
                  alt="rozet"
                  className="w-4 h-4 mr-1 last:mr-0"
                />
              ))}
            </div>
          </div>
        </div>

        {customState && (
          <div className="absolute top-6 right-6">
            <div className="relative">
              <div
                className="bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg"
                style={{ maxWidth: "180px", wordBreak: "break-word" }}
              >
                {customState}
              </div>
              <div className="absolute bottom-1 left-[-12px]">
                <div className="w-2 h-2 rounded-full bg-gray-700"></div>
              </div>
              <div className="absolute bottom-[-4px] left-[-20px]">
                <div className="w-3 h-3 rounded-full bg-gray-700"></div>
              </div>
            </div>
          </div>
        )}

        {listening_to_spotify ? spotifyCard : activityCard}
      </motion.div>
      
      {/* Oluşturulan resim URL'sinin ve önizlemesinin gösterimi */}
      {imageUrl && (
        <div className="mt-4 text-center">
          <p className="text-white mb-2">Oluşturulan Discord Kartı Resmi:</p>
          <img src={imageUrl} alt="Discord Card" className="mx-auto rounded-2xl shadow-2xl" />
          <p className="text-white mt-2">Resim URL'si:</p>
          <textarea
            readOnly
            value={imageUrl}
            className="w-full p-2 bg-gray-800 text-white rounded"
            rows={3}
          />
        </div>
      )}
      {error && (
        <div className="mt-4 text-center text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default DiscordCardImage;
