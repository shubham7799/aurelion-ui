import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

/** Whether an element's box is at least partly within the first screen. */
const inViewport = (rect: DOMRect) => rect.bottom > 0 && rect.top < window.innerHeight;

/**
 * The longest the loader will hold the page back, whatever is still in
 * flight. A hard ceiling matters more than the exact number: `Promise.all`
 * has no deadline of its own, so a single request that never settles — a
 * stalled font, an image whose src resolves to nothing — would otherwise
 * pin the counter at its ceiling indefinitely. Wider than before now that a
 * video can be part of the wait: it needs real room to buffer, not the couple
 * of seconds that was only ever meant to cover a font and a handful of images.
 */
const ASSET_TIMEOUT_MS = 6000;
/**
 * Fonts get a shorter leash of their own: they come from a third party
 * (fonts.gstatic.com), so they're the most likely thing to hang, and the
 * stylesheet asks for `display=swap` anyway — text is already on screen in a
 * fallback, so there's no flash being hidden by waiting on them.
 */
const FONT_TIMEOUT_MS = 1500;

/** Settles with the promise, or on its own once `ms` is up — whichever first. */
const withTimeout = (promise: Promise<unknown>, ms: number): Promise<void> =>
  Promise.race([
    promise,
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, ms);
    }),
  ]).then(() => undefined);

/**
 * Waits only for what the first screen actually needs — the images, video
 * posters, and video playability already sitting in the initial viewport
 * (a video only exists in this list on the homepage, so this is naturally a
 * no-op on every other route), plus the fonts they're set in, and never for
 * longer than ASSET_TIMEOUT_MS. Everything further down the page — every
 * other section's photos — keeps loading in the background exactly as the
 * browser would anyway; the preloader no longer holds the door shut for
 * assets nobody can see yet, and anything that overruns simply finishes
 * behind the revealed page.
 */
function waitForAssets(): Promise<void> {
  const preload = (src: string) =>
    new Promise<void>((resolve) => {
      const probe = new Image();
      probe.onload = () => resolve();
      probe.onerror = () => resolve();
      probe.src = src;
    });

  const imagePromises = Array.from(document.images)
    .filter((img) => inViewport(img.getBoundingClientRect()))
    .map((img) => (img.complete ? Promise.resolve() : preload(img.currentSrc || img.src)));

  const videos = Array.from(document.querySelectorAll('video')).filter((video) =>
    inViewport(video.getBoundingClientRect())
  );

  // A <video poster> isn't an <img>, so `document.images` never sees it — the
  // still frame a visitor sees before playback starts is fetched separately.
  const posterPromises = videos.map((video) => video.poster).filter(Boolean).map(preload);

  // The loader shouldn't hand off to a video that hasn't actually started
  // playing — a frozen frame (or nothing at all, with no poster) sitting
  // still while the rest of the page is already live reads as broken, which
  // is exactly what was happening. `canplay` is the browser's own bar for
  // "this can start now", not "the whole file is down" — that's what
  // `canplaythrough` would ask for, and for a multi-megabyte clip that can
  // take far longer than is worth holding the page for.
  const videoReadyPromises = videos.map(
    (video) =>
      new Promise<void>((resolve) => {
        if (video.readyState >= video.HAVE_FUTURE_DATA) {
          resolve();
          return;
        }
        video.addEventListener('canplay', () => resolve(), { once: true });
        // A video that errors out should never hang the loader forever.
        video.addEventListener('error', () => resolve(), { once: true });
      })
  );

  const fontsPromise = withTimeout(document.fonts?.ready ?? Promise.resolve(), FONT_TIMEOUT_MS);

  return withTimeout(
    Promise.all([...imagePromises, ...posterPromises, ...videoReadyPromises, fontsPromise]),
    ASSET_TIMEOUT_MS
  );
}

const SHAPE_WIDTH = 76;
const SHAPE_HEIGHT = (SHAPE_WIDTH * 91) / 114;

