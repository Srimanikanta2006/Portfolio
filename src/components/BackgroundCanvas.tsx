import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BackgroundCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const W = window.innerWidth, H = window.innerHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // ═══ LAYER 1: STAR FIELD — proper tiny white dots ═══
    const starCount = 4000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 200;
      starSizes[i] = Math.random() * 1.5 + 0.3;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    const starMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, color: { value: new THREE.Color('#ffffff') } },
      vertexShader: `
        attribute float size;
        uniform float time;
        varying float vAlpha;
        void main() {
          vAlpha = 0.4 + 0.3 * sin(time * 1.5 + position.x * 10.0);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (250.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        uniform vec3 color;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = vAlpha * (1.0 - d * 2.0);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true, depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ═══ LAYER 2: GALAXY NEBULA — shader-based colorful gas clouds ═══
    const nebulaMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        res: { value: new THREE.Vector2(W, H) },
      },
      vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        uniform float time;
        uniform vec2 res;
        vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
        vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
        vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
        float snoise(vec3 v) {
          const vec2 C=vec2(1./6.,1./3.);
          vec3 i=floor(v+dot(v,C.yyy));
          vec3 x0=v-i+dot(i,C.xxx);
          vec3 g=step(x0.yzx,x0.xyz);
          vec3 l=1.-g;
          vec3 i1=min(g.xyz,l.zxy);
          vec3 i2=max(g.xyz,l.zxy);
          vec3 x1=x0-i1+C.xxx;
          vec3 x2=x0-i2+C.yyy;
          vec3 x3=x0-0.5;
          i=mod289(i);
          vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
          vec4 j=p-49.*floor(p*(1./7.))*(1./7.);
          vec4 x_=floor(j*(1./7.));
          vec4 y_=floor(j-7.*x_);
          vec4 x2_=x_*(1./7.)+0.5/7.;
          vec4 y2_=y_*(1./7.)+0.5/7.;
          vec4 h=1.-abs(x2_)-abs(y2_);
          vec4 b0=vec4(x2_.xy,y2_.xy);
          vec4 b1=vec4(x2_.zw,y2_.zw);
          vec4 s0=floor(b0)*2.+1.;
          vec4 s1=floor(b1)*2.+1.;
          vec4 sh=-step(h,vec4(0.));
          vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
          vec4 a1_=b1.xzyw+s1.xzyw*sh.zzww;
          vec3 p0_=vec3(a0.xy,h.x);
          vec3 p1_=vec3(a0.zw,h.y);
          vec3 p2_=vec3(a1_.xy,h.z);
          vec3 p3_=vec3(a1_.zw,h.w);
          vec4 norm=1.79284291400159-0.85373472095314*vec4(dot(p0_,p0_),dot(p1_,p1_),dot(p2_,p2_),dot(p3_,p3_));
          p0_*=norm.x;p1_*=norm.y;p2_*=norm.z;p3_*=norm.w;
          vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
          m=m*m;
          return 42.*dot(m*m,vec4(dot(p0_,x0),dot(p1_,x1),dot(p2_,x2),dot(p3_,x3)));
        }
        void main() {
          vec2 uv = gl_FragCoord.xy / res;
          float t = time * 0.08;
          float n1 = snoise(vec3(uv * 2.5, t));
          float n2 = snoise(vec3(uv * 1.8 + 0.5, t * 0.7));
          float n3 = snoise(vec3(uv * 3.5 - 0.3, t * 1.2));
          vec3 cyan    = vec3(0.0, 0.83, 1.0) * max(0.0, n1) * 0.06;
          vec3 purple  = vec3(0.49, 0.23, 0.93) * max(0.0, n2) * 0.04;
          vec3 blue    = vec3(0.0, 0.58, 1.0) * max(0.0, n3) * 0.035;
          vec3 col = cyan + purple + blue;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      depthWrite: false,
    });
    const nebulaGeo = new THREE.PlaneGeometry(2, 2);
    const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebula.position.z = -10;
    scene.add(nebula);

    // ═══ LAYER 3: FLOATING GEOMETRIC SHAPES (subtle wireframes) ═══
    const shapes: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const geo = i % 2 === 0
        ? new THREE.IcosahedronGeometry(0.3 + Math.random() * 0.4, 0)
        : new THREE.OctahedronGeometry(0.2 + Math.random() * 0.3, 0);
      const mat = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0x00d4ff : i % 3 === 1 ? 0x7c3aed : 0x0094ff,
        wireframe: true, transparent: true, opacity: 0.06,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 5 - 3,
      );
      mesh.userData = {
        rotSpd: { x: Math.random() * 0.002, y: Math.random() * 0.003, z: Math.random() * 0.001 },
        floatSpd: Math.random() * 0.0005 + 0.0003,
        floatAmp: Math.random() * 0.5 + 0.3,
        baseY: mesh.position.y,
        phase: Math.random() * Math.PI * 2,
      };
      scene.add(mesh);
      shapes.push(mesh);
    }

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / W - 0.5) * 0.8;
      mouseY = (e.clientY / H - 0.5) * -0.5;
    };
    window.addEventListener('mousemove', onMouse);

    let frameId: number;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      starMat.uniforms.time.value = t;
      nebulaMat.uniforms.time.value = t;

      camera.position.x += (mouseX - camera.position.x) * 0.02;
      camera.position.y += (mouseY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      shapes.forEach(s => {
        s.rotation.x += s.userData.rotSpd.x;
        s.rotation.y += s.userData.rotSpd.y;
        s.rotation.z += s.userData.rotSpd.z;
        s.position.y = s.userData.baseY +
          Math.sin(t * s.userData.floatSpd * 1000 + s.userData.phase) * s.userData.floatAmp;
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      nebulaMat.uniforms.res.value.set(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{
      position: 'fixed', inset: 0, zIndex: 0,
      pointerEvents: 'none', background: '#050b18',
    }} />
  );
}
