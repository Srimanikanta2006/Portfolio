import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
// anime ESM mapping
import anime from 'animejs/lib/anime.es.js';
import './Hero.css';

function useTypewriter(words: string[], speed = 80, deleteSpeed = 40, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && display === current) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && display === '') {
      setIsDeleting(false);
      setWordIndex(i => i + 1);
      timeout = setTimeout(() => {}, 300);
    } else {
      const next = isDeleting
        ? current.slice(0, display.length - 1)
        : current.slice(0, display.length + 1);
      timeout = setTimeout(() => setDisplay(next), isDeleting ? deleteSpeed : speed);
    }
    return () => clearTimeout(timeout);
  }, [display, isDeleting, wordIndex, words, speed, deleteSpeed, pause]);

  return display;
}

const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  const typed = useTypewriter([
    'Full-Stack Developer',
    'Problem Solver',
    'Builder of Things that Matter',
    'Open Source Enthusiast'
  ]);

  useEffect(() => {
    // Letter stagger entrance
    if (titleRef.current) {
      anime({
        targets: titleRef.current.querySelectorAll('.hero-letter'),
        translateY: [100, 0],
        opacity: [0, 1],
        rotateZ: [10, 0],
        duration: 2000,
        delay: anime.stagger(40, { start: 2500 }), // Wait for preloader
        easing: 'easeOutElastic(1, 0.5)'
      });
    }

    // Looping glitch effect for title
    const glitchInterval = setInterval(() => {
      if (titleRef.current) {
        titleRef.current.classList.add('glitch-active');
        setTimeout(() => {
          titleRef.current?.classList.remove('glitch-active');
        }, 300);
      }
    }, 8000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <section className="relative w-full h-[100vh] flex flex-col justify-center px-6 md:px-16" id="hero">
      <div className="w-full md:w-[65%] z-20 flex flex-col items-start pt-20">
        
        {/* Line 1 */}
        <div className="font-mono text-accent-cyan text-sm md:text-base border border-border-glow px-3 py-1 rounded-sm bg-[#00d4ff10] shadow-[0_0_15px_rgba(0,212,255,0.1)] mb-6 animate-fade-in [animation-delay:2.5s]">
          &lt; Hello World /&gt;
        </div>

        {/* GIANT NAME — THIS MUST RENDER */}
        <h1 className="hero-name" ref={titleRef}>Srimanikanta</h1>

        {/* TYPEWRITER — cursor MUST be inline-flex with text */}
        <div className="flex items-center text-xl md:text-3xl font-heading text-accent-blue mt-4 min-h-[40px]">
          <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span className="text-text-secondary mr-2">{'>'}</span>
            <span className="text-accent-cyan [text-shadow:0_0_15px_#00d4ff] whitespace-nowrap">{typed}</span>
            <span style={{ 
              display: 'inline-block', width: '2px', height: '1.2em', 
              background: '#00d4ff', marginLeft: '4px',
              animation: 'cursor-blink 1s step-end infinite'
            }} />
          </div>
        </div>

        {/* TAGLINE */}
        <p className="mt-8 text-lg md:text-xl text-text-secondary max-w-xl font-sans leading-relaxed animate-fade-in-up [animation-delay:3s] opacity-0 [animation-fill-mode:forwards]">
          Turning caffeine into code and ideas into impact.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-wrap items-center gap-6 mt-12 animate-fade-in-up [animation-delay:3.2s] opacity-0 [animation-fill-mode:forwards]">
          <a href="#projects" className="relative px-8 py-3 bg-accent-cyan text-bg-primary font-bold overflow-hidden transition-all duration-300 shadow-[0_8px_30px_rgba(0,212,255,0.35)]"
          onMouseEnter={e => { e.currentTarget.style.transform='scale(1.04)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(0,212,255,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 8px 30px rgba(0,212,255,0.35)'; }}
          >
            Explore My Work &rarr;
          </a>
          <a href="/public/Srimanikanta_Resume.pdf" download className="relative px-8 py-3 border border-accent-cyan text-accent-cyan transition-all duration-300 font-bold flex items-center gap-2"
            onMouseEnter={e => { e.currentTarget.style.background='rgba(0,212,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}
          >
             <Download size={18} className="group-hover:-translate-y-1 transition-transform" /> Download Resume &darr;
          </a>
        </div>

        {/* SOCIAL ICONS ROW */}
        <div className="flex items-center gap-5 mt-10 animate-fade-in-up [animation-delay:3.4s] opacity-0 [animation-fill-mode:forwards]">
          {[
            { label: 'GitHub', href: 'https://github.com/Srimanikanta2006', icon: 'GH' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/srimanikanta-pothu-a8899b237/', icon: 'in' },
            { label: 'Email', href: 'mailto:srimanikantapothu@gmail.com', icon: '@' },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
              className="w-10 h-10 rounded-full border border-[rgba(0,212,255,0.3)] flex items-center justify-center text-[#7a9bbf] font-mono text-sm transition-all duration-300 bg-[rgba(0,212,255,0.05)]"
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#00d4ff';
                e.currentTarget.style.color = '#00d4ff';
                e.currentTarget.style.boxShadow = '0 0 16px rgba(0,212,255,0.4)';
                e.currentTarget.style.background = 'rgba(0,212,255,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
                e.currentTarget.style.color = '#7a9bbf';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(0,212,255,0.05)';
              }}
            >{s.icon}</a>
          ))}
        </div>

        {/* Scroll down hint */}
        <div className="absolute bottom-10 left-10 flex flex-col items-center gap-2 opacity-0 animate-fade-in [animation-delay:4s] [animation-fill-mode:forwards]">
          <span className="text-xs font-mono text-text-dim uppercase tracking-widest writing-vertical-rl rotate-180">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-text-dim to-transparent" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
