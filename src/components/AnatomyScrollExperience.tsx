/**
 * AnatomyScrollExperience.tsx  v5 — modelo persistente en toda la página
 * ────────────────────────────────────────────
 * Carga el modelo knee.glb generado con Tripo3D.
 * Materiales aplicados desde código → teal/ivory/violet por acto.
 * El Canvas es GLOBAL y fijo (AnatomyGlobalCanvas, montado en App):
 * fuera de la sección de anatomía el modelo orbita pequeño al costado
 * siguiendo el scroll de la página; al entrar en la sección toma el
 * centro y ejecuta la coreografía por actos (rotación amortiguada +
 * vista explosionada de capas hueso/cartílago/ligamento).
 *
 * REQUIERE: public/models/knee.glb
 * DEPS:  three  @react-three/fiber  @react-three/drei
 */
import { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, invalidate, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Precargar el GLB para que esté listo cuando el usuario llegue a la sección
useGLTF.preload('/models/knee.glb');

/* ── Paleta ──────────────────────────────────────── */
const TEAL   = '#60A5FA';
const VIOLET = '#0D9488';
const BONE_BASE_COLOR = new THREE.Color('#ddd4be');
const BONE_VIOLET_COLOR = new THREE.Color('#e0d4b0');
const WARM_WHITE = new THREE.Color('#fff8f0');
const TEAL_COLOR = new THREE.Color(TEAL);
const VIOLET_COLOR = new THREE.Color(VIOLET);

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

/* ── Estado compartido sección ↔ lienzo global ─────
   La sección escribe su progreso y su elemento; el Canvas fijo
   (montado en App) los lee cada frame para posicionar el modelo. */
const anatomyShared = {
  progress: 0,
  sectionEl: null as HTMLElement | null,
};
const REDUCED_MOTION = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Perfil móvil (mismo criterio pointer:coarse que App) ──
   Menos resolución, damping que se asienta antes (menos frames por
   scroll) y modelo más discreto para no estorbar la lectura. */
const IS_COARSE = typeof window !== 'undefined'
  && window.matchMedia('(pointer: coarse)').matches;
const DAMP   = IS_COARSE ? 0.18 : 0.14; // factor de inercia por frame
const OUT_OP = IS_COARSE ? 0.26 : 0.40; // opacidad del lienzo fuera de la sección
const IN_OP  = IS_COARSE ? 0.88 : 1;    // opacidad dentro (móvil: texto centrado encima)
const OUT_SC = IS_COARSE ? 0.38 : 0.52; // escala del modelo fuera de la sección

/* ── Materiales médicos ───────────────────────────── */
// Todos los materiales parten de hueso marfil.
// El cartílago y ligamento se detectan por tamaño relativo.
const baseBone = () => new THREE.MeshStandardMaterial({
  color: '#ddd8c8', roughness: 0.72, metalness: 0,
});
const baseCartilage = () => new THREE.MeshStandardMaterial({
  color: '#c8e0e8', roughness: 0.55, metalness: 0,
  emissive: new THREE.Color('#60A5FA'), emissiveIntensity: 0,
  transparent: true, opacity: 0.92,
});
const baseLigament = () => new THREE.MeshStandardMaterial({
  color: '#e4dcc8', roughness: 0.68, metalness: 0,
  emissive: new THREE.Color('#60A5FA'), emissiveIntensity: 0,
});

/* ── Escena 3D con GLB ────────────────────────────── */
function KneeModel({ wrapperRef }: { wrapperRef: React.RefObject<HTMLDivElement> }) {
  const { scene } = useGLTF('/models/knee.glb');
  const viewport  = useThree(s => s.viewport);
  const groupRef  = useRef<THREE.Group>(null);
  const keyRef    = useRef<THREE.PointLight>(null);
  const fillRef   = useRef<THREE.PointLight>(null);
  const boneMeshesRef = useRef<THREE.Mesh[]>([]);
  const cartilageMeshesRef = useRef<THREE.Mesh[]>([]);
  const ligamentMeshesRef = useRef<THREE.Mesh[]>([]);
  const midKeyColorRef = useRef(new THREE.Color());
  // Valores amortiguados: el modelo persigue al scroll con inercia en vez de seguirlo 1:1
  const smoothPRef    = useRef(0);  // progreso dentro de la sección de anatomía
  const smoothInRef   = useRef(0);  // presencia en la sección (0 fuera → 1 dentro)
  const smoothPageRef = useRef(0);  // progreso de scroll de toda la página

  /* Clasificar y aplicar materiales al montar */
  useLayoutEffect(() => {
    const meshes: THREE.Mesh[] = [];
    boneMeshesRef.current = [];
    cartilageMeshesRef.current = [];
    ligamentMeshesRef.current = [];
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
        boneMeshesRef.current.push(m);
      } else if (ratio > 0.04) {
        // Piezas medianas → cartílago/menisco
        m.material = baseCartilage();
        m.userData.type = 'cartilage';
        cartilageMeshesRef.current.push(m);
      } else {
        // Piezas pequeñas → ligamentos/tendones
        m.material = baseLigament();
        m.userData.type = 'ligament';
        ligamentMeshesRef.current.push(m);
      }
      m.castShadow = m.receiveShadow = true;
    });

    /* Centrar y normalizar escala */
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const sizeV  = box.getSize(new THREE.Vector3());
    const maxSide = Math.max(sizeV.x, sizeV.y, sizeV.z);

    /* Vector radial de cada pieza (desde el centro del modelo) para la vista
       explosionada: las capas se separan a lo largo de él y vuelven a ensamblarse */
    meshes.forEach(m => {
      const c = new THREE.Box3().setFromObject(m).getCenter(new THREE.Vector3());
      m.userData.orig   = m.position.clone();
      m.userData.radial = c.sub(center);
    });

    scene.position.sub(center);
    scene.scale.setScalar(5.2 / maxSide);
  }, [scene]);

  useFrame(() => {
    /* Presencia en la sección de anatomía: 0 fuera → 1 con la sección fijada */
    const vh = window.innerHeight;
    let inTarget = 0;
    const el = anatomyShared.sectionEl;
    if (el) {
      const rect = el.getBoundingClientRect();
      const approach = clamp01((vh - rect.top) / vh);
      const leaveP   = clamp01(1 - rect.bottom / vh);
      inTarget = approach * (1 - leaveP);
    }
    const maxScroll = document.documentElement.scrollHeight - vh;
    const pageTarget = maxScroll > 0 ? clamp01(window.scrollY / maxScroll) : 0;

    /* Amortiguación: perseguir los objetivos y seguir renderizando hasta asentarse */
    const pTarget = anatomyShared.progress;
    const p   = smoothPRef.current    + (pTarget    - smoothPRef.current)    * 0.14;
    const inS = smoothInRef.current   + (inTarget   - smoothInRef.current)   * 0.14;
    const pgP = smoothPageRef.current + (pageTarget - smoothPageRef.current) * 0.14;
    smoothPRef.current = p; smoothInRef.current = inS; smoothPageRef.current = pgP;
    if (Math.abs(pTarget - p) > 0.0005 || Math.abs(inTarget - inS) > 0.0005 || Math.abs(pageTarget - pgP) > 0.0005)
      invalidate();

    /* Opacidad del lienzo: protagonista en la sección, presencia sutil fuera */
    if (wrapperRef.current)
      wrapperRef.current.style.opacity = (0.4 + 0.6 * inS).toFixed(3);

    if (!groupRef.current) return;
    const g = groupRef.current;

    /* Fuera de la sección: costado derecho, pequeño (sin salirse en móvil) */
    const sideX = Math.min(2.3, viewport.width * 0.30);
    g.position.x = sideX  * (1 - inS);
    g.position.y = -0.15  * (1 - inS);

    if (REDUCED_MOTION) {
      g.rotation.set(-0.05, 0.6, 0);
      g.scale.setScalar(0.52 + (0.9 - 0.52) * inS);
      return;
    }

    /* Rotación: fuera de la sección gira con el scroll de página;
       dentro, la coreografía por actos toma el control */
    const actRotY = keyed(p, [[0,0],[0.2,0.5],[0.4,1.4],[0.6,2.4],[0.8,Math.PI*1.45],[1,Math.PI*1.65]]);
    const pageRotY = pgP * Math.PI * 4;
    g.rotation.y = pageRotY + (actRotY - pageRotY) * inS;
    const actRotX = keyed(p, [[0,-0.05],[0.4,0],[0.8,0.06],[1,0.06]]);
    g.rotation.x = 0.06 + (actRotX - 0.06) * inS;

    /* Escala: zoom sutil en acto 2, dolly-out final; reducido fuera de la sección */
    const actScale = keyed(p, [[0,0.90],[0.2,1.05],[0.4,1.0],[0.6,0.97],[0.8,0.88],[1,0.70]]);
    g.scale.setScalar(0.52 + (actScale - 0.52) * inS);

    /* Vista explosionada: cada capa se separa radialmente en los actos 2-3
       y se reensambla hacia el acto 4 (efecto "despliegue anatómico") */
    const exBone = 0.10 * keyed(p, [[0.18,0],[0.34,1],[0.58,1],[0.72,0]]);
    const exCart = 0.38 * keyed(p, [[0.18,0],[0.30,1],[0.50,1],[0.64,0]]);
    const exLiga = 0.60 * keyed(p, [[0.38,0],[0.50,1],[0.62,1],[0.74,0]]);
    const explode = (m: THREE.Mesh, amount: number) => {
      const orig   = m.userData.orig   as THREE.Vector3 | undefined;
      const radial = m.userData.radial as THREE.Vector3 | undefined;
      if (orig && radial) m.position.copy(orig).addScaledVector(radial, amount);
    };

    /* Efectos de material por acto */
    for (const m of cartilageMeshesRef.current) {
      explode(m, exCart);
      const mat = m.material as THREE.MeshStandardMaterial | undefined;
      if (!mat) continue;
      /* Act 2: cartílagos brillan teal */
      mat.emissiveIntensity = 0.55 * smooth(p, 0.18, 0.28) * (1 - smooth(p, 0.44, 0.54));
      mat.opacity = clamp01(0.35 + 0.65 * (1 - smooth(p, 0.44, 0.54)));
    }

    for (const m of ligamentMeshesRef.current) {
      explode(m, exLiga);
      const mat = m.material as THREE.MeshStandardMaterial | undefined;
      if (!mat) continue;
      /* Act 2-3: ligamentos con glow */
      mat.emissiveIntensity = 0.45 * smooth(p, 0.22, 0.32) * (1 - smooth(p, 0.50, 0.60));
    }

    const toV = smooth(p, 0.60, 0.74) * inS;
    for (const m of boneMeshesRef.current) {
      explode(m, exBone);
      const mat = m.material as THREE.MeshStandardMaterial | undefined;
      if (!mat) continue;
      /* Act 4: hueso con tinte violeta */
      mat.color.lerpColors(BONE_BASE_COLOR, BONE_VIOLET_COLOR, toV);
    }

    /* Luz key: blanco cálido → teal sutil → violeta en acto 4 */
    if (keyRef.current) {
      const toT = smooth(p, 0.10, 0.30); // blanco → teal suave
      const toViolet = smooth(p, 0.58, 0.72) * inS; // teal → violeta (solo dentro de la sección)
      const midColor = midKeyColorRef.current.copy(WARM_WHITE).lerp(TEAL_COLOR, toT * 0.45);
      keyRef.current.color.copy(midColor).lerp(VIOLET_COLOR, toViolet);
      keyRef.current.intensity = 2.2 + 1.2 * smooth(p, 0.60, 0.72) * (1 - smooth(p, 0.82, 0.94));
    }
    if (fillRef.current) {
      fillRef.current.intensity = 0.6 + 0.5 * smooth(p, 0.60, 0.72);
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.28} color="#fdf6e8" />
      <pointLight ref={keyRef}  color="#fff8f0"  position={[3.0, 3.5, 4.5]} intensity={2.2} decay={0} />
      <pointLight ref={fillRef} color="#f3e0b8"  position={[-4, -2.0, 2.5]} intensity={0.6} decay={0} />
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

/* ── Lienzo global fijo ───────────────────────────────
   Se monta UNA vez en App, detrás del contenido (zIndex 0,
   pointer-events none). El modelo acompaña todo el scroll. */
export function AnatomyGlobalCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Con frameloop="demand" hay que pedir frame en cada scroll de la página
  useEffect(() => {
    const onScroll = () => invalidate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div ref={wrapperRef} aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.4 }}>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.25]}
        camera={{ position: [0, 0, 7], fov: 36 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ invalidate }) => invalidate()}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={<KneeFallback />}>
          <KneeModel wrapperRef={wrapperRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* ── Fondos radiales por acto ─────────────────────── */
const BGS = [
  'radial-gradient(900px 600px at 65% 44%, rgba(96,165,250,.12) 0%, transparent 65%)',
  'radial-gradient(800px 550px at 30% 50%, rgba(96,165,250,.14) 0%, transparent 60%), radial-gradient(600px 400px at 75% 28%, rgba(168,216,234,.08) 0%, transparent 55%)',
  'radial-gradient(900px 600px at 68% 48%, rgba(59,130,246,.10) 0%, transparent 65%), radial-gradient(600px 400px at 30% 60%, rgba(186,230,253,.06) 0%, transparent 55%)',
  'radial-gradient(1000px 700px at 50% 55%, rgba(13,148,136,.22) 0%, transparent 65%)',
  'radial-gradient(1100px 750px at 50% 45%, rgba(96,165,250,.11) 0%, transparent 65%), radial-gradient(800px 500px at 60% 60%, rgba(13,148,136,.10) 0%, transparent 55%)',
];

/* ── Estilos ──────────────────────────────────────── */
const MONO = '"IBM Plex Mono", monospace';
const tagSt: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 10,
  fontFamily: MONO, fontSize: 10, letterSpacing: '0.22em',
  textTransform: 'uppercase', color: 'rgba(255,255,255,.38)', fontWeight: 400,
};
const dash: React.CSSProperties = { width: 18, height: 1, background: 'rgba(255,255,255,.25)', opacity: 0.8 };
const h3St: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: 'clamp(34px, 4.4vw, 58px)', fontWeight: 700,
  lineHeight: 1.12, letterSpacing: '-0.02em',
  color: 'rgba(255,255,255,.95)', margin: '10px 0 0',
};
const subSt: React.CSSProperties = {
  marginTop: 14, fontSize: 15, lineHeight: 1.6,
  color: 'rgba(255,255,255,.48)', fontWeight: 300,
};

