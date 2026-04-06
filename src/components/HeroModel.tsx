import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function NeuralSphere({ scrollProgress, mousePos }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const time = useRef(0);
  const COUNT = 180; // number of particles

  // Generate sphere + DNA helix positions
  const { positions, linePositions } = useMemo(() => {
    const pos = [];
    const linePts = [];
    for (let i = 0; i < COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / COUNT);
      const theta = Math.sqrt(COUNT * Math.PI) * phi;
      // Fibonacci sphere distribution
      pos.push(
        2.2 * Math.cos(theta) * Math.sin(phi),
        2.2 * Math.sin(theta) * Math.sin(phi),
        2.2 * Math.cos(phi)
      );
    }
    // DNA helix strand 1
    for (let t = 0; t < 100; t++) {
      const angle = (t / 100) * Math.PI * 6;
      const y = (t / 100) * 4 - 2;
      linePts.push(Math.cos(angle) * 0.8, y, Math.sin(angle) * 0.8);
    }
    // DNA helix strand 2 (offset 180deg)
    for (let t = 0; t < 100; t++) {
      const angle = (t / 100) * Math.PI * 6 + Math.PI;
      const y = (t / 100) * 4 - 2;
      linePts.push(Math.cos(angle) * 0.8, y, Math.sin(angle) * 0.8);
    }
    return {
      positions: new Float32Array(pos),
      linePositions: new Float32Array(linePts)
    };
  }, []);

  useFrame((_state, delta) => {
    time.current += delta * 0.4;
    if (!groupRef.current) return;

    // CORRECT mouse axis — mouse right = sphere turns right, mouse up = tilts up
    const targetRotY = mousePos.x * 1.2;   // FIX: was inverted before
    const targetRotX = mousePos.y * -0.6;  // FIX: negative = correct up/down

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, targetRotY + time.current * 0.15, 0.03
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, targetRotX, 0.03
    );

    // Scroll-driven morph: sphere → helix → back
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const s = scrollProgress;
      for (let i = 0; i < COUNT; i++) {
        const phi = Math.acos(-1 + (2 * i) / COUNT);
        const theta = Math.sqrt(COUNT * Math.PI) * phi + time.current * 0.3;
        // Sphere target
        const sx = 2.2 * Math.cos(theta) * Math.sin(phi);
        const sy = 2.2 * Math.sin(theta) * Math.sin(phi);
        const sz = 2.2 * Math.cos(phi);
        // Helix target
        const angle = (i / COUNT) * Math.PI * 8 + time.current;
        const hx = Math.cos(angle) * 1.5;
        const hy = (i / COUNT) * 4 - 2;
        const hz = Math.sin(angle) * 1.5;
        // Lerp between sphere (s=0) and helix (s=0.5), then back
        const t2 = s < 0.5 ? s * 2 : (1 - s) * 2;
        posAttr.setXYZ(i,
          THREE.MathUtils.lerp(sx, hx, Math.min(t2, 1)),
          THREE.MathUtils.lerp(sy, hy, Math.min(t2, 1)),
          THREE.MathUtils.lerp(sz, hz, Math.min(t2, 1))
        );
      }
      posAttr.needsUpdate = true;
    }

    // Cursor repulsion: particles near cursor get pushed away
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const cursorX = mousePos.x * 3;
      const cursorY = mousePos.y * -3;
      for (let i = 0; i < COUNT; i++) {
        const px = posAttr.getX(i);
        const py = posAttr.getY(i);
        const dist = Math.sqrt((px - cursorX)**2 + (py - cursorY)**2);
        if (dist < 0.8) {
          const force = (0.8 - dist) / 0.8 * 0.4;
          posAttr.setX(i, px + (px - cursorX) / dist * force);
          posAttr.setY(i, py + (py - cursorY) / dist * force);
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* PARTICLE SPHERE */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#00d4ff" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </points>

      {/* CONNECTING LINES — wireframe sphere feel */}
      <lineSegments>
        <bufferGeometry attach="geometry">
           <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#7c3aed" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {/* INNER GLOWING CORE */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.03} />
      </mesh>

      {/* OUTER GLOW HALO */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.015} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* ORBITAL RINGS */}
      {[0, 60, 120].map((deg, i) => (
        <mesh key={i} rotation={[Math.PI / 2, deg * (Math.PI / 180), 0]}>
          <ringGeometry args={[2.8, 2.82, 64]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.1} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroModel() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fn = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener('scroll', fn);
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,   // -1 to +1
        y: (e.clientY / window.innerHeight - 0.5) * 2    // -1 to +1
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 w-full h-full md:w-1/2 md:right-0 md:left-auto">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <NeuralSphere scrollProgress={scrollProgress} mousePos={mousePos} />
      </Canvas>
    </div>
  );
}
