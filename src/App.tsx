import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Header from './components/Header';
import DiscordCard from './components/DiscordCard';
import GitHubRepos from './components/GitHubRepos';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import { ChevronDown } from 'lucide-react';

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    document.title = "IceLater | Full-Stack Developer";
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
        style={{ scaleX }}
      />
      
      <Header />
      
      {/* Audio Player: Sağ altta yer alan buton üzerinden müzik kontrolü */}
      <AudioPlayer audioSrc="/music/music.mp3" />
      
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-gray-900"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-16 relative z-10">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              <span className="text-blue-500">IceLater</span> | Full-Stack Developer
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-2xl"
            >
              Building modern web applications with passion and precision.
              Transforming ideas into elegant, functional digital experiences.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <DiscordCard />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex justify-center mt-12"
          >
            <a
              href="#about"
              className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
            >
              <span className="mb-2">Scroll Down</span>
              <ChevronDown className="animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <AboutSection />
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">My GitHub Projects</h2>
            <p className="text-gray-300">
              Explore my latest repositories and contributions on GitHub.
            </p>
          </div>
          
          <GitHubRepos />
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <
ContactSection />
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

export default App;


Bu da Discord botumdaki müzik oynatan basit bir kod burdan nasıl çalıştigina dair örnekler alabilirsin:

// radioCheck.js
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const GuildSettings = require('./models/guildSettings');
const Premium = require('./models/premiumSchema');

module.exports = (client) => {
    const liveUrl = 'https://www.youtube.com/live/oWW5TLrrbNo?si=DQQGXpkBS5DECj3e';
    let isPlaying = {};
    let radioQueues = new Map();

    // Radio için özel bir oynatma fonksiyonu
    async function joinAndPlay(guildId, channelId) {
        try {
            const channel = client.channels.cache.get(channelId);
            if (!channel) return;

            if (isPlaying[guildId]) return;

            // Eğer varsa mevcut queue'yu temizle
            const existingQueue = client.player.getQueue(guildId);
            if (existingQueue) {
                try {
                    existingQueue.stop();
                } catch (error) {
                    console.error('Queue durdurma hatası:', error);
                }
            }

            await client.player.play(channel, liveUrl, {
                member: channel.guild.members.cache.get(client.user.id),
                textChannel: channel
            });

            // Bu sunucu için radyo modunu işaretle
            radioQueues.set(guildId, true);
            isPlaying[guildId] = true;

            console.log('\x1b[32m%s\x1b[0m', `|    ${guildId} sunucusunda yayın başlatıldı!`);
        } catch (error) {
            console.error('Yayın başlatılırken hata oluştu:', error);
            isPlaying[guildId] = false;
            radioQueues.delete(guildId);
        }
    }

    // DisTube event'lerini yönet
    client.player.on('playSong', (queue, song) => {
        // Eğer bu sunucu radyo modundaysa, event'i gösterme
        if (radioQueues.has(queue.id)) return;
    });

    client.player.on('addSong', (queue, song) => {
        // Eğer bu sunucu radyo modundaysa, event'i gösterme
        if (radioQueues.has(queue.id)) return;
    });

    client.player.on('error', (channel, error) => {
        if (channel && channel.guild) {
            console.error(`Player hatası (${channel.guild.id}):`, error);
            isPlaying[channel.guild.id] = false;
            radioQueues.delete(channel.guild.id);
        }
    });

    client.player.on('disconnect', (queue) => {
        if (queue && queue.id) {
            console.log('\x1b[31m%s\x1b[0m', `|    ${queue.id} sunucusunda bağlantı koptu!`);
            isPlaying[queue.id] = false;
            radioQueues.delete(queue.id);
        }
    });

    // Her 10 saniyede bir kontrol
    setInterval(async () => {
        const guilds = await GuildSettings.find({ radioChannelId: { $ne: null } });
        
        for (const guild of guilds) {
            // Premium kontrolü
            const premiumData = await Premium.findOne({ premiumGuildId: guild.guildId });
            if (!premiumData || !premiumData.premiumUntil) continue;

            const channel = client.channels.cache.get(guild.radioChannelId);
            if (!channel) continue;

            const botInChannel = channel.members.has(client.user.id);
            if (!botInChannel || !isPlaying[guild.guildId]) {
                console.log('\x1b[33m%s\x1b[0m', `|    ${guild.guildId} sunucusunda yeniden bağlanılıyor...`);
                joinAndPlay(guild.guildId, guild.radioChannelId);
            }
        }
    }, 10000);
};
