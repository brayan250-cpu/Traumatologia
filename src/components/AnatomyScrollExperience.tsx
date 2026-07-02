/**
 * AnatomyScrollExperience.tsx  v3 — GLB real
 * ────────────────────────────────────────────
 * Carga el modelo knee.glb generado con Tripo3D.
 * Materiales aplicados desde código → teal/ivory/violet por acto.
 * Cámara fija, solo el modelo rota con scroll.
 *
 * REQUIERE: public/models/knee.glb
 * DEPS:  three  @react-three/fiber  @react-three/drei
 */
import { Suspense, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Precargar el GLB para que esté listo cuando el usuario llegue a la sección
useGLTF.preload('/models/knee.glb');

/* ── Paleta ──────────────────────────────────────── */
const TEAL   = '#00e6b4';
const VIOLET = '#6c63ff';
const BASE   = '#030814';

/* ── Helpers ─────────────────────────────────────── */
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth  = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
type KF = [number, number];
const keyed = (p: number, keys: KF[]) => {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [p0, v0] = keys[i], [p1, v1] = keys[i + 1];
    if (p <= p1) return v0 + (v1 - v0) * smooth(p, p0, p1);
  }
  return keys[keys.length - 1][1];
};

/* ── Materiales médicos ───────────────────────────── */
// Todos los materiales parten de hueso marfil.
// El cartílago y ligamento se detectan por tamaño relativo.
const baseBone = () => new THREE.MeshStandardMaterial({
  color: '#ddd8c8', roughness: 0.72, metalness: 0,
});
const baseCartilage = () => new THREE.MeshStandardMaterial({
  color: '#c8e0e8', roughness: 0.55, metalness: 0,
  emissive: new THREE.Color('#00e6b4'), emissiveIntensity: 0,
  transparent: true, opacity: 0.92,
});
const baseLigament = () => new THREE.MeshStandardMaterial({
  color: '#e4dcc8', roughness: 0.68, metalness: 0,
  emissive: new THREE.Color('#00e6b4'), emissiveIntensity: 0,
});

