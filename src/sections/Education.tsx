import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import anime from 'animejs/lib/anime.es.js';
import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import * as THREE from 'three';

const timelineData = [
  { year: "2024", text: "Joined MSRIT — began competitive programming & DSA" },
  { year: "2024", text: "Top 20 at Whackiest 24-Hour Hackathon (CrowdMapper)" },
  { year: "2025", text: "Built FloatChat for Smart India Hackathon" },
  { year: "2025", text: "Deployed Kannada Sentiment AI — 93% accuracy" },
  { year: "2025", text: "2× Prize Winner at MSRIT College Tech Fest" },
  { year: "2028", text: "Expected Graduation — B.E. ISE" },
];

function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.25;
    }
  });

  const STEPS = 20;
  const strandA: [number, number, number][] = [];
  const strandB: [number, number, number][] = [];
  const rungs: { a: [number, number, number]; b: [number, number, number] }[] = [];

  for (let i = 0; i < STEPS; i++) {
    const t = (i / STEPS) * Math.PI * 6;
    const y = (i / STEPS) * 8 - 4;
    strandA.push([Math.cos(t) * 0.8, y, Math.sin(t) * 0.8]);
    strandB.push([Math.cos(t + Math.PI) * 0.8, y, Math.sin(t + Math.PI) * 0.8]);
    if (i % 2 === 0) {
      rungs.push({
        a: [Math.cos(t) * 0.8, y, Math.sin(t) * 0.8],
        b: [Math.cos(t + Math.PI) * 0.8, y, Math.sin(t + Math.PI) * 0.8]
      });
    }
  }

  return (
    <group ref={groupRef}>
      {strandA.map((pos, i) => (
        <mesh key={`a${i}`} position={pos}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.7} />
        </mesh>
      ))}
      {strandB.map((pos, i) => (
        <mesh key={`b${i}`} position={pos}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.7} />
        </mesh>
      ))}
      {rungs.map((r, i) => {
        const mid: [number, number, number] = [
          (r.a[0] + r.b[0]) / 2,
          (r.a[1] + r.b[1]) / 2,
          (r.a[2] + r.b[2]) / 2
        ];
        const len = Math.sqrt((r.b[0] - r.a[0]) ** 2 + (r.b[2] - r.a[2]) ** 2);
        const angle = Math.atan2(r.b[2] - r.a[2], r.b[0] - r.a[0]);
        return (
          <mesh key={`r${i}`} position={mid} rotation={[0, -angle, 0]}>
            <boxGeometry args={[len, 0.02, 0.02]} />
            <meshBasicMaterial color="#00d4ff" transparent opacity={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

const Education = () => {
  const svgRef = useRef<SVGCircleElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ringRef.current && svgRef.current) {
      ScrollTrigger.create({
        trigger: ringRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          anime({
            targets: svgRef.current,
            strokeDashoffset: [339.29, 339.29 - (0.913 * 339.29)],
            easing: 'easeOutExpo',
            duration: 2000,
            delay: 300
          });
        }
      });
    }

    if (timelineRef.current) {
      const items = timelineRef.current.querySelectorAll('li');
      ScrollTrigger.create({
        trigger: timelineRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.fromTo(items,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, stagger: 0.2, duration: 0.8, ease: "back.out(1.5)" }
          );

          anime({
            targets: timelineRef.current?.querySelectorAll('.timeline-dot'),
            scale: [0, 1],
            opacity: [0, 1],
            delay: anime.stagger(200),
            duration: 800,
            easing: 'spring(1, 80, 10, 0)'
          });
        }
      });
    }
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-24 min-h-screen flex flex-col justify-center container mx-auto px-6 md:px-12" id="education">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* LEFT: Institution Card */}
        <div>
          <span className="section-label">ACADEMIC JOURNEY</span>
          <h2 className="section-title mb-12">
            <span>Academic </span><span className="highlight">Journey</span>
          </h2>

          {/* Main Card */}
          <div className="bg-gradient-to-br from-[#0d1730] to-[#080f1f] border border-border-subtle rounded-2xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00d4ff] to-[#7c3aed]" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-cyan opacity-5 blur-[80px] rounded-full" />

            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 relative z-10">
              <div>
                <h3 className="text-2xl font-heading text-text-primary mb-2">Ramaiah Institute of Technology (MSRIT)</h3>
                <p className="text-lg text-text-primary mb-1">B.E. in Information Science & Engineering</p>
                <p className="text-text-secondary font-mono text-sm mb-6">2024 &mdash; 2028 | Bengaluru, India</p>

                <div className="flex flex-wrap gap-2">
                  {["OOP", "DSA", "Discrete Mathematics", "DBMS", "OS"].map(c => (
                    <span key={c} className="px-3 py-1 bg-bg-primary border border-border-subtle text-[13px] font-mono text-text-secondary rounded-full shadow-[inset_0_0_8px_rgba(255,255,255,0.02)]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Circular Progress Ring */}
              <div ref={ringRef} className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_10px_rgba(0,212,255,0.3)]">
                  <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle
                    ref={svgRef}
                    cx="64" cy="64" r="54"
                    fill="none"
                    stroke="#00d4ff"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="339.29"
                    strokeDashoffset="339.29"
                  />
                </svg>
                <div className="flex flex-col items-center justify-center absolute">
                  <span className="text-3xl font-display font-bold text-text-primary">9.13</span>
                  <span className="text-[10px] font-mono text-text-dim uppercase tracking-wider">/ 10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline below card */}
          <ul ref={timelineRef} className="relative flex flex-col space-y-6 mt-12 pl-8 border-l-[1.5px] border-gradient-to-b from-[#00d4ff] to-transparent" style={{ borderImage: 'linear-gradient(to bottom, #00d4ff, rgba(124,58,237,0.3), transparent) 1' }}>
            {timelineData.map((item, idx) => (
              <li key={idx} className="relative flex flex-col gap-1 pl-6 group">
                <div className="timeline-dot absolute left-[-2.3rem] top-[4px] w-[8px] h-[8px] rounded-full bg-[#00d4ff] shadow-[0_0_12px_#00d4ff] opacity-0 scale-0" />
                <div className="text-[#00d4ff] font-mono text-sm font-semibold">{item.year}</div>
                <div className="text-text-secondary text-sm leading-relaxed">{item.text}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: DNA Helix 3D */}
        <div className="w-full h-[600px] relative hidden lg:block">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <DNAHelix />
          </Canvas>
          <div className="absolute inset-0 bg-accent-cyan opacity-3 blur-[100px] rounded-full pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default Education;
