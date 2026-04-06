import { useState, useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import Preloader from './components/Preloader';
import BackgroundCanvas from './components/BackgroundCanvas';
import HeroModel from './components/HeroModel';

import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Education from './sections/Education';
import Awards from './sections/Awards';
import Stats from './sections/Stats';
import Contact from './sections/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fn = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress((window.scrollY / max) * 100);
    };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[9999] bg-transparent">
      <div style={{ width: `${progress}%`, height: '100%', background: '#00d4ff', transition: 'width 0.1s' }} />
    </div>
  );
}

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <CustomCursor />
      <ScrollProgress />

      <ReactLenis root options={{ lerp: 0.05, autoRaf: true }}>
        <div className="relative w-full min-h-screen bg-bg-primary text-text-primary overflow-x-hidden font-sans">
          <BackgroundCanvas />

          <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 1s ease 1s' }}>
            <Navbar />
            <HeroModel />

            <main className="relative z-10 flex flex-col pb-24">
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Education />
              <Awards />
              <Stats />
              <Contact />
            </main>

            <Footer />
            <div className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</div>
          </div>
        </div>
      </ReactLenis>
    </>
  );
}

export default App;
