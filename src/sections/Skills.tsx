import { motion } from 'framer-motion';

const skillsData = [
  {
    title: "Languages",
    skills: ["Java", "JavaScript", "C"]
  },
  {
    title: "Web Technologies",
    skills: ["HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "Node.js"]
  },
  {
    title: "Tools & Platforms",
    skills: ["Git", "GitHub", "VS Code", "Streamlit", "Vercel", "Netlify"]
  },
  {
    title: "CS Fundamentals",
    skills: ["Data Structures & Algorithms", "OOP", "Operating Systems", "DBMS", "Discrete Math"]
  }
];

const Skills = () => {
  return (
    <section className="relative w-full py-24 min-h-screen flex flex-col justify-center container mx-auto px-6 md:px-12" id="skills">
      <div className="flex flex-col md:w-[60%]">
        <h2 className="section-title">
          <span>Tech</span> <span className="highlight">Arsenal</span>
        </h2>

        {/* Current Learning Bonus Tag */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 inline-flex items-center gap-3 px-4 py-2 border border-border-glow rounded-full bg-bg-card shadow-[0_0_15px_rgba(0,212,255,0.1)] w-max"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-cyan" />
          </span>
          <span className="font-mono text-sm text-text-secondary">
            Current Learning: <span className="text-accent-cyan">Exploring React Three Fiber & Advanced GSAP</span>
          </span>
        </motion.div>

        {/* CSS Bento grid for cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
          {skillsData.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 * idx, type: 'spring', bounce: 0.4 }}
              className="skill-card group"
            >
              <h3>{category.title}</h3>
              
              <div className="skills-pills">
                {category.skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.1 * idx + 0.05 * i }}
                    className="skill-pill"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
