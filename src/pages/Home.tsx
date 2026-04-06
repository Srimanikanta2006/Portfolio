import PageTransition from '../components/PageTransition';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Projects from '../sections/Projects';
import Skills from '../sections/Skills';
import Education from '../sections/Education';
import Awards from '../sections/Awards';
import Stats from '../sections/Stats';
import Contact from '../sections/Contact';

const Home = () => {
  return (
    <PageTransition>
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Education />
        <Awards />
        <Stats />
        <Contact />
      </main>
    </PageTransition>
  );
};

export default Home;