/* ── Componente principal ─────────────────────────── */
export function AnatomyScrollExperience() {
  const sectionRef    = useRef<HTMLElement>(null);
  const actRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const bgRefs        = useRef<(HTMLDivElement | null)[]>([]);
  const railFillRef   = useRef<HTMLDivElement>(null);
  const railRefs      = useRef<(HTMLSpanElement | null)[]>([]);
  const hintRef       = useRef<HTMLDivElement>(null);
  const metricValRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Registrar la sección para que el lienzo global sepa dónde centrar el modelo
  useEffect(() => {
    anatomyShared.sectionEl = sectionRef.current;
    return () => { anatomyShared.sectionEl = null; };
  }, []);

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
            anatomyShared.progress = self.progress;
            invalidate();
            const idx = Math.min(4, Math.floor(self.progress * 5));
            railRefs.current.forEach((r, i) => {
              if (!r) return;
              r.style.background = i === idx ? TEAL : 'rgba(255,255,255,.2)';
              r.style.transform  = i === idx ? 'scale(1.4)' : 'scale(1)';
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

  return (
    <section
      ref={sectionRef}
      aria-label="Recorrido anatómico interactivo"
      style={{ height: '500vh', position: 'relative', background: 'transparent' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: 'transparent' }}>

        {/* Fondos por acto (el modelo 3D vive en el lienzo global, detrás) */}
        {BGS.map((bg, i) => (
          <div key={i} ref={el => (bgRefs.current[i] = el)} aria-hidden="true"
            style={{ position: 'absolute', inset: 0, background: bg, opacity: i === 0 ? 1 : 0 }} />
        ))}

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
                  boxShadow: '0 20px 55px -12px rgba(59,130,246,.50), 0 8px 28px -8px rgba(13,148,136,.38)',
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

        {/* Riel de progreso — solo la línea y un dot activo */}
        <div className="hidden md:flex" style={{ position: 'absolute', right: '3vw', top: '50%', transform: 'translateY(-50%)', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
          <div style={{ position: 'relative', width: 1, height: 110, background: 'rgba(255,255,255,.12)' }}>
            <div ref={railFillRef} style={{ position: 'absolute', inset: 0, background: TEAL, transformOrigin: 'top', transform: 'scaleY(0)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['','','','',''].map((_, i) => (
              <span key={i} ref={el => (railRefs.current[i] = el)}
                style={{ display: 'block', width: 5, height: 5, borderRadius: '50%',
                  background: i === 0 ? TEAL : 'rgba(255,255,255,.2)',
                  transition: 'background .3s, transform .3s',
                  transform: i === 0 ? 'scale(1.4)' : 'scale(1)' }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}