/* ── Escena 3D con GLB ────────────────────────────── */
function KneeModel({ progressRef }: { progressRef: { current: number } }) {
  const { scene } = useGLTF('/models/knee.glb');
  const groupRef  = useRef<THREE.Group>(null);
  const keyRef    = useRef<THREE.PointLight>(null);
  const fillRef   = useRef<THREE.PointLight>(null);

  /* Clasificar y aplicar materiales al montar */
  useLayoutEffect(() => {
    const meshes: THREE.Mesh[] = [];
    scene.traverse(obj => {
      if ((obj as THREE.Mesh).isMesh) meshes.push(obj as THREE.Mesh);
    });

    /* Calcular volúmenes de todas las piezas para comparar tamaños relativos */
    const vols = meshes.map(m => {
      const s = new THREE.Box3().setFromObject(m).getSize(new THREE.Vector3());
      return s.x * s.y * s.z;
    });
    const maxVol = Math.max(...vols);

    meshes.forEach((m, i) => {
      const ratio = vols[i] / maxVol; // 0=minúsculo, 1=más grande

      if (ratio > 0.25) {
        // Piezas grandes → hueso principal
        m.material = baseBone();
        m.userData.type = 'bone';
      } else if (ratio > 0.04) {
        // Piezas medianas → cartílago/menisco
        m.material = baseCartilage();
        m.userData.type = 'cartilage';
      } else {
        // Piezas pequeñas → ligamentos/tendones
        m.material = baseLigament();
        m.userData.type = 'ligament';
      }
      m.castShadow = m.receiveShadow = true;
    });

    /* Centrar y normalizar escala */
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const sizeV  = box.getSize(new THREE.Vector3());
    const maxSide = Math.max(sizeV.x, sizeV.y, sizeV.z);
    scene.position.sub(center);
    scene.scale.setScalar(5.2 / maxSide);
  }, [scene]);

  useFrame((_, delta) => {
    const p = progressRef.current;
    if (!groupRef.current) return;
    const g = groupRef.current;
    const damp = (cur: number, tgt: number, lam = 5) =>
      THREE.MathUtils.damp(cur, tgt, lam, delta);

    /* Rotación por acto — empieza de frente (y=0) */
    g.rotation.y = damp(g.rotation.y,
      keyed(p, [[0,0],[0.2,0.5],[0.4,1.4],[0.6,2.4],[0.8,Math.PI*1.45],[1,Math.PI*1.65]]));
    g.rotation.x = damp(g.rotation.x,
      keyed(p, [[0,-0.05],[0.4,0],[0.8,0.06],[1,0.06]]));

    /* Escala: zoom sutil en acto 2, dolly-out final */
    g.scale.setScalar(damp(g.scale.x,
      keyed(p, [[0,0.90],[0.2,1.05],[0.4,1.0],[0.6,0.97],[0.8,0.88],[1,0.70]])));

    /* Efectos de material por acto */
    scene.traverse(obj => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const m = obj as THREE.Mesh;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (!mat) return;

      if (m.userData.type === 'cartilage') {
        /* Act 2: cartílagos brillan teal */
        mat.emissiveIntensity = 0.55 * smooth(p, 0.18, 0.28) * (1 - smooth(p, 0.44, 0.54));
        mat.opacity = clamp01(0.35 + 0.65 * (1 - smooth(p, 0.44, 0.54)));
      }
      if (m.userData.type === 'ligament') {
        /* Act 2-3: ligamentos con glow */
        mat.emissiveIntensity = 0.45 * smooth(p, 0.22, 0.32) * (1 - smooth(p, 0.50, 0.60));
      }
      if (m.userData.type === 'bone') {
        /* Act 4: hueso con tinte violeta */
        const toV = smooth(p, 0.60, 0.74);
        mat.color.lerpColors(new THREE.Color('#ddd4be'), new THREE.Color('#c8c0e0'), toV);
      }
    });

    /* Luz key: blanco cálido → teal sutil → violeta en acto 4 */
    if (keyRef.current) {
      const toT = smooth(p, 0.10, 0.30); // blanco → teal suave
      const toV = smooth(p, 0.58, 0.72); // teal → violeta
      const warmWhite = new THREE.Color('#fff8f0');
      const tealColor = new THREE.Color(TEAL);
      const violetColor = new THREE.Color(VIOLET);
      const midColor = warmWhite.clone().lerp(tealColor, toT * 0.45);
      keyRef.current.color.lerpColors(midColor, violetColor, toV);
      keyRef.current.intensity = damp(keyRef.current.intensity,
        2.2 + 1.2 * smooth(p, 0.60, 0.72) * (1 - smooth(p, 0.82, 0.94)));
    }
    if (fillRef.current) {
      fillRef.current.intensity = damp(fillRef.current.intensity,
        0.6 + 0.5 * smooth(p, 0.60, 0.72));
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.28} color="#f0f4ff" />
      <pointLight ref={keyRef}  color="#fff8f0"  position={[3.0, 3.5, 4.5]} intensity={2.2} decay={0} />
      <pointLight ref={fillRef} color="#d0e8ff"  position={[-4, -2.0, 2.5]} intensity={0.6} decay={0} />
      <directionalLight color="#ffffff" position={[0, 5, 3]} intensity={0.5} />
      <primitive object={scene} />
    </group>
  );
}

/* Fallback mientras carga */
function KneeFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.4, 12, 8]} />
      <meshStandardMaterial color={TEAL} wireframe />
    </mesh>
  );
}

/* ── Fondos radiales por acto ─────────────────────── */
const BGS = [
  'radial-gradient(900px 600px at 65% 44%, rgba(0,230,180,.12) 0%, transparent 65%)',
  'radial-gradient(800px 550px at 30% 50%, rgba(0,230,180,.14) 0%, transparent 60%), radial-gradient(600px 400px at 75% 28%, rgba(168,216,234,.08) 0%, transparent 55%)',
  'radial-gradient(900px 600px at 68% 48%, rgba(0,230,180,.10) 0%, transparent 65%), radial-gradient(600px 400px at 30% 60%, rgba(232,223,200,.06) 0%, transparent 55%)',
  'radial-gradient(1000px 700px at 50% 55%, rgba(108,99,255,.22) 0%, transparent 65%)',
  'radial-gradient(1100px 750px at 50% 45%, rgba(0,230,180,.11) 0%, transparent 65%), radial-gradient(800px 500px at 60% 60%, rgba(108,99,255,.10) 0%, transparent 55%)',
];

