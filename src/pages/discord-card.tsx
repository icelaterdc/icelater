// src/pages/discord-card.tsx

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

// Yardımcı Fonksiyonlar
const getStatusIcon = (status: string) => {
  const iconSize = 16;
  const iconPath = `/statusIcon/${status}.png`;
  return (
    <img
      src={iconPath}
      alt={status}
      className="w-4 h-4"
      style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
      crossOrigin="anonymous"
    />
  );
};

// Badge'ler manuel olarak tanımlandı
const badgeMapping = [
  { img: "/badges/brilliance.png" },
  { img: "/badges/aktif_gelistirici.png" },
  { img: "/badges/eski_isim.png" },
  { img: "/badges/gorev_tamamlandi.png" },
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

// Tip Tanımlamaları
type LanyardData = {
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    display_name?: string;
    global_name?: string;
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

// Discord Kartı Bileşeni
const DiscordCardImage: React.FC = () => {
  const [data, setData] = useState<LanyardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Lanyard API'den veri çekme
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

  // Zaman güncelleme (Spotify progress için)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Resimlerin yüklenmesini bekleme fonksiyonu
  const waitForImages = (images: HTMLImageElement[]): Promise<void> => {
    const promises = images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Hata durumunda devam et
      });
    });
    return Promise.all(promises).then(() => {});
  };

  // Ekran görüntüsü alma fonksiyonu
  const captureScreenshot = async () => {
    if (!cardRef.current) return;

    const images = Array.from(cardRef.current.querySelectorAll('img'));
    await waitForImages(images);

    html2canvas(cardRef.current, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
    })
      .then((canvas) => {
        const pngData = canvas.toDataURL('image/png');
        setImageUrl(pngData);
      })
      .catch((err) => {
        console.error('Resim oluşturulurken hata oluştu:', err);
      });
  };

  // Veri veya zaman değiştiğinde ekran görüntüsü al
  useEffect(() => {
    if (!data || !cardRef.current) return;

    const timeoutId = setTimeout(() => {
      captureScreenshot();
    }, 100); // Render için kısa bir gecikme

    return () => clearTimeout(timeoutId);
  }, [data, currentTime]);

  if (!data || error) {
    return <div>{error || 'Yükleniyor...'}</div>;
  }

  const { discord_user, activities, discord_status, listening_to_spotify, spotify } = data;
  const displayName = discord_user.display_name || discord_user.global_name || discord_user.username;
  const avatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp?size=1024`;

  // Custom status
  const customActivity = activities.find(
    (act) => act.id === 'custom' && act.state && act.state.trim() !== ''
  );
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
            crossOrigin="anonymous"
          />
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">{spotify.song}</h3>
            <p className="text-xs text-gray-300">
              {spotify.artist} · {spotify.album}
            </p>
          </div>
          <div className="ml-2">
            <img
              src="/badges/spotify.png"
              alt="Spotify"
              className="w-6 h-6"
              crossOrigin="anonymous"
            />
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

  return (
    <div className="text-white">
      {/* Discord kartı */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl relative p-6"
      >
        <div className="flex items-center">
          <div className="relative w-20 h-20">
            <img
              src={avatarUrl}
              alt={discord_user.username}
              className="w-full h-full rounded-full border-4 border-gray-800 object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute bottom-0 right-0 bg-gray-900 rounded-full p-1">
              {getStatusIcon(discord_status)}
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-white">{displayName}</h2>
            <p className="text-sm text-gray-300">{discord_user.username}</p>
            <div className="mt-2 bg-gray-900 inline-flex items-center px-2 py-1 rounded-lg">
              {badgeMapping.map((mapping, index) => (
                <img
                  key={index}
                  src={mapping.img}
                  alt="rozet"
                  className="w-5 h-5 mr-2 last:mr-0"
                  crossOrigin="anonymous"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Custom Status */}
        {customState && (
          <div className="absolute top-6 right-6">
            <div className="relative">
              <div
                className="bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg"
                style={{ maxWidth: '180px', wordBreak: 'break-word' }}
              >
                {customState}
              </div>
            </div>
          </div>
        )}

        {/* Spotify Kartı */}
        {spotifyCard}
      </motion.div>

      {/* Oluşturulan PNG Önizlemesi */}
      {imageUrl && (
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Oluşturulan Discord Kartı Resmi:</h3>
          <img
            src={imageUrl}
            alt="Discord Card"
            className="mx-auto rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default DiscordCardImage;
