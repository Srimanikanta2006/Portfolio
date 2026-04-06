const BackgroundFx = () => {
  return (
    <>
      {/* Layer 2: Nebula Gradient Blobs */}
      <div className="fixed inset-0 z-[1] mix-blend-screen pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent-cyan opacity-[0.12] blur-[100px] animate-[pulse-slow_8s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-accent-purple opacity-[0.08] blur-[120px] animate-[pulse-slow_8s_ease-in-out_infinite_1s]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-accent-blue opacity-[0.1] blur-[110px] animate-[pulse-slow_8s_ease-in-out_infinite_2s]" />
      </div>

      {/* Layer 3: Scanline Overlay */}
      <div 
        className="fixed inset-0 z-[2] pointer-events-none opacity-[0.025]"
        style={{
          background: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 4px)',
          backgroundSize: '100% 4px'
        }}
      />
      
      {/* Layer 4: Perspective Grid Lines (Hero only roughly) */}
      <div 
        className="absolute top-0 left-0 w-full h-[150vh] z-[3] pointer-events-none opacity-5"
        style={{
          perspective: '1000px',
          overflow: 'hidden'
        }}
      >
        <div 
          className="absolute inset-0 top-[20vh]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--accent-cyan) 1px, transparent 1px),
              linear-gradient(to bottom, var(--accent-cyan) 1px, transparent 1px)
            `,
            backgroundSize: '6vw 6vw',
            transformOrigin: '50% 0%',
            transform: 'rotateX(80deg) scale(2.5)',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 50%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 50%)'
          }}
        />
      </div>
    </>
  );
};

export default BackgroundFx;
