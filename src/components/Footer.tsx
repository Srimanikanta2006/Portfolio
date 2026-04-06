export default function Footer() {
  return (
    <footer style={{
      width: '100%', padding: '4rem 0 2rem',
      borderTop: '0.5px solid rgba(0,212,255,0.1)',
      background: '#050b18', position: 'relative', zIndex: 10,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        {/* ROW 1: Big name + tagline */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 28, fontWeight: 700,
            color: '#e8f4fd',
            textShadow: '0 0 30px rgba(0,212,255,0.3)',
            marginBottom: 6,
          }}>Srimanikanta</div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14, color: '#7a9bbf',
          }}>Full-Stack Developer · MSRIT Bengaluru · Batch 2028</div>
        </div>

        {/* DIVIDER */}
        <div style={{
          height: '0.5px',
          background: 'linear-gradient(to right, rgba(0,212,255,0.3), rgba(124,58,237,0.2), transparent)',
          margin: '1.5rem 0',
        }} />

        {/* ROW 2: 3-column */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1.5rem',
        }}>
          {/* Left: philosophy quote */}
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, color: '#3a5270', fontStyle: 'italic',
          }}>
            "Live Like a Legend."
          </div>

          {/* Center: social links */}
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[
              { label: 'GitHub', href: 'https://github.com/Srimanikanta2006' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/srimanikanta-pothu-a8899b237/' },
              { label: 'Email', href: 'mailto:srimanikantapothu@gmail.com' },
            ].map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer"
                style={{
                  color: '#7a9bbf', fontSize: 13, textDecoration: 'none',
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: 'color 0.2s, text-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.color = '#00d4ff';
                  (e.target as HTMLElement).style.textShadow = '0 0 16px rgba(0,212,255,0.6)';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.color = '#7a9bbf';
                  (e.target as HTMLElement).style.textShadow = 'none';
                }}
              >{link.label}</a>
            ))}
          </div>

          {/* Right: copyright */}
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12, color: '#3a5270',
          }}>
            © 2025 · Open to Internships & Collaborations
          </div>
        </div>
      </div>
    </footer>
  );
}
