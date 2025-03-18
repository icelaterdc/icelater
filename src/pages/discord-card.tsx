import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/router';

// Basit bir rozet map örneği (gerekliyse)
const badgeMapping = [
  { bit: 1, img: "/badges/brilliance.png" },
  { bit: 2, img: "/badges/aktif_gelistirici.png" },
  { bit: 4, img: "/badges/eski_isim.png" },
  { bit: 8, img: "/badges/gorev_tamamlandi.png" }
];

// Discord durumu ikonunu basitçe döndüren fonksiyon
const getStatusIcon = (status: string) => {
  const iconSize = 16;
  const iconPath = `/statusIcon/${status}.png`;
  return (
    <img
      src={iconPath}
      alt={status}
      style={{
        width: `${iconSize}px`,
        height: `${iconSize}px`,
      }}
      crossOrigin="anonymous"
    />
  );
};

// Spotify süre formatı
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

// API veri tipleri
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

export default function DiscordCard() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Her 5 saniyede bir Lanyard API'den veriyi çek
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

  // Kart veya veri her güncellendiğinde, html2canvas ile ekran görüntüsünü al
  useEffect(() => {
    if (!data || !cardRef.current) return;

    // Biraz gecikme ekleyerek kartın tamamen render olmasını bekliyoruz
    const timeoutId = setTimeout(() => {
      html2canvas(cardRef.current as HTMLElement, {
        useCORS: true,
        scale: 2,
        backgroundColor: null, // Arkaplanı şeffaf yapmak için
      })
        .then((canvas) => {
          const pngData = canvas.toDataURL('image/png');
          setImageUrl(pngData);
        })
        .catch((err) => {
          console.error('Resim oluşturulurken hata oluştu:', err);
        });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [data, currentTime]);

  // Eğer data yoksa veya hata varsa sadece basit bir mesaj dön
  if (error) {
    return <div style={{ color: 'red' }}>Hata oluştu: {error}</div>;
  }
  if (!data) {
    return <div>Yükleniyor...</div>;
  }

  // Veriler
  const { discord_user, activities, discord_status, listening_to_spotify, spotify } = data;
  const displayName = discord_user.display_name || discord_user.global_name || discord_user.username;
  const avatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp?size=1024`;

  // Custom status
  const customActivity = activities.find(
    (act) => act.id === 'custom' && act.state && act.state.trim() !== ''
  );
  const customState = customActivity ? customActivity.state : null;

  // Spotify Kartı
  let spotifyCard = null;
  if (listening_to_spotify && spotify) {
    const { start, end } = spotify.timestamps;
    const totalDuration = end - start;
    const elapsed = Math.min(Math.max(currentTime - start, 0), totalDuration);
    const progressPercent = (elapsed / totalDuration) * 100;

    spotifyCard = (
      <div
        style={{
          marginTop: '10px',
          backgroundColor: 'rgba(50, 50, 50, 0.7)',
          borderRadius: '8px',
          padding: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={spotify.album_art_url}
            alt={spotify.album}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '4px',
              objectFit: 'cover',
              marginRight: '10px',
            }}
            crossOrigin="anonymous"
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>
              {spotify.song}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#ccc' }}>
              {spotify.artist} &middot; {spotify.album}
            </div>
          </div>
          <div style={{ marginLeft: '8px' }}>
            <img
              src="/badges/spotify.png"
              alt="Spotify"
              style={{ width: '24px', height: '24px' }}
              crossOrigin="anonymous"
            />
          </div>
        </div>
        <div style={{ marginTop: '8px' }}>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#444',
              borderRadius: '3px',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '6px',
                backgroundColor: '#1DB954',
                borderRadius: '3px',
                transition: 'all 1s linear',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.7rem',
              color: '#1DB954',
              marginTop: '4px',
            }}
          >
            <span>{formatDurationMs(elapsed)}</span>
            <span>{formatDurationMs(totalDuration)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Spotify harici herhangi bir aktivite
  let activityCard = null;
  if (activities.length > 0) {
    const currentActivity = activities.find((a) => a.type !== 4);
    if (currentActivity) {
      activityCard = (
        <div
          style={{
            marginTop: '10px',
            backgroundColor: '#111',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {currentActivity.assets?.large_image && (
            <img
              src={currentActivity.assets.large_image}
              alt={currentActivity.name}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '6px',
                marginRight: '8px',
                objectFit: 'cover',
              }}
              crossOrigin="anonymous"
            />
          )}
          <div>
            <div style={{ fontSize: '0.9rem', color: '#55ccff', fontWeight: 'bold' }}>
              {currentActivity.name}
            </div>
            {currentActivity.details && (
              <div style={{ fontSize: '0.8rem', color: '#ccc' }}>{currentActivity.details}</div>
            )}
            {currentActivity.state && (
              <div style={{ fontSize: '0.75rem', color: '#999' }}>{currentActivity.state}</div>
            )}
          </div>
        </div>
      );
    }
  }

  return (
    <div style={{ color: '#fff', fontFamily: 'sans-serif', padding: '20px' }}>
      <div
        ref={cardRef}
        style={{
          // arkaplanı tamamen şeffaf istiyorsanız background: 'transparent' da yapabilirsiniz
          backgroundColor: 'transparent',
          border: '1px solid #333',
          borderRadius: '10px',
          padding: '20px',
          position: 'relative',
          maxWidth: '350px',
          margin: '0 auto',
        }}
      >
        {/* Banner resmi varsa */}
        {discord_user.bannerURL && (
          <div
            style={{
              height: '80px',
              width: '100%',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
              marginBottom: '10px',
              backgroundImage: `url(${discord_user.bannerURL})`,
            }}
          />
        )}

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
            <img
              src={avatarUrl}
              alt={discord_user.username}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #222',
              }}
              crossOrigin="anonymous"
            />
            {/* Discord durumu ikonu */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#000',
                borderRadius: '50%',
                padding: '2px',
              }}
            >
              {getStatusIcon(discord_status)}
            </div>
          </div>

          <div style={{ marginLeft: '10px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{displayName}</div>
            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>@{discord_user.username}</div>

            {/* Rozetler */}
            <div style={{ marginTop: '5px', display: 'flex', gap: '4px' }}>
              {badgeMapping.map((mapping) => (
                <img
                  key={mapping.bit}
                  src={mapping.img}
                  alt="rozet"
                  style={{ width: '20px', height: '20px' }}
                  crossOrigin="anonymous"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Custom Status (konuşma balonu) */}
        {customState && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
            }}
          >
            <div
              style={{
                backgroundColor: '#333',
                color: '#fff',
                fontSize: '0.8rem',
                padding: '6px 8px',
                borderRadius: '6px',
                maxWidth: '180px',
                wordWrap: 'break-word',
              }}
            >
              {customState}
            </div>
          </div>
        )}

        {/* Spotify veya aktivite kartı */}
        {listening_to_spotify ? spotifyCard : activityCard}
      </div>

      {/* Oluşturulan resmin önizlemesi + Yeni sayfaya yönlendirme */}
      {imageUrl && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>
            Oluşturulan Discord Kartı Resmi (base64):
          </h3>
          <img
            src={imageUrl}
            alt="Discord Card"
            style={{ maxWidth: '100%', borderRadius: '10px', border: '1px solid #555' }}
          />
          <div style={{ marginTop: '10px' }}>
            {/* Yeni sayfada açmak için link */}
            <a
              href={`/discord-card-raw?image=${encodeURIComponent(imageUrl)}`}
              target="_blank"
              style={{
                color: 'lightblue',
                textDecoration: 'underline',
                fontSize: '0.9rem',
              }}
            >
              Yeni sayfada görüntüle
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
