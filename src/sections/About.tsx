import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import anime from 'animejs/lib/anime.es.js';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

const TechTicker = () => {
  const techStack = [
    'Java', 'JavaScript', 'C', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap',
    'Git', 'GitHub', 'Node.js', 'Python', 'React', 'DSA', 'OOP', 'Three.js',
    'Streamlit', 'Leaflet.js'
  ];

  return (
    <div className="marquee-wrapper mt-12 bg-bg-card border-y border-border-glow relative z-20">
      <div className="marquee-track">
        {[...techStack, ...techStack].map((tech, i) => (
          <div key={i + '-' + tech} className="flex items-center space-x-6">
            <span className="font-mono text-accent-cyan text-sm whitespace-nowrap">{tech}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
          </div>
        ))}
      </div>
    </div>
  );
};

function TorusKnotScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fn = (e: MouseEvent) => setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * -2
    });
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.3 + mousePos.y * 0.4;
      meshRef.current.rotation.y = t * 0.4 + mousePos.x * 0.5;
      const scale = 1 + Math.sin(t * 1.2) * 0.04;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Main torus knot */}
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.5, 0.4, 128, 32]} />
        <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.25} />
      </mesh>
      {/* Wireframe overlay */}
      <mesh rotation={[0.3, 0.5, 0]}>
        <torusKnotGeometry args={[1.52, 0.42, 128, 32]} />
        <meshBasicMaterial color="#7c3aed" wireframe transparent opacity={0.12} />
      </mesh>
      {/* Orbiting particle ring */}
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#00d4ff" transparent opacity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

const facts = [
  { icon: '⚽', text: 'Football player — left foot dominant, naturally left-handed in everything', accent: '#10b981' },
  { icon: '🔧', text: 'I break things apart to understand them, then build something better', accent: '#f59e0b' },
  { icon: '🎮', text: 'Built a real-time 3D particle system controlled by hand gestures via webcam', accent: '#7c3aed' },
  { icon: '📍', text: 'CS undergrad at MSRIT Bengaluru — batch 2028, CGPA 9.13', accent: '#00d4ff' },
];

const About = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const factsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      const chars = titleRef.current.innerText.split('');
      titleRef.current.innerHTML = '';
      chars.forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        span.className = 'inline-block opacity-0 translate-y-full';
        titleRef.current?.appendChild(span);
      });

      gsap.to(titleRef.current.querySelectorAll('span'), {
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
        y: 0,
        opacity: 1,
        stagger: 0.05,
        ease: 'back.out(1.7)',
        duration: 0.8
      });
    }

    if (termRef.current) {
      ScrollTrigger.create({
        trigger: termRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const lines = termRef.current?.querySelectorAll('p');
          if (lines) {
            anime({
              targets: lines,
              opacity: [0, 1],
              translateX: [-10, 0],
              duration: 800,
              delay: anime.stagger(400),
              easing: 'easeOutExpo'
            });
          }
        }
      });
    }

    if (factsRef.current) {
      gsap.fromTo(factsRef.current.children,
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: factsRef.current,
            start: 'top 85%'
          },
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.6,
          ease: 'power2.out'
        }
      );
    }
  }, []);

  return (
    <section className="relative w-full min-h-screen py-24 flex flex-col justify-center" id="about">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center pt-10">

        {/* Left Column: 3D Torus Knot + Terminal */}
        <div className="w-full relative flex flex-col items-center">
          <div className="w-full h-[350px] mb-8 relative">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <TorusKnotScene />
            </Canvas>
            <div className="absolute inset-0 bg-accent-cyan opacity-5 blur-[80px] rounded-full pointer-events-none" />
          </div>

          {/* Terminal Card */}
          <div ref={termRef} className="w-full bg-[#030712] border border-border-subtle rounded-md shadow-lg overflow-hidden font-mono text-[13px] md:text-sm">
            <div className="flex items-center px-4 py-2 bg-[#080f1f] border-b border-border-subtle gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="w-3 h-3 rounded-full bg-[#eab308]" />
              <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
              <span className="ml-2 text-text-dim text-xs">srimanikanta@portfolio ~</span>
            </div>
            <div className="p-5 flex flex-col gap-2 text-[#00d4ff]">
              <p className="opacity-0"><span className="text-[#a855f7]">const</span> <span className="text-[#3b82f6]">name</span> = <span className="text-[#22c55e]">"P. Srimanikanta"</span>;</p>
              <p className="opacity-0"><span className="text-[#a855f7]">const</span> <span className="text-[#3b82f6]">role</span> = <span className="text-[#22c55e]">"Full-Stack Developer"</span>;</p>
              <p className="opacity-0"><span className="text-[#a855f7]">const</span> <span className="text-[#3b82f6]">location</span> = <span className="text-[#22c55e]">"Bengaluru, India"</span>;</p>
              <p className="opacity-0"><span className="text-[#a855f7]">const</span> <span className="text-[#3b82f6]">cgpa</span> = <span className="text-[#f59e0b]">9.13</span>;</p>
              <p className="opacity-0">&gt; status: <span className="text-bg-primary bg-accent-cyan px-1">Available for Internships ✓</span></p>
              <p className="opacity-0 animate-[pulse_1s_infinite]">_</p>
            </div>
          </div>
        </div>

        {/* Right Column: Text + Bento Grid */}
        <div className="w-full">
          <span className="section-label">GET TO KNOW ME</span>
          <h2 ref={titleRef} className="section-title mb-8">
            <span>About </span><span className="highlight">Me</span>
          </h2>

          <p className="text-lg text-text-secondary leading-relaxed mb-10 border-l-2 border-accent-cyan pl-6">
            A Computer Science undergraduate at MSRIT Bengaluru, constantly building things that shouldn't exist yet. I've trained AI models that understand Kannada emotions, mapped ocean float data for India's coastline, and built crowd monitoring systems in 24 hours. I don't just write code — I engineer experiences.
          </p>

          {/* Fun facts — 2x2 bento grid */}
          <div ref={factsRef} className="about-bento">
            {facts.map((fact, i) => (
              <div key={i} className="bento-card" style={{ '--card-accent': fact.accent } as React.CSSProperties}>
                <span className="bento-icon">{fact.icon}</span>
                <p className="bento-text">{fact.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <TechTicker />
    </section>
  );
};

export default About;
