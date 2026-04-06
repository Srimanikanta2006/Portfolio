import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    title: 'Kannada Sentiment Analysis',
    description: 'An AI that understands human emotion in Kannada — 93% accuracy across 6 emotion classes. Built with a hybrid MuRIL BERT + TF-IDF ensemble and deployed live on Streamlit Cloud.',
    tags: ['Python', 'MuRIL BERT', 'Scikit-learn', 'Streamlit', 'NLP'],
    accent: '#00d4ff',
    live: 'https://kannada-sentiment-analysis.streamlit.app/',
    github: 'https://github.com/Srimanikanta2006/Kannada-Sentiment-Analysis-Model',
    featured: true,
  },
  {
    title: 'FloatChat',
    description: 'Interactive Leaflet.js globe tracking live Argo ocean floats. Built for Smart India Hackathon with chatbot, multi-role access, and real-time safety alerts.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Leaflet.js'],
    accent: '#0ea5e9',
    live: 'https://float-chatai.netlify.app/',
    github: null,
  },
  {
    title: 'Crowd Mapper',
    description: 'Real-time crowd monitoring and mapping system — full-stack, built in 24 hours at Whackiest Hackathon. Top 20 finish.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
    accent: '#f59e0b',
    live: 'https://fluffy-elf-6064f0.netlify.app/',
    github: null,
  },
  {
    title: 'TaskIt — Task Manager',
    description: 'Priority-based task manager for teachers. DSA priority queue under the hood. Search, filter, list & grid views.',
    tags: ['HTML', 'CSS', 'JavaScript', 'DSA'],
    accent: '#10b981',
    live: 'https://task-manager-vibe-code.vercel.app/',
    github: 'https://github.com/Srimanikanta2006/Task-Manager---VibeCode',
  },
  {
    title: 'Amazon Clone',
    description: 'Pixel-accurate Amazon frontend — every layout detail reproduced from scratch. Showcases HTML/CSS mastery and responsive design.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    accent: '#ff9900',
    live: null,
    github: 'https://github.com/Srimanikanta2006/Amazon-clone',
  },
  {
    title: '3D Particle System',
    description: 'Real-time particle system controlled by webcam hand gestures. Morphs into hearts, flowers, Saturn rings & more via MediaPipe.',
    tags: ['Three.js', 'JavaScript', 'MediaPipe', 'WebGL'],
    accent: '#7c3aed',
    live: null,
    github: 'https://github.com/Srimanikanta2006/3D-Particle-Project',
  },
];

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    ref.current.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
  };

  const handleLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  };

  return (
    <div
      ref={ref}
      className="proj-card"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={() => project.live && window.open(project.live, '_blank')}
      style={{ '--card-accent': project.accent } as React.CSSProperties}
    >
      {/* Background number watermark */}
      <div className="proj-watermark">{String(index + 1).padStart(2, '0')}</div>

      {/* Top: number + links */}
      <div className="proj-top">
        <span className="proj-num">{String(index + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}</span>
        <div className="proj-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="proj-link-btn">GitHub ↗</a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="proj-link-btn proj-link-accent">Live ⇱</a>
          )}
        </div>
      </div>

      {/* Accent line */}
      <div className="proj-accent-line" />

      {/* Title */}
      <h3 className="proj-title">{project.title}</h3>

      {/* Description */}
      <p className="proj-desc">{project.description}</p>

      {/* Tags */}
      <div className="proj-tags">
        {project.tags.map(tag => (
          <span key={tag} className="proj-tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount())}`,
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="proj-section" id="projects">
      {/* Section header */}
      <div className="proj-header">
        <span className="section-label">SELECTED WORK</span>
        <h2 className="section-title">
          <span>Things I've </span><span className="highlight">Built</span>
        </h2>
        <span className="proj-scroll-hint">→ scroll to explore</span>
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} className="proj-track">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
