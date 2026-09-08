import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollHighlightText, { scrollTrackProps, scrollStickyProps } from './ScrollHighlightText';
import './ServiceJourney.css';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE =
  "Success shouldn't come at the cost of your time as life becomes more successful, " +
  'it also becomes more complex.';

/** The Figma frame these coordinates were authored against. */
const FRAME_W = 1440;
const FRAME_H = 976;

/** Stacked card (Figma node 357:1390) and scattered tile (node 752:756) sizes. */
/** Deck card, per Figma node 752:670 ("Desktop - 37"). */
const CARD_W = 412.368;
const CARD_H = 499.243;
const TILE = 174.042;
const TILE_RADIUS = 30.941;

/** Gap between the headline and the deck, and between the deck and its caption. */
const DECK_GAP = 56;
const CAPTION_GAP = 31;

/** At or below this width the deck is sized and placed for a phone. */
const COMPACT_WIDTH = 760;


interface Tile {
  image: string;
  /** Caption shown while this tile is part of the stack; only the first three. */
  caption?: string;
  /** Centre of the tile's resting place at the page edge, in frame px. */
  x: number;
  y: number;
  /** Its rotation once it gets there. */
  rotate: number;
}

/**
 * The eight edge positions from Figma node 752:756 (Desktop - 40), as tile
 * centres. Several sit partly outside the frame — that is the design: the tiles
 * bleed off every side rather than tucking neatly inside it.
 */
const TILES: Tile[] = [
  { image: '/collage-3.png', caption: 'Meetings', x: 137.7, y: 813.7, rotate: 153.61 },
  { image: '/collage-5.png', caption: 'Reservations', x: -36.83, y: 543.39, rotate: 179.32 },
  { image: '/collage-1.png', caption: 'Travel', x: -53.22, y: 183.36, rotate: -26.39 },
  { image: '/collage-1.png', x: 759.63, y: 936.63, rotate: -26.39 },
  { image: '/collage-4.png', x: 285.6, y: 27.45, rotate: -129.25 },
  { image: '/collage-2.png', x: 1077.17, y: 50.11, rotate: -52.1 },
  { image: '/collage-1.png', x: 1372.31, y: 201.1, rotate: -26.39 },
  { image: '/collage-5.png', x: 1253.46, y: 778.5, rotate: -26 },
];

const STACK_COUNT = 3;

/** The closing screen's 4x3 grid, in reading order (Figma node 752:836). */
const FINALE_IMAGES = Array.from(
  { length: 12 },
  (_, i) => `/finale/${String(i + 1).padStart(2, '0')}.png`
);

/**
 * A tile is square, so turning it by a multiple of 90° leaves the same outline
 * but stands the photo on its head. Figma's rotations run past 179°, so they're
 * folded into ±45°: the silhouette matches the design exactly, and every
 * picture still reads the right way up.
 */
const uprightTilt = (rotate: number) => ((((rotate + 45) % 90) + 90) % 90) - 45;

/** Polar target per tile, in container fractions about the centre. */
const TARGETS = TILES.map((t) => {
  const dx = t.x / FRAME_W - 0.5;
  const dy = t.y / FRAME_H - 0.5;
  return { angle: Math.atan2(dy, dx), radius: Math.hypot(dx, dy), rotate: uprightTilt(t.rotate) };
});

/**
 * Sweep folded into the merge, in radians. Screen y runs downward, so a
 * decreasing angle reads as anticlockwise: the tiles spiral the same way round
 * as they gather into the mark.
 */
const SWEEP_IN = Math.PI * 0.7;
/** Modest turn on the way in — a lean, not a spin. */
const MERGE_TURN = -30;

/**
 * How much smaller each card in the deck is than the one in front of it. Small
 * enough to read as depth rather than as a size difference, and enough that the
 * card behind is fully covered.
 */
const DECK_DEPTH_STEP = 0.03;

/**
 * The resting places in the order they light up: the bottom-right corner first,
 * then round the ring anticlockwise. Sorting by descending angle is what makes
 * it anticlockwise — screen y runs downward — and the list is then rotated so it
 * begins at whichever place sits nearest the bottom-right diagonal.
 */
const REVEAL_ORDER = (() => {
  const byAngle = TARGETS.map((_, i) => i).sort((a, b) => TARGETS[b].angle - TARGETS[a].angle);
  const bottomRight = (index: number) => Math.abs(TARGETS[index].angle - Math.PI * 0.25);
  const start = byAngle.reduce((best, i) => (bottomRight(i) < bottomRight(best) ? i : best), byAngle[0]);
  const from = byAngle.indexOf(start);
  return [...byAngle.slice(from), ...byAngle.slice(0, from)];
})();

