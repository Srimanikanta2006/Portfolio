import { useEffect, useRef, useState } from 'react';
// anime ESM mapping
import anime from 'animejs/lib/anime.es.js';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const loadingTexts = [
  "Initializing...",
  "Loading projects...",
  "Almost there...",
  "Ready."
];

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [textIndex, setTextIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Text cycle interval
    const textInterval = setInterval(() => {
      setTextIndex(prev => {
        if (prev < loadingTexts.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    // 2. Anime.js SVG Line Draw
    if (svgRef.current) {
      anime({
        targets: svgRef.current.querySelectorAll('path'),
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 2000,
        delay: function(_el: unknown, i: number) { return i * 250 },
        direction: 'alternate',
        loop: false
      });
    }

    // 3. Anime.js Progress Bar
    if (barRef.current) {
      anime({
        targets: barRef.current,
        width: ['0%', '100%'],
        easing: 'easeInOutQuart',
        duration: 2500,
        complete: () => {
          // Trigger the dramatic split
          if (containerRef.current) {
            const leftHalf = containerRef.current.querySelector('.split-left');
            const rightHalf = containerRef.current.querySelector('.split-right');
            const content = containerRef.current.querySelector('.preloader-content');
            
            // Fade out content quickly
            gsap.to(content, { opacity: 0, duration: 0.3 });

            // Split halves
            gsap.to(leftHalf, { x: '-100%', duration: 1, ease: 'power4.inOut', delay: 0.2 });
            gsap.to(rightHalf, { x: '100%', duration: 1, ease: 'power4.inOut', delay: 0.2, onComplete: () => {
              onComplete();
            }});
          }
        }
      });
    }

    return () => clearInterval(textInterval);
  }, [onComplete]);

  // Lock body scroll while parsing
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    }
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Splits */}
      <div className="split-left absolute left-0 top-0 w-1/2 h-full bg-bg-primary shadow-[10px_0_30px_rgba(0,212,255,0.1)] z-10 border-r border-border-subtle" />
      <div className="split-right absolute right-0 top-0 w-1/2 h-full bg-bg-primary z-10" />

      {/* Content */}
      <div className="preloader-content relative z-20 flex flex-col items-center gap-8 px-4 w-full max-w-sm">
        {/* Monogram SVG using path data for 'S' and 'M' */}
        <svg ref={svgRef} className="w-32 h-auto text-accent-cyan" style={{ filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.5))' }} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* 'S' path */}
          <path d="M 45 25 C 20 25, 20 50, 45 50 C 70 50, 70 75, 45 75 C 20 75, 25 65, 30 65" />
          {/* 'M' path */}
          <path d="M 60 75 L 60 25 L 75 50 L 90 25 L 90 75" />
        </svg>

        {/* Loading Bar */}
        <div className="w-full h-[1px] bg-border-subtle relative overflow-hidden rounded-full">
          <div ref={barRef} className="absolute left-0 top-0 h-full bg-accent-cyan w-0" style={{ boxShadow: 'var(--glow-shadow)' }}></div>
        </div>

        {/* Text */}
        <div className="text-accent-cyan font-mono text-sm tracking-widest uppercase opacity-80 h-4">
          {loadingTexts[textIndex]}
        </div>
      </div>
    </div>
  );
};

export default Preloader;
