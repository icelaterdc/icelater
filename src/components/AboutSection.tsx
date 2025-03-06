import React from 'react';
import { motion } from 'framer-motion';
import { Code, Server, Globe, Database, Cpu, Layers } from 'lucide-react';

const AboutSection: React.FC = () => {
  const skills = [
    { name: 'Frontend Development', icon: <Code size={20} />, description: 'React, TypeScript, HTML/CSS' },
    { name: 'Backend Development', icon: <Server size={20} />, description: 'Node.js, Express' },
    { name: 'Full-Stack Development', icon: <Layers size={20} />, description: 'JAMstack, Next.js' },
    { name: 'Database Management', icon: <Database size={20} />, description: 'MongoDB, PostgreSQL, SQLite, Supabase' },
    { name: 'DevOps', icon: <Cpu size={20} />, description: 'Docker, AWS, Azure' },
    { name: 'Web Services', icon: <Globe size={20} />, description: 'RESTful APIs, GraphQL' },
  ];

  const techLogos = [
    { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'HTML5', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'Tailwind', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'VS Code', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
    { name: 'Next.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'Express', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
    { name: 'Vite', logo: 'https://vitejs.dev/logo.svg' },
    { name: 'GraphQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
    { name: 'Supabase', logo: 'https://supabase.com/_next/image?url=%2Fimages%2Flogo-light.png&w=96&q=75' },
    { name: 'Astro', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg' },
    { name: 'SQLite', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
    { name: 'NPM', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg' },
    { name: 'Terminal', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg' },
    { name: 'Vercel', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' },
    { name: 'ESLint', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg' },
    { name: 'Discord.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/discordjs/discordjs-original.svg' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
        <p className="text-gray-300 leading-relaxed">
          I'm a passionate Full-Stack Developer with expertise in building modern web applications. 
          With a strong foundation in both frontend and backend technologies, I create seamless, 
          user-friendly experiences that solve real-world problems. My approach combines clean code, 
          performance optimization, and thoughtful design to deliver exceptional digital products.
        </p>
        <p className="text-gray-300 leading-relaxed mt-4">
          When I'm not coding, you can find me exploring new technologies, contributing to open-source 
          projects, or sharing my knowledge with the developer community. I'm constantly learning and 
          evolving my skills to stay at the forefront of web development.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Skills & Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-800/50 rounded-lg p-5 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center mb-3">
                <div className="text-blue-400 mr-3">{skill.icon}</div>
                <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
              </div>
              <p className="text-gray-400 text-sm">{skill.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-gray-800/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Technologies & Tools</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {techLogos.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex flex-col items-center justify-center bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors"
              >
                <img src={tech.logo} alt={tech.name} className="w-10 h-10 mb-2" />
                <span className="text-xs text-gray-300 text-center">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutSection;
