import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

function waitForAssets(): Promise<void> {
  const imagePromises = Array.from(document.images).map((img) =>
    img.complete
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        })
  );

  const fontsPromise: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();

  const windowLoadPromise =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));

  return Promise.all([...imagePromises, fontsPromise, windowLoadPromise]).then(() => undefined);
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

      tl.to(backdrop, { backgroundColor: '#ffffff', duration: 1, ease: 'power1.in' }, 0)
        // expo.in: the hole barely grows at first, then explodes outward — matches the reference reveal.
        .to(holeSize, { value: targetSize, duration: 1.2, ease: 'expo.in', onUpdate: setMaskSize }, 0.05)
        .to(rootRef.current, { opacity: 0, duration: 0.3 }, '-=0.2');
    };

    const softTween = gsap.to(counter, {
      value: 90,
      duration: 2.5,
      ease: 'power1.out',
      onUpdate: render,
    });

    waitForAssets().then(() => {
      softTween.kill();
      gsap.to(counter, {
        value: 100,
        duration: 5,
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
