import React, { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Header from './components/Header';
import DiscordCard from './components/DiscordCard';
import GitHubRepos from './components/GitHubRepos';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import MusicPlayer from './components/MusicPlayer';
import { ChevronDown } from 'react-icons/hi';

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
      
      {/* Sağ alttaki temel AudioPlayer (örneğin arka plan müziği için) */}
      <AudioPlayer audioSrc="/music/music.mp3" />
      
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
        {/* ... Hero içerikleri ... */}
      </section>
      
      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900">
        {/* ... About içerikleri ... */}
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
      
      {/* Müzik Arama ve Çalma Bölümü */}
      <section id="music" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <MusicPlayer />
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <ContactSection />
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

export default App;
