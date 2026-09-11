import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

/** Whether an element's box is at least partly within the first screen. */
const inViewport = (rect: DOMRect) => rect.bottom > 0 && rect.top < window.innerHeight;

/**
 * Waits only for what the first screen actually needs — the images (and video
 * posters) already sitting in the initial viewport, plus the fonts they're
 * set in. Everything further down the page — every other section's photos,
 * and the video files themselves — keeps loading in the background exactly as
 * the browser would anyway; the preloader no longer holds the door shut for
 * assets nobody can see yet, which used to include a multi-megabyte hero clip
 * and a whole page's worth of below-the-fold photography.
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

  // A <video poster> isn't an <img>, so `document.images` never sees it — the
  // still frame a visitor sees before playback starts is fetched separately.
  const posterPromises = Array.from(document.querySelectorAll('video'))
    .filter((video) => inViewport(video.getBoundingClientRect()))
    .map((video) => video.poster)
    .filter(Boolean)
    .map(preload);

  const fontsPromise: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();

  return Promise.all([...imagePromises, ...posterPromises, fontsPromise]).then(() => undefined);
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

    // Keeps the counter visibly climbing while assets are still in flight —
    // now scoped to just the first screen, so this rarely runs to completion
    // before waitForAssets resolves and cuts it off.
    const softTween = gsap.to(counter, {
      value: 90,
      duration: 1.2,
      ease: 'power1.out',
      onUpdate: render,
    });

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