/* ── Estilos ──────────────────────────────────────── */
const MONO = '"IBM Plex Mono", monospace';
const tagSt: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 10,
  fontFamily: MONO, fontSize: 11, letterSpacing: '0.20em',
  textTransform: 'uppercase', color: TEAL, fontWeight: 500,
};
const dash: React.CSSProperties = { width: 22, height: 1, background: TEAL, opacity: 0.65 };
const h3St: React.CSSProperties = {
  fontSize: 'clamp(30px, 3.8vw, 52px)', fontWeight: 700,
  lineHeight: 1.12, letterSpacing: '-0.025em',
  color: 'rgba(255,255,255,.92)', margin: '16px 0 0',
};
const subSt: React.CSSProperties = {
  marginTop: 14, fontSize: 15, lineHeight: 1.6,
  color: 'rgba(255,255,255,.48)', fontWeight: 300,
};

/* ── Componente principal ─────────────────────────── */
export function AnatomyScrollExperience() {
  const sectionRef    = useRef<HTMLElement>(null);
  const progressRef   = useRef(0);
  const actRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const bgRefs        = useRef<(HTMLDivElement | null)[]>([]);
  const railFillRef   = useRef<HTMLDivElement>(null);
  const railRefs      = useRef<(HTMLSpanElement | null)[]>([]);
  const hintRef       = useRef<HTMLDivElement>(null);
  const metricValRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const acts    = actRefs.current.filter(Boolean) as HTMLDivElement[];
    const inners  = acts.map(a => a.querySelector<HTMLElement>('[data-inner]')!);

    if (reduced) {
      section.style.height = '100vh';
      acts.forEach((a, i) => { if (i !== 0 && i !== 4) a.style.display = 'none'; });
      return;
    }

    const ctx = gsap.context(() => {
      inners.forEach((el, i) => {
        if (i === 0) return;
        gsap.set(el, { clipPath: 'inset(0px 0px 100% 0px)', y: 40, autoAlpha: 1 });
      });
      bgRefs.current.forEach((bg, i) => bg && gsap.set(bg, { opacity: i === 0 ? 1 : 0 }));
      gsap.set('[data-metric]', { y: 30, autoAlpha: 0 });
      gsap.set('[data-step]',   { x: -14, autoAlpha: 0 });
      gsap.set('[data-cta]',    { scale: 0.92, autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top top', end: 'bottom bottom',
          scrub: 0.55,
          onUpdate: self => {
            progressRef.current = self.progress;
            const idx = Math.min(4, Math.floor(self.progress * 5));
            railRefs.current.forEach((r, i) => {
              if (!r) return;
              r.style.color   = i === idx ? TEAL : 'rgba(255,255,255,.25)';
              r.style.opacity = i === idx ? '1' : '.55';
            });
          },
        },
      });

      const enter = (i: number, at: number) =>
        tl.to(inners[i], { clipPath: 'inset(0px 0px 0% 0px)', y: 0, duration: 7 }, at);
      const exit  = (i: number, at: number) =>
        tl.to(inners[i], { autoAlpha: 0, y: -50, duration: 5, ease: 'power2.in' }, at);

      if (hintRef.current) tl.to(hintRef.current, { autoAlpha: 0, duration: 4 }, 5);
      exit(0, 14);
      enter(1, 20); exit(1, 34);
      enter(2, 40); exit(2, 54);
      enter(3, 60);
      tl.to('[data-metric]', { y: 0, autoAlpha: 1, duration: 5, stagger: 2, ease: 'back.out(1.5)' }, 63);
      [{ to: 0.2, dec: 1 }, { to: 98, dec: 0 }, { to: 3, dec: 0 }].forEach(({ to, dec }, i) => {
        const el = metricValRefs.current[i];
        if (!el) return;
        const obj = { v: 0 };
        tl.to(obj, { v: to, duration: 10, ease: 'power1.out',
          onUpdate: () => { el.textContent = obj.v.toFixed(dec); },
        }, 63 + i * 1.4);
      });
      exit(3, 75);
      enter(4, 82);
      tl.to('[data-step]', { x: 0, autoAlpha: 1, duration: 4, stagger: 1.6, ease: 'power2.out' }, 85);
      tl.to('[data-cta]',  { scale: 1, autoAlpha: 1, duration: 5, ease: 'back.out(1.5)' }, 89);

      [15, 34, 54, 74].forEach((at, i) => {
        const from = bgRefs.current[i], to = bgRefs.current[i + 1];
        if (from) tl.to(from, { opacity: 0, duration: 9, ease: 'power2.inOut' }, at);
        if (to)   tl.to(to,   { opacity: 1, duration: 9, ease: 'power2.inOut' }, at);
      });
      if (railFillRef.current)
        tl.fromTo(railFillRef.current, { scaleY: 0 }, { scaleY: 1, duration: 100, ease: 'none' }, 0);
      tl.set({}, {}, 100);
    }, section);

    return () => ctx.revert();
  }, []);

  const acts123 = [
    {
      tag: '01 · Anatomía', align: 'md:justify-start md:text-left',
      headline: 'Cada articulación es una obra maestra de ingeniería biológica.',
      text: 'Fémur, tibia y peroné trabajan en perfecta alineación para cada paso que das.',
    },
    {
      tag: '02 · Cartílago', align: 'md:justify-end md:text-right',
      headline: 'El cartílago amortigua. Cuando se desgasta, el dolor aparece.',
      text: 'Los meniscos y el cartílago articular son la primera línea de protección de la rodilla.',
    },
    {
      tag: '03 · Ligamentos', align: 'md:justify-start md:text-left',
      headline: 'Los ligamentos estabilizan. Cuando uno falla, todo cambia.',
      text: 'El LCA y el LCM soportan las fuerzas laterales y rotacionales de cada movimiento.',
    },
  ];

  const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`;

  return (
    <section
      ref={sectionRef}
      aria-label="Recorrido anatómico interactivo"
      style={{ height: '500vh', position: 'relative', background: BASE }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: BASE }}>

        {/* Fondos por acto */}
        {BGS.map((bg, i) => (
          <div key={i} ref={el => (bgRefs.current[i] = el)} aria-hidden="true"
            style={{ position: 'absolute', inset: 0, background: bg, opacity: i === 0 ? 1 : 0 }} />
        ))}

        {/* Canvas 3D con Suspense */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Canvas dpr={[1, 1.8]} camera={{ position: [0, 0, 7], fov: 36 }}
            gl={{ antialias: true, alpha: true }} style={{ position: 'absolute', inset: 0 }}>
            <Suspense fallback={<KneeFallback />}>
              <KneeModel progressRef={progressRef} />
            </Suspense>
          </Canvas>
        </div>

        {/* Noise */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.022,
          backgroundImage: NOISE, backgroundRepeat: 'repeat', backgroundSize: '200px',
        }} />

        {/* Actos 1–3 */}
        {acts123.map((act, i) => (
          <div key={act.tag} ref={el => (actRefs.current[i] = el)}
            className={`absolute inset-0 flex items-center justify-center px-6 pointer-events-none md:px-[8vw] ${act.align}`}>
            <div data-inner style={{ maxWidth: 460, willChange: 'transform, clip-path' }}>
              <span style={tagSt}><span style={dash} />{act.tag}</span>
              <h3 style={h3St}>{act.headline}</h3>
              <p style={subSt}>{act.text}</p>
            </div>
          </div>
        ))}

        {/* Acto 4: métricas */}
        <div ref={el => (actRefs.current[3] = el)}
          className="absolute inset-0 flex items-center justify-center px-6 text-center pointer-events-none">
          <div data-inner style={{ maxWidth: 720, willChange: 'transform, clip-path' }}>
            <span style={{ ...tagSt, justifyContent: 'center' }}>
              <span style={dash} />04 · Precisión<span style={dash} />
            </span>
            <h3 style={{ ...h3St, fontSize: 'clamp(28px, 3.5vw, 48px)', marginTop: 18 }}>
              Vemos al paciente antes que al problema.
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '48px 56px', marginTop: 48 }}>
              {[
                { unit: 'mm', label: 'Precisión artroscópica' },
                { unit: '%',  label: 'Tasa de éxito' },
                { unit: ' semanas', label: 'Recuperación promedio' },
              ].map((m, i) => (
                <div key={m.label} data-metric style={{ textAlign: 'center' }}>
                  <div style={{
                    fontWeight: 800, fontSize: 'clamp(44px, 5.5vw, 68px)', lineHeight: 1,
                    letterSpacing: '-0.03em',
                    background: `linear-gradient(135deg, ${TEAL} 0%, ${VIOLET} 100%)`,
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    color: 'transparent', WebkitTextFillColor: 'transparent',
                  }}>
                    <span ref={el => (metricValRefs.current[i] = el)}>0</span>
                    <span style={{ fontSize: '0.40em', fontWeight: 600 }}>{m.unit}</span>
                  </div>
                  <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.40)' }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Acto 5: CTA */}
        <div ref={el => (actRefs.current[4] = el)}
          className="absolute inset-0 flex items-center justify-center px-6 text-center pointer-events-none">
          <div data-inner style={{ maxWidth: 640, willChange: 'transform, clip-path' }}>
            <span style={{ ...tagSt, justifyContent: 'center' }}>
              <span style={dash} />05 · Consulta<span style={dash} />
            </span>
            <h3 style={{ ...h3St, fontSize: 'clamp(28px, 3.5vw, 46px)', marginTop: 18 }}>
              Reconstruimos lo que el tiempo o el trauma dañaron.
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px 20px', marginTop: 32 }}>
              {['Diagnosticar', 'Planificar', 'Intervenir', 'Recuperar'].map((step, i) => (
                <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: 20 }}>
                  {i > 0 && <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: '50%', background: TEAL, flexShrink: 0 }} />}
                  <span data-step style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.68)' }}>
                    {step}
                  </span>
                </span>
              ))}
            </div>
            <div style={{ marginTop: 44 }}>
              <a data-cta href="#reserva"
                className="pointer-events-auto inline-flex items-center transition-all hover:-translate-y-0.5 hover:brightness-110"
                style={{
                  padding: '17px 40px', borderRadius: 14,
                  background: `linear-gradient(135deg, ${TEAL} 0%, ${VIOLET} 100%)`,
                  color: '#020d18', fontWeight: 700, fontSize: 13.5,
                  letterSpacing: '0.07em', textTransform: 'uppercase', textDecoration: 'none',
                  boxShadow: '0 20px 55px -12px rgba(0,230,180,.50), 0 8px 28px -8px rgba(108,99,255,.38)',
                }}>
                Agendar consulta
              </a>
            </div>
          </div>
        </div>

        {/* Hint scroll */}
        <div ref={hintRef} aria-hidden="true"
          style={{ position: 'absolute', bottom: '4vh', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.24em', color: 'rgba(255,255,255,.38)', textTransform: 'uppercase' }}>
            Desplázate
          </span>
          <span style={{ width: 1, height: 32, background: `linear-gradient(${TEAL}, transparent)` }} />
        </div>

        {/* Riel de progreso */}
        <div className="hidden md:flex" style={{ position: 'absolute', right: '3vw', top: '50%', transform: 'translateY(-50%)', flexDirection: 'column', alignItems: 'center', gap: 12, pointerEvents: 'none' }}>
          <div style={{ position: 'relative', width: 1, height: 110, background: 'rgba(255,255,255,.12)' }}>
            <div ref={railFillRef} style={{ position: 'absolute', inset: 0, background: TEAL, transformOrigin: 'top', transform: 'scaleY(0)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['01','02','03','04','05'].map((n, i) => (
              <span key={n} ref={el => (railRefs.current[i] = el)}
                style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: i === 0 ? TEAL : 'rgba(255,255,255,.25)', transition: 'color .3s' }}>
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}