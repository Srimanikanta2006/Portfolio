import { useEffect, useRef } from 'react';
// anime ESM mapping
import anime from 'animejs/lib/anime.es.js';
import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const statsData = [
  { value: 9.13, label: "CGPA", isFloat: true },
  { value: 6, label: "Projects Built" },
  { value: 2, label: "Hackathons" },
  { value: 3, label: "Awards Won" }
];

const Stats = () => {
  const containerRef = useRef<HTMLElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        countersRef.current.forEach((el, index) => {
          if (!el) return;
          const targetValue = statsData[index].value;
          const isFloat = statsData[index].isFloat;
          
          anime({
            targets: el,
            innerHTML: [0, targetValue],
            easing: 'easeOutExpo',
            round: isFloat ? 100 : 1, // Anime.js internal rounding, 100 round makes 2 decimals
            duration: 2000,
            delay: index * 200,
            update: function() {
              if (isFloat) {
                // Formatting for decimal since animejs round might just round to nearest int otherwise
                const val = parseFloat(el.innerHTML);
                el.innerHTML = val.toFixed(2);
              }
            }
          });
        });
      }
    });

  }, []);

  return (
    <section ref={containerRef} className="stats-section w-full relative z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)]" id="stats">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-20" />
      
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="stats-grid">
          {statsData.map((stat, i) => (
            <div key={stat.label} className="stat-item">
              <span 
                ref={el => { countersRef.current[i] = el; }}
                className="stat-number"
              >
                0{stat.isFloat ? '.00' : ''}
              </span>
              <span className="stat-label">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
