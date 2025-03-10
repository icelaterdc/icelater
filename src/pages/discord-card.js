// Discord Card PNG Generator - public/card/discord-card.js
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Discord User ID
const DISCORD_USER_ID = '991409937022468169';

// Rozet ve durum ikon mapping tanımları
const badgeMapping = [
  { bit: 1, img: "/badges/brilliance.png" },
  { bit: 2, img: "/badges/aktif_gelistirici.png" },
  { bit: 4, img: "/badges/eski_isim.png" },
  { bit: 8, img: "/badges/gorev_tamamlandi.png" }
];

// Yardımcı fonksiyonlar
const formatDurationMs = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Resimleri yükleme yardımcı fonksiyonu
async function loadImageSafely(src) {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const imgPath = path.join(publicDir, src.replace(/^\//, ''));
    
    if (fs.existsSync(imgPath)) {
      return await loadImage(imgPath);
    } else {
      console.warn(`Image not found at path: ${imgPath}`);
      // Placeholder gri kutu döndür
      const canvas = createCanvas(20, 20);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#4B5563';
      ctx.fillRect(0, 0, 20, 20);
      return canvas;
    }
  } catch (err) {
    console.error(`Error loading image from ${src}:`, err);
    // Placeholder gri kutu döndür
    const canvas = createCanvas(20, 20);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#4B5563';
    ctx.fillRect(0, 0, 20, 20);
    return canvas;
  }
}

// Ana fonksiyon - Discord kartını oluşturur
async function generateDiscordCard() {
  try {
    // Lanyard API'den veri çekme
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    if (!json.success) throw new Error('API response unsuccessful');
    
    const data = json.data;
    const { discord_user, activities, discord_status, listening_to_spotify, spotify } = data;
    const displayName = discord_user.display_name || discord_user.global_name || discord_user.username;
    const avatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.webp?size=1024`;
    
    // Custom status bulma
    const customActivity = activities.find(act => act.id === "custom" && act.state && act.state.trim() !== "");
    const customState = customActivity ? customActivity.state : null;
    
    // Bir aktivite bul (custom status dışında)
    const currentActivity = activities.find((a) => a.type !== 4);

    // Canvas oluştur
    const canvas = createCanvas(400, 300);
    const ctx = canvas.getContext('2d');
    
    // Arka plan gradient
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, '#1F2937'); // from-gray-800
    gradient.addColorStop(1, '#111827'); // to-gray-900
    
    // Ana kart arka planı
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, 400, 300, 15);
    ctx.fill();
    
    // Profil avatarını yükle ve çiz
    let avatarImg;
    try {
      avatarImg = await loadImage(avatarUrl);
    } catch (err) {
      console.error("Avatar yüklenemedi, placeholder kullanılıyor", err);
      avatarImg = await loadImageSafely('/placeholder-avatar.png');
    }
    
    // Avatar çizimi (yuvarlak)
    ctx.save();
    ctx.beginPath();
    ctx.arc(50, 50, 30, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImg, 20, 20, 60, 60);
    ctx.restore();
    
    // Durum ikonunu yükle ve çiz
    const statusIcon = await loadImageSafely(`/statusIcon/${discord_status}.png`);
    ctx.beginPath();
    ctx.arc(72, 72, 10, 0, Math.PI * 2, true);
    ctx.fillStyle = '#111827';
    ctx.fill();
    ctx.drawImage(statusIcon, 64, 64, 16, 16);
    
    // Kullanıcı adı ve görünen adı
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillStyle = 'white';
    ctx.fillText(displayName, 100, 35);
    
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#D1D5DB';
    ctx.fillText(discord_user.username, 100, 55);
    
    // Rozetler
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.roundRect(100, 65, 120, 24, 8);
    ctx.fill();
    
    let badgeX = 105;
    // Sadece kullanıcıda olan rozetleri çiziyoruz
    if (discord_user.public_flags) {
      for (const badge of badgeMapping) {
        if (discord_user.public_flags & badge.bit) {
          const badgeImg = await loadImageSafely(badge.img);
          ctx.drawImage(badgeImg, badgeX, 69, 16, 16);
          badgeX += 20;
        }
      }
    }
    
    // Custom Status (varsa)
    if (customState) {
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.roundRect(250, 20, 130, 30, 8);
      ctx.fill();
      
      // Custom status metni
      ctx.font = '12px Arial, sans-serif';
      ctx.fillStyle = 'white';
      
      // Uzun metinleri kırp
      let statusText = customState;
      if (statusText.length > 20) {
        statusText = statusText.substring(0, 17) + '...';
      }
      
      ctx.fillText(statusText, 260, 40);
      
      // Bağlantı noktaları
      ctx.beginPath();
      ctx.arc(242, 42, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#374151';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(234, 46, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#374151';
      ctx.fill();
    }
    
    // Spotify kartı (varsa)
    if (listening_to_spotify && spotify) {
      // Spotify container
      ctx.fillStyle = 'rgba(55, 65, 81, 0.5)';
      ctx.beginPath();
      ctx.roundRect(20, 110, 360, 110, 16);
      ctx.fill();
      
      // Album cover
      let albumImg;
      try {
        albumImg = await loadImage(spotify.album_art_url);
      } catch (err) {
        console.error("Spotify album cover yüklenemedi", err);
        albumImg = await loadImageSafely('/placeholder-album.png');
      }
      
      ctx.beginPath();
      ctx.roundRect(35, 125, 60, 60, 8);
      ctx.clip();
      ctx.drawImage(albumImg, 35, 125, 60, 60);
      ctx.restore();
      
      // Spotify bilgileri
      ctx.font = 'bold 14px Arial, sans-serif';
      ctx.fillStyle = 'white';
      
      // Şarkı adı - Uzunsa kırp
      let songTitle = spotify.song;
      if (songTitle.length > 28) {
        songTitle = songTitle.substring(0, 25) + '...';
      }
      ctx.fillText(songTitle, 105, 140);
      
      // Sanatçı ve albüm
      ctx.font = '12px Arial, sans-serif';
      ctx.fillStyle = '#D1D5DB';
      
      // Artist ve albüm - Uzunsa kırp
      let artistAlbum = `${spotify.artist} · ${spotify.album}`;
      if (artistAlbum.length > 40) {
        artistAlbum = artistAlbum.substring(0, 37) + '...';
      }
      ctx.fillText(artistAlbum, 105, 160);
      
      // Spotify ikonu
      const spotifyIcon = await loadImageSafely('/badges/spotify.png');
      ctx.drawImage(spotifyIcon, 350, 130, 24, 24);
      
      // İlerleme çubuğu
      const { start, end } = spotify.timestamps;
      const totalDuration = end - start;
      const elapsed = Math.min(Math.max(Date.now() - start, 0), totalDuration);
      const progressPercent = (elapsed / totalDuration);
      
      // İlerleme çubuğu arka planı
      ctx.fillStyle = '#4B5563';
      ctx.beginPath();
      ctx.roundRect(35, 185, 330, 8, 4);
      ctx.fill();
      
      // İlerleme çubuğu dolumu
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.roundRect(35, 185, 330 * progressPercent, 8, 4);
      ctx.fill();
      
      // Zaman bilgileri
      ctx.font = '10px Arial, sans-serif';
      ctx.fillStyle = '#10B981';
      ctx.fillText(formatDurationMs(elapsed), 35, 205);
      ctx.fillText(formatDurationMs(totalDuration), 365 - ctx.measureText(formatDurationMs(totalDuration)).width, 205);
      
    } else if (currentActivity) {
      // Aktivite Kartı
      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.roundRect(20, 110, 360, 70, 8);
      ctx.fill();
      
      // Aktivite resmi
      let activityImg;
      if (currentActivity.assets?.large_image) {
        try {
          // Eğer CDN ile başlıyorsa
          let imageUrl = currentActivity.assets.large_image;
          if (imageUrl.startsWith('mp:')) {
            imageUrl = imageUrl.replace('mp:', 'https://media.discordapp.net/');
          }
          activityImg = await loadImage(imageUrl);
        } catch (err) {
          console.error("Aktivite resmi yüklenemedi", err);
          activityImg = await loadImageSafely('/placeholder-activity.png');
        }
      } else {
        activityImg = await loadImageSafely('/placeholder-activity.png');
      }
      
      ctx.beginPath();
      ctx.roundRect(35, 120, 50, 50, 8);
      ctx.clip();
      ctx.drawImage(activityImg, 35, 120, 50, 50);
      ctx.restore();
      
      // Aktivite adı
      ctx.font = '600 14px Arial, sans-serif';
      ctx.fillStyle = '#60A5FA';
      ctx.fillText(currentActivity.name, 95, 135);
      
      // Aktivite detayları
      if (currentActivity.details) {
        ctx.font = '12px Arial, sans-serif';
        ctx.fillStyle = '#D1D5DB';
        
        let details = currentActivity.details;
        if (details.length > 40) {
          details = details.substring(0, 37) + '...';
        }
        ctx.fillText(details, 95, 155);
      }
      
      // Aktivite durumu
      if (currentActivity.state) {
        ctx.font = '12px Arial, sans-serif';
        ctx.fillStyle = '#6B7280';
        
        let state = currentActivity.state;
        if (state.length > 40) {
          state = state.substring(0, 37) + '...';
        }
        ctx.fillText(state, 95, 175);
      }
    }
    
    // PNG olarak kaydet
    const buffer = canvas.toBuffer('image/png');
    const publicDir = path.join(process.cwd(), 'public');
    const cardDir = path.join(publicDir, 'card');
    
    // Klasör yoksa oluştur
    if (!fs.existsSync(cardDir)) {
      fs.mkdirSync(cardDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(cardDir, 'discord-card.png'), buffer);
    console.log('Discord card PNG oluşturuldu: /public/card/discord-card.png');
    
    return { success: true, path: '/card/discord-card.png' };
    
  } catch (error) {
    console.error('Discord kartı oluşturulurken hata:', error);
    return { success: false, error: error.message };
  }
}

// Eğer doğrudan çalıştırılıyorsa generate et
if (require.main === module) {
  generateDiscordCard()
    .then(result => console.log(result))
    .catch(err => console.error('Error:', err));
}

module.exports = { generateDiscordCard };