export default function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const outlineLayerRef = useRef<HTMLDivElement>(null);
  const fillLayerRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const counter = { value: 0 };

    const render = () => {
      const value = Math.round(counter.value);
      if (countRef.current) countRef.current.textContent = String(value).padStart(2, '0');
      if (fillLayerRef.current) {
        // clip-path percentages are relative to this element's own box (the full
        // viewport), not the small logo shape centered inside it — so the clip has to
        // be computed in real pixels against the shape's actual on-screen bounds.
        const shapeTop = (window.innerHeight - SHAPE_HEIGHT) / 2;
        const filledFromBottom = (SHAPE_HEIGHT * counter.value) / 100;
        const clipTop = shapeTop + (SHAPE_HEIGHT - filledFromBottom);
        fillLayerRef.current.style.clipPath = `inset(${clipTop}px 0 0 0)`;
      }
    };

    const reveal = () => {
      const backdrop = backdropRef.current;
      if (!backdrop) return;

      // Same "center, 76px" formula the outline/fill layers use — the hole and the
      // visible shape are driven by identical mask math, so they can never drift apart.
      const holeSize = { value: SHAPE_WIDTH };
      const targetSize = Math.max(window.innerWidth, window.innerHeight) * 3;

      const setMaskSize = () => {
        const value = `100% 100%, ${holeSize.value}px auto`;
        backdrop.style.setProperty('mask-size', value);
        backdrop.style.setProperty('-webkit-mask-size', value);
      };

      const punchHole = () => {
        const maskImage = 'linear-gradient(#fff, #fff), url(/loader-logo-fill.svg)';
        backdrop.style.setProperty('mask-image', maskImage);
        backdrop.style.setProperty('-webkit-mask-image', maskImage);
        backdrop.style.setProperty('mask-repeat', 'no-repeat, no-repeat');
        backdrop.style.setProperty('-webkit-mask-repeat', 'no-repeat, no-repeat');
        backdrop.style.setProperty('mask-position', 'center, center');
        backdrop.style.setProperty('-webkit-mask-position', 'center, center');
        backdrop.style.setProperty('mask-mode', 'luminance, alpha');
        backdrop.style.setProperty('mask-composite', 'exclude');
        backdrop.style.setProperty('-webkit-mask-composite', 'xor');
        setMaskSize();
      };

      // Hide the counter + logo and cut the hole instantly, in the same tick — no
      // fade, no delay, so the reveal happens the moment loading completes.
      gsap.set([countRef.current, fillLayerRef.current, outlineLayerRef.current], { opacity: 0 });
      punchHole();

      const tl = gsap.timeline({ onComplete });

      tl.to(backdrop, { backgroundColor: '#ffffff', duration: 0.6, ease: 'power1.in' }, 0)
        // expo.in: the hole barely grows at first, then explodes outward — matches the reference reveal.
        .to(holeSize, { value: targetSize, duration: 0.8, ease: 'expo.in', onUpdate: setMaskSize }, 0.03)
        .to(rootRef.current, { opacity: 0, duration: 0.2 }, '-=0.15');
    };

    // Two legs, not one: a quick climb to 70 so it reads as responsive
    // straight away, then a slow trickle toward 96 for as long as the wait
    // lasts. A single tween reached its ceiling and stopped dead, so any
    // remaining wait looked like a freeze rather than work still happening.
    // Killed wherever it's got to the moment waitForAssets resolves.
    const softTween = gsap
      .timeline()
      .to(counter, { value: 70, duration: 0.8, ease: 'power1.out', onUpdate: render })
      .to(counter, { value: 96, duration: 6, ease: 'power1.out', onUpdate: render });

    waitForAssets().then(() => {
      softTween.kill();
      // The finish is a quick snap to 100, not another simulated wait — its
      // duration only scales with how far the soft tween actually got, so a
      // near-instant load (little ground covered) still reads as motion
      // rather than a blink, and a load that got most of the way there
      // doesn't sit through a needless extra second closing the last few
      // percent.
      const duration = 0.25 + 0.35 * ((100 - counter.value) / 100);
      gsap.to(counter, {
        value: 100,
        duration,
        ease: 'power2.out',
        onUpdate: render,
        onComplete: reveal,
      });
    });

    return () => {
      softTween.kill();
    };
  }, [onComplete]);

  return (
    <div ref={rootRef} className="preloader">
      <div ref={backdropRef} className="preloader-backdrop" />
      <div
        ref={outlineLayerRef}
        className="preloader-outline-layer"
        style={{ WebkitMaskImage: 'url(/loader-logo.svg)', maskImage: 'url(/loader-logo.svg)' }}
      />
      <div
        ref={fillLayerRef}
        className="preloader-fill-layer"
        style={{ WebkitMaskImage: 'url(/loader-logo-fill.svg)', maskImage: 'url(/loader-logo-fill.svg)' }}
      />
      <span ref={countRef} className="preloader-count">
        00
      </span>
    </div>
  );
}
