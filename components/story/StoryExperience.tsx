'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/* ─── Chapter content (the cosmic odyssey) ────────────────────────────── */
interface Chapter {
  n: string;
  kicker: string;
  title: string;
  body: string;
}

const CHAPTERS: Chapter[] = [
  {
    n: '01',
    kicker: 'Ignition',
    title: 'We left the pale blue cradle',
    body: 'Engines breathe. The only home we have ever known shrinks to a single trembling point of light — and then to nothing at all.',
  },
  {
    n: '02',
    kicker: 'The Long Drift',
    title: 'Silence between the worlds',
    body: 'For a thousand sleeping days there is no up, no down — only the slow turning of the stars and the hum of the ship like a heartbeat in the dark.',
  },
  {
    n: '03',
    kicker: 'Nebula Bloom',
    title: 'A storm of newborn light',
    body: 'We fall through clouds the size of solar systems, where suns are still being made. Colour pours over the hull like wet paint — magenta, ember, gold.',
  },
  {
    n: '04',
    kicker: 'Event Horizon',
    title: 'The edge of forever',
    body: 'Ahead, a wound in spacetime. Light bends and pools into a ring of fire. Time itself slows to a held breath as we skim the rim of the unknowable.',
  },
  {
    n: '05',
    kicker: 'Starfall',
    title: 'A billion suns, and home',
    body: 'And then — emergence. A new shore of the galaxy unfurls, oceans of stars from horizon to horizon. The journey was never about the destination.',
  },
];

/* Palette stops the background lerps through as you scroll (a, b, accent). */
const PALETTE_HEX = [
  { a: '#02060f', b: '#0a1f30', c: '#3ad9c5' }, // ignition — teal
  { a: '#070718', b: '#221048', c: '#7b6bff' }, // drift — violet
  { a: '#1a0622', b: '#481140', c: '#ff5fa2' }, // nebula — magenta
  { a: '#060403', b: '#1f1407', c: '#ffb43a' }, // event horizon — gold
  { a: '#03141f', b: '#0c4b66', c: '#8fe7ff' }, // starfall — luminous cyan
];

