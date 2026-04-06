import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Stars = () => {
  const count = 3000;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const { mouse, viewport } = useThree();

  const tempObj = useMemo(() => new THREE.Object3D(), []);

  // Generate star data
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 20 - 5;
      const size = Math.random() * 0.03 + 0.005;
      const speed = Math.random() * 0.2 + 0.1;
      data.push({ x, y, z, size, speed });
    }
    return data;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    const mx = (mouse.x * viewport.width) / 2;
    const my = (mouse.y * viewport.height) / 2;

    particles.forEach((p, i) => {
      const t = state.clock.elapsedTime;

      const currentX = p.x + Math.sin(t * p.speed + i) * 0.1;
      const currentY = p.y + Math.cos(t * p.speed + i) * 0.1;
      const s = p.size + Math.sin(t * p.speed * 5 + i) * 0.005;

      let rx = currentX;
      let ry = currentY;

      const dx = currentX - mx;
      const dy = currentY - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // ✅ FIX: prevent divide by zero
      if (dist > 0 && dist < 3) {
        const force = (3 - dist) * 0.1;
        rx += (dx / dist) * force;
        ry += (dy / dist) * force;
      }

      tempObj.position.set(rx, ry, p.z);
      tempObj.scale.set(s, s, s);
      tempObj.updateMatrix();

      if (mesh.current) {
        mesh.current.setMatrixAt(i, tempObj.matrix);
      }
    });

    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <circleGeometry args={[1, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} fog={true} />
    </instancedMesh>
  );
};

const Starfield = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-bg-primary">
      {/* ✅ FIX: removed fog from Canvas props */}
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <fog attach="fog" args={["#050b18", 0.06]} />
        <Stars />
      </Canvas>
    </div>
  );
};

export default Starfield;
