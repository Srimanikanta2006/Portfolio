import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
// anime ESM mapping
import anime from 'animejs/lib/anime.es.js';
import ScrollTrigger from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [emailValue, setEmailValue] = useState("");

  const emailIsValid = emailValue.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

  useEffect(() => {
    if (quoteRef.current) {
      ScrollTrigger.create({
        trigger: quoteRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const lines = quoteRef.current?.querySelectorAll('p.quote-line');
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
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    if (!emailIsValid || emailValue.length === 0) return;

    setStatus('loading');

    // Real EmailJS Integration
    emailjs.sendForm(
      'service_d6mwavm',
      'template_m5mxee8',
      formRef.current,
      'mH32ygJ2ENtY0_h5h'
    ).then(() => {
      setStatus('success');
      formRef.current?.reset();
      setEmailValue("");
      setTimeout(() => setStatus('idle'), 5000);
    }).catch(err => {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    });
  };

  return (
    <section className="contact-section relative w-full flex flex-col justify-center z-20" id="contact">
      <h2 className="section-title mb-16 flex items-center">
        <span>Let's Build</span> <span className="highlight">Something</span>
        <span className="inline-block w-4 h-10 ml-3 bg-accent-cyan animate-[pulse_1s_infinite]" />
      </h2>

      <div className="contact-grid">
        {/* Left Column: Info & Quote */}
        <div className="flex flex-col gap-10">
          <div>
            <h3 className="text-xl md:text-2xl font-heading text-text-primary mb-6 leading-relaxed">
              Open to internships, freelance projects, and cool collaborations.
            </h3>
            
            <div className="flex flex-col gap-4">
              <a href="mailto:srimanikantapothu@gmail.com" className="group flex flex-col p-4 bg-bg-card border border-border-subtle rounded-sm hover:border-accent-cyan transition-colors cursor-pointer">
                <span className="text-xs font-mono text-text-dim uppercase tracking-wider mb-1">Email</span>
                <span className="text-lg text-text-secondary group-hover:text-accent-cyan transition-colors">srimanikantapothu@gmail.com</span>
              </a>
              
              <a href="tel:+916302417229" className="group flex flex-col p-4 bg-bg-card border border-border-subtle rounded-sm hover:border-accent-cyan transition-colors cursor-pointer">
                <span className="text-xs font-mono text-text-dim uppercase tracking-wider mb-1">Phone</span>
                <span className="text-lg text-text-secondary group-hover:text-accent-cyan transition-colors">+91 6302417229</span>
              </a>

              <div className="flex gap-4 mt-2">
                <a href="https://www.linkedin.com/in/srimanikanta-pothu-a8899b237/" target="_blank" rel="noreferrer" className="px-6 py-2 border border-border-subtle hover:border-accent-blue text-text-secondary hover:text-accent-blue transition-colors rounded-sm text-sm font-mono">
                  LinkedIn
                </a>
                <a href="https://github.com/Srimanikanta2006" target="_blank" rel="noreferrer" className="px-6 py-2 border border-border-subtle hover:border-text-primary text-text-secondary hover:text-text-primary transition-colors rounded-sm text-sm font-mono">
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Philosophy Quote Card */}
          <div ref={quoteRef} className="mt-4 p-6 bg-[#030712] border-l-4 border-l-accent-cyan rounded-r-md shadow-lg font-mono text-sm">
            <p className="quote-line text-[#a0c5e8] opacity-0 mb-2">&gt; "Yᴏᴜ can LIVE as you LIKE.</p>
            <p className="quote-line text-[#a0c5e8] opacity-0 mb-2">&gt; But Honest, Courageous, Patriotic Life is Ultimate Living.</p>
            <p className="quote-line text-[#a0c5e8] opacity-0 mb-2">&gt; Serve the people. Die for the country.</p>
            <p className="quote-line text-accent-cyan opacity-0 mb-4">&gt; Live Like a Legend."</p>
            <p className="quote-line text-text-dim opacity-0 italic">&mdash; Srimanikanta's Life Philosophy</p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="bg-bg-card p-8 rounded-sm border border-border-subtle relative overflow-hidden shadow-2xl">
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
            <div className="form-field">
              <input 
                type="text" 
                name="from_name"
                required
                placeholder=" "
              />
              <label>Name</label>
            </div>

            <div className="form-field">
              <input 
                type="email" 
                name="from_email"
                required
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                style={{ borderColor: !emailIsValid && emailValue.length > 0 ? '#ef4444' : undefined }}
                placeholder=" "
              />
              <label style={{ color: !emailIsValid && emailValue.length > 0 ? '#ef4444' : undefined }}>
                Email Format
              </label>
            </div>

            <div className="form-field">
              <input 
                type="text" 
                name="subject"
                required
                placeholder=" "
              />
              <label>Subject</label>
            </div>

            <div className="form-field mt-2">
              <textarea 
                name="message"
                required
                placeholder=" "
              />
              <label>Message</label>
            </div>

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className={`mt-4 px-8 py-3 font-bold font-mono text-sm tracking-widest uppercase flex items-center justify-center transition-all duration-300 border
                ${status === 'idle' ? 'border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary' : ''}
                ${status === 'loading' ? 'border-accent-cyan text-accent-cyan opacity-70 cursor-not-allowed' : ''}
                ${status === 'success' ? 'border-green-500 bg-green-500 text-bg-primary' : ''}
                ${status === 'error' ? 'border-red-500 bg-red-500 text-bg-primary' : ''}
              `}
            >
              {status === 'idle' && <span>Send Message &rarr;</span>}
              {status === 'loading' && <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />}
              {status === 'success' && <span>&#10003; Message Sent!</span>}
              {status === 'error' && <span>&#10007; Failed. Try again.</span>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