/** TARGET_FOR[i] is the resting place tile i takes; REVEAL_RANK[i] is its turn. */
const TARGET_FOR: number[] = [];
const REVEAL_RANK: number[] = [];
[
  // The five that were never in the deck take the opening places, so the run
  // round the ring starts with tiles that have nothing to wait for.
  ...Array.from({ length: TILES.length - STACK_COUNT }, (_, k) => STACK_COUNT + k),
  // Then the three that were, in the order they fell — each one's turn comes
  // round well after it has landed, so the sequence never has to stall.
  ...Array.from({ length: STACK_COUNT }, (_, k) => STACK_COUNT - 1 - k),
].forEach((tileIndex, rank) => {
  TARGET_FOR[tileIndex] = REVEAL_ORDER[rank];
  REVEAL_RANK[tileIndex] = rank;
});

/** Share of the fan phase the deck takes to drop away out of shot. */
const DECK_DROP_SPAN = 0.34;
/**
 * Where the deck falls to, in container fractions — down and to the left, far
 * enough past the corner that the whole card clears both edges. It leaves by
 * moving, not by fading.
 */
const DROP_TO_X = -0.3;
const DROP_TO_Y = 1.35;
/**
 * The lean the card picks up on its way down. It stands square in the deck and
 * takes on all of this while falling — the tilt is part of the fall rather than
 * a pose struck before it.
 */
const DROP_TILT = -48;
/**
 * Share of the drop given over to spacing the cards out, so the pile leaves one
 * card at a time — topmost first. Each card's own fall takes the remaining
 * 1 - DROP_SPREAD, and at this setting the two are equal: a card is released
 * once the one before it is halfway down, so they overlap on the way out
 * instead of queuing for a clear screen.
 */
const DROP_SPREAD = 0.4;
/**
 * Where in the drop a given stack card starts and finishes its own fall. The
 * last card's lead is exactly DROP_SPREAD, which is what the arrival is keyed to.
 */
const dropLead = (i: number) => ((STACK_COUNT - 1 - i) / (STACK_COUNT - 1)) * DROP_SPREAD;
const dropEnd = (i: number) => dropLead(i) + (1 - DROP_SPREAD);

/**
 * When the tiles begin fading up on their resting places: the moment the last
 * card of the deck starts falling, so the screen is repopulating while it is
 * still on its way out rather than sitting empty until it has gone. A card that
 * is itself still falling waits for its own landing instead — by which point it
 * is off-shot, so it is never seen in two places at once.
 */
const APPEAR_AT = DECK_DROP_SPAN * DROP_SPREAD;
/**
 * How long that entrance takes, as a share of the fan phase. Nothing travels:
 * each tile fades up and grows a little on the spot, and all eight share this
 * one window, so they arrive together rather than in sequence.
 */
const APPEAR_SPAN = 0.24;
/** Lead between one tile starting its entrance and the next round the ring. */
const APPEAR_STAGGER = 0.07;
/** Size they start that entrance at. */
const APPEAR_FROM = 0.82;
/**
 * The entrance is a short anticlockwise swing rather than a straight fade-in:
 * each tile starts a little further round the ring and a little further out,
 * then sweeps down into its resting place. Screen y runs downward, so the angle
 * decreasing is anticlockwise — the same way round as the later merge, so the
 * whole sequence turns consistently.
 */
const APPEAR_SWEEP = Math.PI * 0.1;
/** How much further out from the centre it begins, as a share of its radius. */
const APPEAR_ARC = 0.1;
/** The lean it carries in with, unwound by the time it settles. */
const APPEAR_TURN = 14;
/**
 * How quickly it becomes solid, as a multiple of its entrance. It has to be
 * opaque early or the swing happens underneath the fade and never reads: at
 * full opacity by a fifth of the way in, roughly two thirds of the travel is
 * still to come.
 */
const APPEAR_FADE = 5;
/**
 * A slow anticlockwise creep every placed tile carries through the rest of the
 * fan phase. Without it a tile that arrived early — the first one lands with
 * most of the phase still to run — simply stopped and sat there until the merge
 * began, which read as the ring seizing up. Each tile therefore arrives a little
 * ahead of its resting place and keeps turning, passing through the design's
 * arrangement exactly as the merge takes over, so the motion never breaks.
 */