/* ─── Shaders: painterly, cursor-reactive nebula ──────────────────────── */
const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform vec3  uColorC;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 6; i++) {
      v += amp * noise(p);
      p = rot * p * 2.0 + 0.12;
      amp *= 0.5;
    }
    return v;
  }

  float starLayer(vec2 uv, float density, float sharp, float tw) {
    vec2 g = floor(uv * density);
    float h = hash(g);
    float s = smoothstep(sharp, 1.0, h);
    s *= 0.55 + 0.45 * sin(uTime * tw + h * 6.2831);
    return s;
  }

  void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 uv = vUv;
    vec2 p = uv - 0.5; p.x *= aspect;
    vec2 m = uMouse - 0.5; m.x *= aspect;

    float t = uTime * 0.04;

    // cursor ripple — paint flows toward the pointer
    vec2 toM = p - m;
    float md = length(toM);
    float ripple = exp(-md * md * 3.5);

    // domain-warped fbm for the painted look, nudged by the cursor
    vec2 warp = vec2(fbm(p * 1.5 + t + m * 0.6), fbm(p * 1.5 - t + 7.0));
    warp += 0.4 * ripple * normalize(toM + 1e-4) * sin(uTime * 1.4 - md * 8.0);

    vec2 q = p + 0.6 * warp;
    float n  = fbm(q * 1.8 + vec2(0.0, -t * 1.2));
    float n2 = fbm(q * 3.6 - t * 0.5);

    vec3 col = mix(uColorA, uColorB, smoothstep(0.12, 0.92, n));
    col = mix(col, uColorC, pow(smoothstep(0.4, 1.0, n2), 2.0) * 0.7);
    col += uColorC * ripple * 0.55;            // glow under the cursor
    col += uColorC * 0.16 * pow(max(n, 0.0), 3.0); // bright filaments

    // parallax star fields drifting with scroll
    vec2 suv = uv * vec2(aspect, 1.0);
    float st  = starLayer(suv + vec2(0.0, uScroll * 0.45), 220.0, 0.86, 2.0) * 0.9;
    st       += starLayer(suv * 1.7 + vec2(12.0, uScroll * 0.8), 380.0, 0.92, 3.0) * 0.55;
    col += vec3(st);

    // vignette + grain
    float vig = smoothstep(1.18, 0.25, length((uv - 0.5) * vec2(aspect, 1.0)));
    col *= 0.32 + 0.68 * vig;
    col += (hash(uv * uResolution + uTime) * 2.0 - 1.0) * 0.022;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function StoryExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const palettes = PALETTE_HEX.map((p) => ({
      a: new THREE.Color(p.a),
      b: new THREE.Color(p.b),
      c: new THREE.Color(p.c),
    }));
    // which palette the background is easing toward (set by the active section)
    let targetPaletteIndex = 0;

    /* ── Three.js painted background ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColorA: { value: palettes[0].a.clone() },
      uColorB: { value: palettes[0].b.clone() },
      uColorC: { value: palettes[0].c.clone() },
    };

    const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w, h);
    };
    resize();

    // smoothed cursor
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const curMouse = new THREE.Vector2(0.5, 0.5);
    const onPointer = (e: PointerEvent) => {
      targetMouse.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };

    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      curMouse.lerp(targetMouse, 0.06);
      uniforms.uMouse.value.copy(curMouse);

      const prog = scrollProgress.current;
      uniforms.uScroll.value = prog;

      // ease the palette toward the active chapter's colors — each section
      // reveals its own palette while transitions stay fluid frame to frame.
      const tp = palettes[targetPaletteIndex];
      uniforms.uColorA.value.lerp(tp.a, 0.06);
      uniforms.uColorB.value.lerp(tp.b, 0.06);
      uniforms.uColorC.value.lerp(tp.c, 0.06);

      if (barRef.current) barRef.current.style.transform = `scaleX(${prog})`;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer);

    /* ── Lenis smooth scroll + GSAP ScrollTrigger ── */
    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;
    if (!prefersReduced) {
      lenis = new Lenis({ duration: 1.2, wheelMultiplier: 1, touchMultiplier: 1.4 });
      lenis.on('scroll', ({ progress }: { progress: number }) => {
        scrollProgress.current = progress;
        ScrollTrigger.update();
      });
      const ticker = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
      (lenis as Lenis & { _gsapTicker?: typeof ticker })._gsapTicker = ticker;
    } else {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.current = max > 0 ? window.scrollY / max : 0;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.story-chapter');

      // Cinematic reveals — skipped entirely for reduced-motion users so that
      // content is never left hidden (it is visible by default in the markup).
      if (!prefersReduced) {
        gsap.from('[data-hero]', {
          y: 40,
          opacity: 0,
          filter: 'blur(16px)',
          duration: 1.4,
          ease: 'power3.out',
          stagger: 0.15,
          delay: 0.15,
        });

        sections.forEach((section) => {
          const items = section.querySelectorAll('[data-anim]');
          gsap.fromTo(
            items,
            { y: 90, opacity: 0, filter: 'blur(14px)' },
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 1.2,
              ease: 'power3.out',
              stagger: 0.12,
              scrollTrigger: {
                trigger: section,
                start: 'top 72%',
                end: 'top 28%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          const numeral = section.querySelector('[data-parallax]');
          if (numeral) {
            gsap.to(numeral, {
              yPercent: -28,
              ease: 'none',
              scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
            });
          }
        });
      }

      // Active-chapter tracking: drives the dot nav + the target palette.
      sections.forEach((section, idx) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (!self.isActive) return;
            setActive(idx + 1);
            targetPaletteIndex = Math.min(idx, palettes.length - 1);
          },
        });
      });

      ScrollTrigger.create({
        trigger: '[data-hero-section]',
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (!self.isActive) return;
          setActive(0);
          targetPaletteIndex = 0;
        },
      });
    });

    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (lenis) {
        const ticker = (lenis as Lenis & { _gsapTicker?: (t: number) => void })._gsapTicker;
        if (ticker) gsap.ticker.remove(ticker);
        lenis.destroy();
      }
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="story-root relative w-full bg-[#02040a] text-white">
      {/* painted texture background */}
      <canvas ref={canvasRef} className="fixed inset-0 h-full w-full" style={{ zIndex: 0 }} />

      {/* scroll progress bar */}
      <div
        className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-amber-300"
        style={{ transform: 'scaleX(0)' }}
        ref={barRef}
      />

      {/* chapter dots */}
      <nav className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
        {['00', ...CHAPTERS.map((c) => c.n)].map((n, i) => (
          <span
            key={n}
            aria-hidden
            className={`h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
              active === i
                ? 'scale-125 border-white bg-white'
                : 'border-white/40 bg-transparent'
            }`}
          />
        ))}
      </nav>

      {/* HERO */}
      <section
        data-hero-section
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <span
          data-hero
          className="mb-6 inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.35em] text-white/70 backdrop-blur-sm"
        >
          A Space Odyssey
        </span>
        <h1
          data-hero
          className="text-6xl font-black tracking-tight text-white sm:text-8xl md:text-9xl"
          style={{ textShadow: '0 0 60px rgba(120,180,255,0.35)' }}
        >
          STAR DRIFT
        </h1>
        <p data-hero className="mt-6 max-w-md text-base text-white/60 sm:text-lg">
          Five chapters across the dark. Scroll to begin the descent.
        </p>
        <div data-hero className="mt-14 flex flex-col items-center gap-2 text-white/50">
          <span className="text-[11px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="story-scroll-dot h-9 w-[1px] bg-gradient-to-b from-white/70 to-transparent" />
        </div>
      </section>

      {/* CHAPTERS */}
      {CHAPTERS.map((c, i) => (
        <section
          key={c.n}
          className="story-chapter relative z-10 flex min-h-screen items-center px-6 sm:px-12 lg:px-24"
        >
          <div
            className={`relative w-full max-w-2xl ${
              i % 2 === 1 ? 'ml-auto text-right' : 'mr-auto text-left'
            }`}
          >
            <span
              data-parallax
              aria-hidden
              className="pointer-events-none absolute -top-24 select-none text-[9rem] font-black leading-none text-white/[0.06] sm:text-[14rem]"
              style={i % 2 === 1 ? { right: 0 } : { left: 0 }}
            >
              {c.n}
            </span>
            <p
              data-anim
              className="relative mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/70"
            >
              Chapter {c.n} — {c.kicker}
            </p>
            <h2
              data-anim
              className="relative text-4xl font-bold leading-[1.1] text-white sm:text-6xl"
              style={{ textShadow: '0 0 40px rgba(0,0,0,0.5)' }}
            >
              {c.title}
            </h2>
            <p data-anim className="relative mt-6 text-lg leading-relaxed text-white/75 sm:text-xl">
              {c.body}
            </p>
          </div>
        </section>
      ))}

      {/* OUTRO */}
      <section className="story-chapter relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h2 data-anim className="text-4xl font-bold text-white sm:text-6xl" style={{ textShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
          The journey never ends.
        </h2>
        <p data-anim className="mt-6 max-w-md text-white/60">
          Every horizon is only another beginning, drifting out beyond the light.
        </p>
        <a
          data-anim
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="mt-10 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white hover:text-white"
        >
          ↑ Return to the cradle
        </a>
      </section>
    </div>
  );
}
