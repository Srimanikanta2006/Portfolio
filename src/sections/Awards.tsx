import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const awardsData = [
  {
    title: "Top 20 Teams",
    event: "Whackiest 24-Hour Hackathon",
    year: "MSRIT, 2024",
    icon: "🏅",
    accent: "#f59e0b" // gold
  },
  {
    title: "2× Prize Winner",
    event: "MSRIT Tech Fest",
    year: "2024–2025",
    icon: "🥇",
    accent: "#00d4ff" // cyan
  },
  {
    title: "Prompt Eng. Certified",
    event: "DeepLearning.AI – Andrew Ng",
    year: "2025",
    icon: "📜",
    accent: "#7c3aed" // purple
  }
];

const Awards = () => {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    gsap.fromTo(cardsRef.current, 
      { y: 60, opacity: 0 },
      {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%'
        },
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out'
      }
    );
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-24 container mx-auto px-6 md:px-12 z-20" id="awards">
      <div className="md:w-[80%] lg:w-[70%]">
        <h2 className="section-title mb-16">
          <span>Key</span> <span className="highlight">Achievements</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 pt-4">
          {awardsData.map((award, i) => (
            <div 
              key={award.title}
              ref={el => { cardsRef.current[i] = el; }}
              className="award-card"
              style={{ '--accent': award.accent } as React.CSSProperties}
            >
              <div className="award-icon">{award.icon}</div>
              <h3 className="award-title">{award.title}</h3>
              <div className="award-event">{award.event}</div>
              <p className="award-year">{award.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;