const IDLE_SWEEP = Math.PI * 0.06;
/** The matching creep in the tile's own rotation. */
const IDLE_TURN = 10;

/** Decelerating, so each tile eases into its place instead of stopping dead. */
const easeOut = (t: number) => 1 - (1 - t) ** 2;

/** Scroll budget per phase, in viewport heights. */
const VH_TEXT = 150;
const VH_ARRIVAL = 150;
const VH_CENTRE = 150;
const VH_FAN = 320;
const VH_MERGE = 230;
const VH_FINALE = 170;

const VH_CARDS =
  VH_ARRIVAL * (STACK_COUNT - 1) + VH_CENTRE + VH_FAN + VH_MERGE + VH_FINALE;
const VH_SCROLL = VH_TEXT + VH_CARDS;
const TEXT_SPAN = VH_TEXT / VH_SCROLL;
const TEXT_START_OFFSET = 6;

/** Phase boundaries within the card animation (i.e. after the reveal). */
const STACK_END = (VH_ARRIVAL * (STACK_COUNT - 1)) / VH_CARDS;
/** Deck complete: the headline clears, the deck slides to the middle and tilts. */
const CENTRE_END = STACK_END + VH_CENTRE / VH_CARDS;
const FAN_END = CENTRE_END + VH_FAN / VH_CARDS;
/** Everything has gathered into the mark; the closing screen fades up after. */
const MERGE_END = FAN_END + VH_MERGE / VH_CARDS;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Progress of `value` across [from, to], clamped. */
const span = (value: number, from: number, to: number) => clamp01((value - from) / (to - from));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function ServiceJourney() {
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const sticky = stickyRef.current;
      if (!track || !sticky) return;

      const tiles = gsap.utils.toArray<HTMLElement>('.journey-tile');
      const captions = gsap.utils.toArray<HTMLElement>('.journey-caption');
      const logo = sticky.querySelector<HTMLElement>('.journey-logo');
      const heading = sticky.querySelector<HTMLElement>('.journey-heading');
      const finale = sticky.querySelector<HTMLElement>('.journey-finale');
      if (tiles.length === 0 || !logo) return;

      gsap.set([...tiles, ...captions, logo], { xPercent: -50, yPercent: -50 });

      const draw = (progress: number) => {
        const width = sticky.offsetWidth;
        const height = sticky.offsetHeight;
        if (!width || !height) return;

        // Sizes track the design frame proportionally; positions are fractions
        // of the real container, so tiles reach the actual edges at any aspect.
        const scale = Math.min(width / FRAME_W, height / FRAME_H);
        const tileSize = TILE * scale;

        // The deck hangs off the real bottom of the headline rather than the
        // middle of the screen, so it can never ride up over the copy — the
        // heading's height varies with viewport and font loading.
        const headingBottom = heading
          ? heading.getBoundingClientRect().bottom - sticky.getBoundingClientRect().top
          : 0;
        const deckTop = headingBottom + DECK_GAP * scale;
        // Whatever vertical room is left has to hold the card and its caption.
        // Floored as well as capped: on a cramped viewport the headline wraps
        // tall enough to leave no room at all, and a card shrunk to nothing is
        // worse than one that crowds the copy slightly.
        const room = height - deckTop - (CAPTION_GAP + 34) * scale;

        // On a phone `scale` is driven by width against the 1440 design frame,
        // which lands around 0.26 and shrinks the card to a stamp with the
        // screen half empty beneath it. There the card is sized from the space
        // it actually has instead, capped so it still leaves a margin either
        // side. Desktop keeps the design's own size.
        const compact = width <= COMPACT_WIDTH;
        const cardH = compact
          ? Math.min(
              Math.max(CARD_H * scale, room * 0.7),
              room,
              (width * 0.78) / (CARD_W / CARD_H)
            )
          : Math.min(CARD_H * scale, Math.max(room, CARD_H * scale * 0.45));
        const cardW = cardH * (CARD_W / CARD_H);

        const stackP = span(progress, 0, STACK_END);
        const centreP = span(progress, STACK_END, CENTRE_END);
        const fanP = span(progress, CENTRE_END, FAN_END);
        const mergeP = span(progress, FAN_END, MERGE_END);
        const finaleP = span(progress, MERGE_END, 1);

        // The centre phase runs as two beats: the headline clears, then the
        // finished deck slides up into the middle of the now-empty screen. It
        // stands square the whole way — nothing rotates until the fall.
        const textOut = span(centreP, 0, 0.3);
        const toCentre = span(centreP, 0.3, 1);

        const deckX = width / 2;
        // Sat directly under the headline on desktop, where that matches the
        // design. On a phone it is centred in the space left below the headline
        // instead, so the copy and the deck read as one balanced screen rather
        // than both crowding the top.
        const deckRest = compact ? deckTop + room / 2 : deckTop + cardH / 2;
        const deckY = lerp(deckRest, height / 2, toCentre);
        /** The deck falling away to the bottom-left, before the tiles take over. */
        const drop = span(fanP, 0, DECK_DROP_SPAN);

        tiles.forEach((tile, i) => {
          const target = TARGETS[TARGET_FOR[i]];
          const isStackCard = i < STACK_COUNT;

          const inward = span(mergeP, 0, 1);

          // The deck drops away to the bottom-left, and then every tile — the
          // three that were stacked included — fades up on its own resting
          // place, all on the same beat.
          // Its turn round the ring, never earlier than its own landing — a
          // guard rather than a timing device, since the deck cards are given
          // the closing places precisely so it never has to bite.
          const turnAt = APPEAR_AT + REVEAL_RANK[i] * APPEAR_STAGGER;
          const appearAt = isStackCard
            ? Math.max(turnAt, DECK_DROP_SPAN * dropEnd(i))
            : turnAt;
          const appear = span(fanP, appearAt, appearAt + APPEAR_SPAN);
          const placed = appear > 0;

          // --- size: portrait card while it is still the deck, square tile once
          // it takes its place on the edge.
          const morph = placed ? 1 : 0;
          const w = lerp(cardW, tileSize, morph);
          const h = lerp(cardH, tileSize, morph);

          // --- position
          let x = deckX;
          let y = deckY;
          let rotate = 0;

          if (placed) {
            // How far it still has to swing: 1 as it appears, 0 once settled.
            const settle = 1 - easeOut(appear);

            // Runs out exactly at the end of the fan phase, which is where the
            // merge picks the movement up — so one hands over to the other with
            // nothing standing still in between.
            const idle = 1 - fanP;

            const radius = target.radius * (1 - inward) * (1 + APPEAR_ARC * settle);
            const angle =
              target.angle + IDLE_SWEEP * idle + APPEAR_SWEEP * settle - SWEEP_IN * inward;

            x = (0.5 + radius * Math.cos(angle)) * width;
            y = (0.5 + radius * Math.sin(angle)) * height;
            rotate =
              target.rotate + IDLE_TURN * idle + APPEAR_TURN * settle + MERGE_TURN * inward;
          } else if (drop > 0 && isStackCard) {
            // The pile empties a card at a time, topmost first: each one waits
            // its turn, then falls down and to the left, leaning a little
            // further as it goes — sliding out of shot rather than spinning
            // away. A card yet to go stays put on the deck.
            const fall = span(drop, dropLead(i), dropEnd(i));

            x = lerp(deckX, DROP_TO_X * width, fall);
            y = lerp(deckY, DROP_TO_Y * height, fall);
            rotate = DROP_TILT * fall;
          } else if (isStackCard && i > 0) {
            // Waiting below the fold, then rising into the deck in turn.
            const arrival = span(stackP, (i - 1) / (STACK_COUNT - 1), i / (STACK_COUNT - 1));
            y = deckY + height * (1 - arrival);
          }

          // --- scale: the deck's depth ladder while stacking, then the small
          // grow that every tile shares as it fades up.
          let depthScale = 1;
          if (placed) {
            depthScale = lerp(APPEAR_FROM, 1, appear);
          } else if (isStackCard) {
            const landed = Math.floor(stackP * (STACK_COUNT - 1) + 1e-6);
            const behind = Math.max(0, landed - i);
            // Each card sits a shade *smaller* than the one in front of it, so
            // the deck reads as receding and — the point of it — every card
            // under the top one is hidden completely. Scaling the other way
            // left a rim of the photo behind showing all the way round.
            depthScale = 1 - DECK_DEPTH_STEP * behind;
          }

          // --- opacity. The deck stays solid as it falls — it exits by leaving
          // the screen, not by fading — and every tile then fades up on its
          // resting place. A card is off-shot by the time it is repositioned, so
          // the jump is never seen. Everything fades out into the mark at the end.
          const base = placed ? clamp01(appear * APPEAR_FADE) : isStackCard ? 1 : 0;
          const opacity = base * (1 - clamp01((inward - 0.75) * 4));

          gsap.set(tile, {
            width: w,
            height: h,
            x,
            y,
            rotation: rotate,
            scale: depthScale,
            opacity,
            borderRadius: lerp(0, TILE_RADIUS * scale, morph),
            // In the deck, the most recently landed card is the front one.
            zIndex: isStackCard ? 10 + i : 5,
          });
        });

        // Captions belong to the deck, and only the front card's shows. The deck
        // no longer leans, so a caption simply rides directly below its card and
        // follows it to the middle of the screen.
        const landed = Math.round(stackP * (STACK_COUNT - 1));
        const captionDrop = cardH / 2 + CAPTION_GAP * scale;
        captions.forEach((caption, i) => {
          gsap.set(caption, {
            x: deckX,
            y: deckY + captionDrop,
            opacity: fanP > 0 ? 0 : i === landed ? 1 : 0,
          });
        });

        // The headline goes first, before the deck moves up into its place.
        if (heading) gsap.set(heading, { opacity: 1 - textOut });

        // The mark the whole sequence resolves into. It gives way to the closing
        // screen, so it fades back out as that comes up.
        gsap.set(logo, {
          width: tileSize,
          height: tileSize,
          x: width / 2,
          y: height / 2,
          borderRadius: TILE_RADIUS * scale,
          opacity: clamp01((mergeP - 0.72) * 4) * (1 - clamp01(finaleP * 3.5)),
        });

        // The closing screen fades up over everything once the sequence has
        // played out — quickly, over the opening third of its phase, so the
        // screen is fully there with scroll to spare rather than still arriving.
        if (finale) gsap.set(finale, { opacity: clamp01(finaleP * 3.5) });
      };

      draw(0);

      const docTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
      const scrollable = () => track.offsetHeight - sticky.offsetHeight;
      // Mirrors ScrollHighlightText's own maths so the cards begin exactly where
      // the last character of the headline lands.
      const revealEnd = () => {
        const from = (window.innerHeight * TEXT_START_OFFSET) / 100;
        return docTop(track) + from + (scrollable() - from) * TEXT_SPAN;
      };

      const trigger = ScrollTrigger.create({
        trigger: track,
        start: revealEnd,
        end: () => docTop(track) + scrollable(),
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => draw(self.progress),
        onRefresh: (self) => draw(self.progress),
      });

      const onResize = () => draw(trigger.progress);
      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
        trigger.kill();
      };
    },
    { scope: trackRef }
  );

  return (
    <section
      className="journey"
      ref={trackRef}
      style={{ '--track-height': `${100 + VH_SCROLL}vh` } as React.CSSProperties}
      {...scrollTrackProps}
    >
      <div className="journey-sticky" ref={stickyRef} {...scrollStickyProps}>
        <div className="journey-grid">
          <ScrollHighlightText
            className="journey-heading"
            text={HEADLINE}
            startOffset={TEXT_START_OFFSET}
            trackSpan={TEXT_SPAN}
          />
        </div>

        <div className="journey-stage">
          {TILES.map((tile, i) => (
            <div key={tile.image + i} className="journey-tile">
              <img src={tile.image} alt="" className="journey-tile-image" />
            </div>
          ))}

          {TILES.slice(0, STACK_COUNT).map((tile) => (
            <span key={`caption-${tile.caption}`} className="journey-caption">
              {tile.caption}
            </span>
          ))}

          <div className="journey-logo">
            <span
              className="journey-logo-mark"
              style={{
                WebkitMaskImage: 'url(/loader-logo-fill.svg)',
                maskImage: 'url(/loader-logo-fill.svg)',
              }}
            />
          </div>
        </div>

        {/* The closing screen, per Figma node 752:836 ("Desktop - 42"). It sits
            above everything and is simply faded up once the sequence has run. */}
        <div className="journey-finale">
          {/* Two identical blocks stacked: the track slides up by exactly one
              block plus one gap, so the second arrives where the first began
              and the drift never shows a seam. */}
          <div className="journey-finale-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="journey-finale-block" aria-hidden={copy === 1}>
                {FINALE_IMAGES.map((src) => (
                  <div key={src} className="journey-finale-cell">
                    <img src={src} alt="" className="journey-finale-photo" />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="journey-finale-wash" />

          <div className="journey-finale-lockup">
            <img src="/finale/lockup.svg" alt="Aurelion" className="journey-finale-mark" />
            {/* The reference cuts this sentence off mid-clause — the tail of the
                copy still needs to come from the design. */}
            <p className="journey-finale-copy">
              We analyze your personal and professional needs to detect blockages, enhance your
              life goals,
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
