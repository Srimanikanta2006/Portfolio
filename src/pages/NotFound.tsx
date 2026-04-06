import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="section container" style={{ textAlign: 'center', marginTop: '20vh' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        You've drifted off the map 🌊
      </p>
      <Link to="/" style={{ 
        display: 'inline-block', 
        padding: '12px 24px', 
        backgroundColor: 'var(--text-primary)', 
        color: 'var(--bg-primary)', 
        borderRadius: '24px',
        fontWeight: 500
      }}>
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
