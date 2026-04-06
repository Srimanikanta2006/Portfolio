import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ mouseX: 0, mouseY: 0, ringX: 0, ringY: 0 });

  useEffect(() => {
    // Hide system cursor on ENTIRE document
    document.documentElement.style.cursor = 'none';

    const onMove = (e: MouseEvent) => {
      pos.current.mouseX = e.clientX;
      pos.current.mouseY = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.current.mouseX - 4}px, ${pos.current.mouseY - 4}px)`;
      }
    };

    const onEnterLink = () => {
      if (ring.current) {
        ring.current.style.width = '60px';
        ring.current.style.height = '60px';
        ring.current.style.opacity = '0.4';
        ring.current.style.borderColor = '#00d4ff';
      }
    };

    const onLeaveLink = () => {
      if (ring.current) {
        ring.current.style.width = '40px';
        ring.current.style.height = '40px';
        ring.current.style.opacity = '0.25';
        ring.current.style.borderColor = '#e8f4fd'; // Reset border color somewhat
      }
    };

    document.addEventListener('mousemove', onMove);
    
    // Mutation observer for dynamic links
    const obs = new MutationObserver(() => {
      document.querySelectorAll('a, button, [data-cursor], input, textarea, select').forEach(el => {
        // avoid reattaching multiple times by checking a flag
        if (!(el as any)._cursorBound) {
          el.addEventListener('mouseenter', onEnterLink);
          el.addEventListener('mouseleave', onLeaveLink);
          (el as any)._cursorBound = true;
        }
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });
    
    // Initial bind
    document.querySelectorAll('a, button, [data-cursor], input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', onEnterLink);
      el.addEventListener('mouseleave', onLeaveLink);
      (el as any)._cursorBound = true;
    });

    // Ring lerp loop
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let animationFrameId: number;
    
    const loop = () => {
      pos.current.ringX = lerp(pos.current.ringX, pos.current.mouseX, 0.1);
      pos.current.ringY = lerp(pos.current.ringY, pos.current.mouseY, 0.1);
      if (ring.current) {
        // center ring offset (-20) since default width is 40. We calculate offset dynamically based on rect if we really wanted to, but fixed is fine.
        const sizeOffset = parseInt(ring.current.style.width) / 2 || 20; 
        ring.current.style.transform = `translate(${pos.current.ringX - sizeOffset}px, ${pos.current.ringY - sizeOffset}px)`;
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animationFrameId);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div 
        ref={dot} 
        style={{
          position: 'fixed', top: 0, left: 0, width: '8px', height: '8px', 
          backgroundColor: '#e8f4fd', borderRadius: '50%', pointerEvents: 'none', 
          zIndex: 99999
        }} 
      />
      <div 
        ref={ring} 
        style={{
          position: 'fixed', top: 0, left: 0, width: '40px', height: '40px', 
          border: '1px solid rgba(232, 244, 253, 0.25)', borderRadius: '50%', 
          pointerEvents: 'none', zIndex: 99998,
          transition: 'width 0.2s, height 0.2s, opacity 0.2s, border-color 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} 
      />
    </>
  );
}
