import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Antimatter, Autorepear, Badge, Boss, Contract, Dash, Female, Gameshare, Gaspod, Gravitygun, Hammer, Hook, Jetpack, Jump, Laser, Lobber, Male, Manipulator, Railgun, Spike, Striker, Toxicgun, A, FightersPack, BossPack, IconLoose} from "@img/index";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/table";
import { Plus, Edit, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
"use client";

const ICONS = [Antimatter, Autorepear, Badge, Boss, Contract, Dash, Female, Gameshare, Gaspod, Gravitygun, Hammer, Hook, Jetpack, Jump, Laser, Lobber, Male, Manipulator, Railgun, Spike, Striker, Toxicgun];
const ICON_NAMES = ["Antimatter", "Autorepear", "Badge", "Boss", "Contract", "Dash", "Female", "Gameshare", "Gaspod", "Gravitygun", "Hammer", "Hook", "Jetpack", "Jump", "Laser", "Lobber", "Male", "Manipulator", "Railgun", "Spike", "Striker", "Toxicgun"];

// --- Catégorisation des icônes ---
const CAT_UTILITY = new Set(["Badge", "Contract", "Gameshare"]);
const CAT_FIGHTER = new Set(["Antimatter", "Dash", "Female", "Hook", "Jetpack", "Jump", "Lobber", "Male", "Manipulator", "Railgun", "Striker"]);
const CAT_BOSS    = new Set(["Autorepear", "Boss", "Gaspod", "Gravitygun", "Hammer", "Laser", "Spike", "Toxicgun"]);

const TIERS = [
  { value: "tier1", label: "Tier 1 ★", color: "text-white" },
  { value: "tier2", label: "Tier 2 ★★", color: "text-green-300" },
  { value: "tier3", label: "Tier 3 ★★★", color: "text-yellow-500" },
];

const idNum = (id) => {
  const m = String(id).match(/(\d+)(?!.*\d)/); // dernier nombre de la chaîne
  return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
};

function categoryForIconIndex(iconIndex) {
  const name = ICON_NAMES[iconIndex] ?? "";
  if (CAT_UTILITY.has(name)) return "utility";
  if (CAT_FIGHTER.has(name)) return "fighter";
  if (CAT_BOSS.has(name)) return "boss";
  return "unknown";
}

// helpers aléatoires
function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function takeRandom(array) {
  if (!array.length) return null;
  const i = Math.floor(Math.random() * array.length);
  const [picked] = array.splice(i, 1);
  return picked ?? null;
}

// Composant Card pour afficher une carte
function Card({ pack, cardSize, onOpen, tiers, icons }) {
  const allRevealed = pack.slots.every((s) => s.revealed);
  const firstWinSlot = pack.slots.find((s) => s.revealed && s.giveaway);
  const isWin = Boolean(firstWinSlot);
  const giveaway = firstWinSlot?.giveaway;

  const coverImg = pack.type === "boss" ? BossPack : FightersPack;

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300"
      style={{ perspective: "1000px", height: `${cardSize}px`, aspectRatio: "3/4" }}
      onClick={onOpen}
    >
      {!allRevealed ? (
        <div
          className="absolute inset-0 shadow-2xl flex flex-col justify-center items-center"
          style={{
            backfaceVisibility: "hidden",
            backgroundImage: `url(${coverImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      ) : (
        <div
          className={`absolute inset-0 rounded-xl shadow-2xl flex flex-col items-center justify-center border-2 ${
            isWin
              ? "bg-gradient-to-br from-green-600 to-green-800 border-green-500"
              : "bg-gradient-to-br from-red-600 to-red-800 border-red-500"
          }`}
        >
          <div className="text-center text-white p-4">
            {isWin ? (
              <>
                <div
                  className="font-bold mb-2 text-green-300"
                  style={{ fontSize: `${Math.min(cardSize * 0.12, 24)}px` }}
                >
                  WIN
                </div>
                {typeof giveaway?.iconIndex === "number" && (
                  <img
                    src={icons[giveaway.iconIndex]}
                    alt="Giveaway icon"
                    className="object-contain mx-auto mb-2"
                    style={{
                      width: `${Math.min(cardSize * 0.3, 96)}px`,
                      height: `${Math.min(cardSize * 0.3, 96)}px`,
                    }}
                  />
                )}
                <div
                  className={`font-bold ${tiers.find((t) => t.value === giveaway?.tier)?.color ?? ""}`}
                  style={{ fontSize: `${Math.min(cardSize * 0.08, 18)}px` }}
                >
                  {tiers.find((t) => t.value === giveaway?.tier)?.label ?? ""}
                </div>
              </>
            ) : (
              <div
                className="font-bold text-red-200"
                style={{ fontSize: `${Math.min(cardSize * 0.12, 24)}px` }}
              >
                LOOSE
              </div>
            )}
          </div>
        </div>
      )}

      {/* Badge pack */}
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 text-primary font-bold leading-none backdrop-blur-sm rounded-full px-3 py-1"
        style={{ fontSize: `${Math.min(cardSize * 0.30, 22)}px` }}
      >
        #{pack.number}
      </div>
    </div>
  );
}

function StarBurstPersistent({
  trigger,              // number: Date.now() pour déclencher
  color = "#FFFFFF",
  count = 480,
  radiusMin = 400,
  radiusMax = 420,
  runForMs = 20000,
  waveEvery = 3000,
  particleDuration = 1400,
}) {
  const [active, setActive] = React.useState(false);
  const [waves, setWaves] = React.useState([]); // [{id, bornAt}]
  const waveId = React.useRef(0);
  const intervalRef = React.useRef(null);
  const timeoutRef  = React.useRef(null);

  // positions “gabarit” — ne dépend QUE de count/radius*
  const parts = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.7;
      const r = radiusMin + Math.random() * (radiusMax - radiusMin);
      arr.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        delay: Math.random() * 0.18, // (petite valeur réaliste)
        scale: 0.15 + Math.random() * 1.1,
        rot: 10 + Math.random() * 120,
        k: i,
      });
    }
    return arr;
  }, [count, radiusMin, radiusMax]);

  // (re)démarre une session quand trigger change
  React.useEffect(() => {
    if (!trigger) return;
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    setWaves([]);
    setActive(true);

    setWaves((prev) => [...prev, { id: waveId.current++, bornAt: performance.now() }]);
    intervalRef.current = setInterval(() => {
      setWaves((prev) => [...prev, { id: waveId.current++, bornAt: performance.now() }]);
    }, waveEvery);

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setActive(false);
    }, runForMs);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [trigger, waveEvery, runForMs]);

  // nettoie les vagues trop anciennes
  React.useEffect(() => {
    if (!waves.length) return;
    const raf = requestAnimationFrame(() => {
      const now = performance.now();
      setWaves((prev) =>
        prev.filter((w) => now - w.bornAt < particleDuration + 300)
      );
    });
    return () => cancelAnimationFrame(raf);
  }, [waves, particleDuration]);

  const visible = active || waves.length > 0;
  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[60] overflow-visible">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {waves.map((w) => (
          <React.Fragment key={w.id}>
            {parts.map((p) => (
              <motion.div
                key={`${w.id}-${p.k}`}
                className="relative"
                initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
                animate={{
                  x: p.x, y: p.y,
                  scale: [0, p.scale, p.scale * 1.15, 0],
                  opacity: [0, 1, 1, 0],
                  rotate: p.rot,
                }}
                transition={{
                  delay: p.delay,
                  duration: particleDuration / 1000,
                  ease: [0.17, 0.67, 0.3, 0.96],
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill={String(color)}
                     className="drop-shadow-[0_0_10px_rgba(255,255,255,0.75)]">
                  <path d="M12 2l2.9 6 6.6.6-5 4.3 1.6 6.3L12 16l-6.1 3.2 1.6-6.3-5-4.3 6.6-.6z"/>
                </svg>
              </motion.div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// Hook press-and-hold (souris + tactile) avec progress 0→1
function useHoldToRip({ duration = 2000, onComplete }) {
  const [progress, setProgress] = React.useState(0);
  const [holding, setHolding] = React.useState(false);
  const [done, setDone] = React.useState(false);       // ✅ lock après succès
  const rafRef = React.useRef(null);
  const startRef = React.useRef(null);

  const stop = React.useCallback((completed = false) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startRef.current = null;
    setHolding(false);
    if (completed) {
      setDone(true);               // ✅ lock
    } else if (!done) {
      setProgress(0);              // reset uniquement si pas encore done
    }
  }, [done]);

  const step = React.useCallback((t) => {
    if (!startRef.current) startRef.current = t;
    const elapsed = t - startRef.current;
    const p = Math.min(1, elapsed / duration);
    setProgress(p);
    if (p >= 1) {
      stop(true);                  // ✅ ne pourra plus être “dé-reset”
      onComplete?.();
    } else {
      rafRef.current = requestAnimationFrame(step);
    }
  }, [duration, onComplete, stop]);

  const start = React.useCallback(() => {
    if (holding || done) return;   // ✅ pas de relance si déjà done
    setHolding(true);
    setProgress(0);
    rafRef.current = requestAnimationFrame(step);
  }, [holding, done, step]);

  // Handlers pointer/touch
  const bind = {
    onMouseDown: start,
    onMouseUp:   () => !done && stop(false),
    onMouseLeave:() => !done && stop(false),
    onTouchStart:start,
    onTouchEnd:  () => !done && stop(false),
    onTouchCancel:() => !done && stop(false),
  };

  // (optionnel) pour réutilisation ultérieure
  const reset = React.useCallback(() => {
    setDone(false);
    setProgress(0);
  }, []);

  return { progress, holding, done, bind, reset };
}


// Composant pour "déchirer" le haut du pack via clip-path dentelé
function TopTearBand({ progress, bgImage }) {

  return (
    <motion.div
      className="absolute z-[20] -top-7 s:-top-9 md:-top-10 left-0 right-0 h-[6.2%] pointer-events-none"
      style={{              // hauteur du bandeau déchiré (ajuste)
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundSize: "cover",
        WebkitMaskRepeat: "no-repeat",
        borderBottom: "2px dashed",
        borderColor: "hsl(var(--primary))",
      }}
      // on rogne depuis la GAUCHE vers la DROITE
      animate={{ clipPath: `inset(0 0 0 ${progress * 100}%)` }}
      transition={{ type: "tween", ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

// Hook pour tirer des confettis en toute sécurité (client only)
function useTier3Confetti() {
  const confettiRef = React.useRef(null);

  React.useEffect(() => {
    let mounted = true;
    if (typeof window !== "undefined") {
      import("canvas-confetti").then((m) => {
        if (mounted) confettiRef.current = m.default;
      });
    }
    return () => { mounted = false; };
  }, []);

  return React.useCallback(() => {
    const c = confettiRef.current;
    if (!c) return; // pas encore chargé

    const base = {
      zIndex: 2147483647,       // au-dessus de tout
      ticks: 450,
      spread: 120,
      startVelocity: 70,
      scalar: 0.9,
      disableForReducedMotion: false,
    };

    // deux cônes latéraux
    c({ ...base, particleCount: 90, origin: { x: 0.15, y: 0.1 } });
    c({ ...base, particleCount: 90, origin: { x: 0.85, y: 0.1 } });

    // burst central
    setTimeout(() => {
      c({ ...base, particleCount: 240, spread: 110, origin: { x: 0.5, y: 0.45 } });
    }, 10);
  }, []);
}

function PackOpenModal({ pack, onClose, onRevealSlot, tiers, icons }) {
  const [opened, setOpened] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const [starsTrigger, setStarsTrigger] = React.useState(0);

  const [phase, setPhase] = React.useState("idle"); // idle / shaking / flash
  const SHAKE_MS = 3000; // << 3 secondes de tremblement
  const FLASH_MS = 1000;   // durée de l’explosion de lumière

  // NEW: zone de survol (tl, t, tr, l, c, r, bl, b, br, null)
  const [hoverZone, setHoverZone] = React.useState(null);

  const fireTier3Confetti = useTier3Confetti();

  // Transformations par zone (on n’applique que quand !opened)
  const tiltByZone = {
    tl: { rotateX: -10, rotateY:  10, scale: 1.02 },
    t:  { rotateX: -10, rotateY:   0, scale: 1.02 },
    tr: { rotateX: -10, rotateY: -10, scale: 1.02 },
    l:  { rotateX:   0, rotateY:  10, scale: 1.02 },
    c:  { rotateX:   0, rotateY:   0, scale: 1.05 },
    r:  { rotateX:   0, rotateY: -10, scale: 1.02 },
    bl: { rotateX:  10, rotateY:  10, scale: 1.02 },
    b:  { rotateX:  10, rotateY:   0, scale: 1.02 },
    br: { rotateX:  10, rotateY: -10, scale: 1.02 },
  };

  // Ombres internes (“light-shadow”) par zone
  const shadowByZone = {
    tl: 'inset 40px 40px 120px 10px rgba(255, 255, 255, 0.15), inset -40px -40px 120px 10px rgba(255, 0, 200, 0.1)',
    t:  'inset 0 50px 150px rgba(0, 255, 200, 0.3), inset 0 -40px 100px rgba(255, 0, 150, 0.2)',
    tr: 'inset -40px 40px 120px 10px rgba(0, 200, 255, 0.2), inset 40px -40px 120px 10px rgba(255, 255, 255, 0.05)',
    l:  'inset 60px 0 120px rgba(255, 255, 255, 0.15), inset -30px 0 100px rgba(0, 255, 200, 0.15)',
    c:  'inset 0 0 180px rgba(255, 255, 255, 0.2), inset 0 0 200px rgba(255, 0, 255, 0.2)',
    r:  'inset -60px 0 120px rgba(255, 255, 255, 0.15), inset 30px 0 100px rgba(0, 150, 255, 0.15)',
    bl: 'inset -50px -50px 120px 10px rgba(255, 255, 255, 0.2), inset 40px 40px 100px rgba(255, 0, 255, 0.15)',
    b:  'inset 0 -50px 140px 5px rgba(0, 200, 255, 0.3), inset 0 40px 120px rgba(255, 255, 255, 0.05)',
    br: 'inset 50px -50px 120px 10px rgba(255, 255, 255, 0.2), inset -40px 40px 100px rgba(0, 255, 200, 0.15)',
  };

  const tiltTarget = !opened && hoverZone ? tiltByZone[hoverZone] : { rotateX: 0, rotateY: 0, scale: 1 };
  const shadowTarget = !opened && hoverZone ? shadowByZone[hoverZone] : 'none';  // pour l’anim d’étoiles
  
  // Passer les handlers “hold-to-rip” aux zones pour ne pas casser le press&hold
  const passHoldHandlers = (props = {}) => ({
    onMouseEnter: props.onMouseEnter,
    onMouseLeave: props.onMouseLeave,
    onMouseDown:  (e) => bind.onMouseDown?.(e),
    onMouseUp:    (e) => bind.onMouseUp?.(e),
    onMouseLeaveCapture: (e) => !done && bind.onMouseLeave?.(e),
    onTouchStart: (e) => bind.onTouchStart?.(e),
    onTouchEnd:   (e) => bind.onTouchEnd?.(e),
    onTouchCancel:(e) => bind.onTouchCancel?.(e),
  });

  if (!pack) return null;

  const slots = pack.slots;
  const current = slots[idx];
  const isMulti = slots.length > 1;
  const showRevealCTA = isMulti && opened && !current?.revealed && phase !== "flash";
  const isWin = Boolean(current?.giveaway);

  const META = {
    tier1: { stars: 24, color: "#9CA3AF" },
    tier2: { stars: 42, color: "#22C55E" },
    tier3: { stars: 72, color: "#FDE047" },
  };
  const tierKey = current?.giveaway?.tier ?? "tier1";
  const tmeta = META[tierKey] ?? META.tier1;

  // 2s hold → lancement du tremblement, puis ouverture
  const { progress, holding, done, bind } = useHoldToRip({
    duration: 2000,
    onComplete: () => {
      // 1) le PACK fermé tremble 3s
      setPhase("packShaking");
  
      setTimeout(() => {
        // 2) on ouvre: le pack disparaît
        setOpened(true);
  
        const isSingle = pack.slots.length === 1 && !pack.slots[0].revealed;
  
        if (isSingle) {
          setPhase("flash");
          setTimeout(() => {
            onRevealSlot(pack.id, pack.slots[0].id);
            if (pack.slots[0].giveaway) setStarsTrigger(Date.now());
        
            if (pack.slots[0].giveaway?.tier === "tier3") {
              fireTier3Confetti();
            }

            setPhase("idle");
          }, FLASH_MS);
        } else {
          setPhase("idle");
        }
      }, SHAKE_MS);
    },
  });

  const goPrev = () => setIdx((i) => Math.max(0, i - 1));
  const goNext = () => setIdx((i) => Math.min(slots.length - 1, i + 1));

  const handleReveal = () => {
    if (current.revealed) return;
    setPhase("cardShaking");
    setTimeout(() => {
      setPhase("flash");
      setTimeout(() => {
        onRevealSlot(pack.id, current.id);
        if (current.giveaway) setStarsTrigger(Date.now());
  
        if (current.giveaway?.tier === "tier3") {
          fireTier3Confetti();
        }
        setPhase("idle");
      }, FLASH_MS);
    }, SHAKE_MS);
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] flex items-center justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

        <motion.div
          className="relative w-[68vw] max-w-[440px] aspect-[3/4] rounded-2xl overflow-visible z-50 select-none"
          initial={{ scale: 0.85, opacity: 0, rotate: -2 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.92, opacity: 0, rotate: 2 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          {...(!opened ? bind : {})}
        >
          {/* COUVERTURE tant que !opened */}
          {!opened && (
            <>
              {/* CONTENEUR PERSPECTIVE + WRAPPER qui tilt */}

              {/* Header aide + close (reste tel quel) */}
              {!done && (
                <div className="absolute -top-16 -mt-10 left-0 right-0 z-[20] flex items-center justify-center pointer-events-none">
                  <div className="flex items-center h-12 justify-center rounded-full text-lg text-primary">
                    Press & hold 2s to open
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="absolute -top-16 -mt-10 right-0 z-[30] rounded-full px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white pointer-events-auto"
              >
                <X size={42} />
              </button>

              <motion.div
                className="absolute inset-0 [perspective:1500px] z-[12]"
                animate={
                  !opened && phase === "packShaking"
                    ? { x: [0,-1,3,-2,2,0], y: [0,-2,1,2,-1,0], rotateZ: [0,-0.6,0.6,-0.4,0.4,0] }
                    : { x: 0, y: 0, rotateZ: 0 }
                }
                transition={
                  !opened && phase === "packShaking"
                    ? {
                        x: { duration: 0.35, repeat: Math.ceil(SHAKE_MS / 350) },
                        y: { duration: 0.35, repeat: Math.ceil(SHAKE_MS / 350) },
                        rotateZ: { duration: 0.35, repeat: Math.ceil(SHAKE_MS / 350) },
                      }
                    : {}
                }
              >
                <motion.div
                  className="absolute inset-0 will-change-transform rounded-2xl overflow-visible top-2"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={tiltTarget}
                  transition={{ type: 'spring', stiffness: 12, damping: 28 }}
                >
                  
                  {/* Fond pack */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${pack.type === "boss" ? BossPack : FightersPack})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "bottom center",
                      backgroundSize: "cover",
                    }}
                  />

                  {/* bandeau haut */}
                  {!done && (
                    <TopTearBand
                      progress={progress}
                      bgImage={pack.type === "boss" ? BossPack : FightersPack}
                    />
                  )}

                  <div
                    className="absolute inset-0 mx-3 pointer-events-none mix-blend-screen opacity-30 "
                    style={{
                      background: `
                        repeating-linear-gradient(
                          125deg,
                          rgba(255,0,200,0.15) 0%,
                          rgba(0,255,255,0.05) 10%,
                          rgba(255,255,0,0.1) 20%,
                          rgba(255,0,200,0.15) 30%
                        )
                      `,
                      backgroundSize: "300% 300%",
                      animation: "holoShift 6s linear infinite",
                    }}
                  />

                  {/* light-shadow (animée) */}
                  <div
                    className="light-shadow pointer-events-none absolute inset-0 transition-all duration-500 mx-2 mb-8 s:mb-11 opacity-40"
                    style={{ boxShadow: shadowTarget }}
                  />

                  {/* badge numéro (en bas-gauche) */}
                  <div className="absolute bottom-12 left-6 s:bottom-16 s:left-8 text-primary/80 z-[999] text-3xl font-bold uppercase">
                    #{pack.number}
                  </div>
                </motion.div>

                {/* 9 ZONES — 3x3 — couvrent la carte */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 z-20">
                  {/* TL */}
                  <div
                    className="w-full h-full"
                    {...passHoldHandlers({
                      onMouseEnter: () => setHoverZone('tl'),
                      onMouseLeave: () => setHoverZone(null),
                    })}
                  />
                  {/* T */}
                  <div
                    className="w-full h-full"
                    {...passHoldHandlers({
                      onMouseEnter: () => setHoverZone('t'),
                      onMouseLeave: () => setHoverZone(null),
                    })}
                  />
                  {/* TR */}
                  <div
                    className="w-full h-full"
                    {...passHoldHandlers({
                      onMouseEnter: () => setHoverZone('tr'),
                      onMouseLeave: () => setHoverZone(null),
                    })}
                  />
                  {/* L */}
                  <div
                    className="w-full h-full"
                    {...passHoldHandlers({
                      onMouseEnter: () => setHoverZone('l'),
                      onMouseLeave: () => setHoverZone(null),
                    })}
                  />
                  {/* C */}
                  <div
                    className="w-full h-full"
                    {...passHoldHandlers({
                      onMouseEnter: () => setHoverZone('c'),
                      onMouseLeave: () => setHoverZone(null),
                    })}
                  />
                  {/* R */}
                  <div
                    className="w-full h-full"
                    {...passHoldHandlers({
                      onMouseEnter: () => setHoverZone('r'),
                      onMouseLeave: () => setHoverZone(null),
                    })}
                  />
                  {/* BL */}
                  <div
                    className="w-full h-full"
                    {...passHoldHandlers({
                      onMouseEnter: () => setHoverZone('bl'),
                      onMouseLeave: () => setHoverZone(null),
                    })}
                  />
                  {/* B */}
                  <div
                    className="w-full h-full"
                    {...passHoldHandlers({
                      onMouseEnter: () => setHoverZone('b'),
                      onMouseLeave: () => setHoverZone(null),
                    })}
                  />
                  {/* BR */}
                  <div
                    className="w-full h-full"
                    {...passHoldHandlers({
                      onMouseEnter: () => setHoverZone('br'),
                      onMouseLeave: () => setHoverZone(null),
                    })}
                  />
                </div>
              </motion.div>

            </>
          )}

          {phase === "flash" && (
            <motion.div
              className="absolute inset-0 z-[80] pointer-events-none"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 1, 0], scale: [0.2, 1.5, 1] }}
              transition={{ duration: FLASH_MS / 1000, times: [0, 0.9, 1], ease: "easeOut" }}
              style={{
                background: "radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.0) 60%)",
                mixBlendMode: "screen",
                filter: "blur(5px)",
                borderRadius: "1rem",
              }}
            />
          )}

          {/* ÉTOILES (uniquement après reveal d’un WIN) */}
          {opened && current?.revealed && current?.giveaway && (
            <StarBurstPersistent
              key={starsTrigger}
              trigger={starsTrigger}
              color={tmeta.color}
              count={tmeta.stars}
              runForMs={20000}
              waveEvery={10000}
              particleDuration={10000}
            />
          )}

          {/* CONTENU quand pack ouvert */}
          {opened && (
            <motion.div
              className="absolute inset-0 z-[70] flex items-center justify-center"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 60, damping: 14 }}
            >
              <motion.div
                className="flex flex-col items-center justify-center w-5/6 h-6/6 s:h-5/6 gap-4 border-4 border-primary/50 rounded-2xl bg-gray-900/30 backdrop-blur-sm p-4"
                animate={
                  phase === "cardShaking"
                    ? { x: [0,-4,4,-3,3,0], y: [0,-2,2,1,-1,0], rotateZ: [0,-0.7,0.7,-0.4,0.4,0] }
                    : { x: 0, y: 0, rotateZ: 0 }
                }
                transition={
                  phase === "cardShaking"
                    ? {
                        x: { duration: 0.35, repeat: Math.ceil(SHAKE_MS / 350) },
                        y: { duration: 0.35, repeat: Math.ceil(SHAKE_MS / 350) },
                        rotateZ: { duration: 0.35, repeat: Math.ceil(SHAKE_MS / 350) },
                      }
                    : {}
                }
              >
                {/* Header: Pack + position carte */}
                <div className="text-primary text-2xl font-bold uppercase">
                  #{pack.number}
                </div>

                {/* Zone résultat/reveal */}
                <div className="flex flex-col items-center gap-3">
                  {current.revealed ? (
                    <>
                      <div className={current.giveaway ? "text-primary text-3xl uppercase font-bold" : "text-red-600 text-3xl uppercase font-bold"}>
                        {current.giveaway ? "You won" : "No reward"}
                      </div>

                      {!current.giveaway && (
                        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 60, damping: 12 }}>
                          <img src={IconLoose} alt="Loose" className="w-32 h-32 mx-auto my-6 drop-shadow-[0_0_12px_rgba(0,0,0,0.35)]" />
                        </motion.div>
                      )}

                      {current.giveaway && (
                        <>
                          <div className="text-xl font-semibold" style={{ color: tmeta.color }}>
                            {tiers.find((t) => t.value === (current.giveaway.tier ?? "tier1"))?.label}
                          </div>
                          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 60, damping: 12 }}>
                            <img
                              src={icons[current.giveaway.iconIndex]}
                              alt="Giveaway"
                              className="w-24 h-24 mx-auto drop-shadow-[0_0_22px_rgba(0,0,0,0.35)]"
                            />
                          </motion.div>
                          <div className="text-2xl font-bold text-white">{current.giveaway.name}</div>
                        </>
                      )}
                    </>
                  ) : (
                    showRevealCTA && (
                      <div className="flex flex-col items-center justify-center gap-4 my-14 p-4">
                        <div className="text-white/80">Reveal this card ?</div>
                        <Button onClick={handleReveal} className="font-bold uppercase">
                          Reveal
                        </Button>
                      </div>
                    )
                  )}
                </div>


                {/* Navigation (si > 1 carte) */}
                {slots.length > 1 && (
                  <div className="flex gap-3 mt-2 justify-center items-center uppercase text-primary">
                    <Button
                      variant="outline"
                      onClick={goPrev}
                      disabled={idx === 0}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft size={20} />
                    </Button>
                    <div className="uppercase text-primary text-center font-bold">
                      {slots.length === 1 ? (
                        "Single card"
                      ) : (
                        <>
                          Card
                          <br />
                          {idx + 1} / {slots.length}
                        </>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={goNext}
                      disabled={idx === slots.length - 1}
                      className="flex items-center gap-2"
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                )}

                <div className="mt-2">
                  <Button onClick={onClose} className="font-bold uppercase">CLOSE</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


// Composant principal
export default function PackOpening() {
  const [configStep, setConfigStep] = useState(true);

  // --- états ---
  const [packsFighter, setPacksFighter] = useState(1);
  const [packsBoss, setPacksBoss] = useState(0);
  const [cardsPerPack, setCardsPerPack] = useState(1);   // défaut 1, max 7
  const [giveaways, setGiveaways] = useState([]);
  const [editingGiveaway, setEditingGiveaway] = useState(null);
  const [newGiveaway, setNewGiveaway] = useState({
    name: "",
    tier: "tier1",
    number: 1,
    iconIndex: 0
  });
  const totalPacks = (parseInt(packsFighter,10)||0) + (parseInt(packsBoss,10)||0);

  // État du pack généré
  const [generatedPacks, setGeneratedPacks] = useState([]);  // packs [{id, number, slots:[{id,giveaway, revealed}]}]
  const [selectedPack, setSelectedPack] = useState(null);    // pack ouvert dans la modale

  const [gridDimensions, setGridDimensions] = useState({ columns: 4, cardSize: 200 });
  const [screenWidth, setScreenWidth] = useState(0); // 0 pour éviter SSR mismatch
  const MIN_CARD_SIZE = 200; // Taille minimale en pixels pour les cartes

  useEffect(() => {
    const update = () => setScreenWidth(window.innerWidth);
    update(); // 1er montage (client)
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Calculer les dimensions optimales de la grille (packs)
  useEffect(() => {
    if (generatedPacks.length === 0) return;

    const calculateOptimalGrid = () => {
      const containerWidth = window.innerWidth - 96;
      const containerHeight = window.innerHeight - 200;

      const numTiles = generatedPacks.length;  // ← nombre de PACKS
      const aspectRatio = 3 / 4;
      const gap = 2;

      let bestConfig = { columns: 1, cardSize: 100, rows: numTiles };
      let bestScore = 0;

      for (let cols = 1; cols <= Math.min(numTiles, 12); cols++) {
        const rows = Math.ceil(numTiles / cols);
        const availableWidth = containerWidth - (cols - 1) * gap;
        const availableHeight = containerHeight - (rows - 1) * gap;
        const maxCardWidth = availableWidth / cols;
        const maxCardHeight = availableHeight / rows;
        const cardWidth = Math.min(maxCardWidth, maxCardHeight / aspectRatio);
        const cardHeight = Math.max(cardWidth * aspectRatio, MIN_CARD_SIZE);
        const totalWidth = cols * cardWidth + (cols - 1) * gap;
        const totalHeight = rows * cardHeight + (rows - 1) * gap;

        if (totalWidth <= containerWidth && totalHeight <= containerHeight) {
          const utilisation = (totalWidth * totalHeight) / (containerWidth * containerHeight);
          const equilibre = 1 - Math.abs(cols - rows) / Math.max(cols, rows);
          const score = cardHeight * utilisation * equilibre;
          if (score > bestScore) {
            bestScore = score;
            bestConfig = { columns: cols, cardSize: cardHeight, rows };
          }
        }
      }

      return bestConfig;
    };

    const optimal = calculateOptimalGrid();
    setGridDimensions(optimal);
  }, [generatedPacks.length]);

  // Recalculer lors du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      if (generatedPacks.length > 0) {
        const timer = setTimeout(() => {
          const calculateOptimalGrid = () => {
            const containerWidth = window.innerWidth - 96;
            const containerHeight = window.innerHeight - 200;
  
            const numTiles = generatedPacks.length; // packs
            const aspectRatio = 3 / 4;
            const gap = 24;
  
            let bestConfig = { columns: 1, cardSize: 200, rows: numTiles };
            let bestScore = 0;
  
            for (let cols = 1; cols <= Math.min(numTiles, 12); cols++) {
              const rows = Math.ceil(numTiles / cols);
              const availableWidth = containerWidth - (cols - 1) * gap;
              const availableHeight = containerHeight - (rows - 1) * gap;
              const maxCardWidth = availableWidth / cols;
              const maxCardHeight = availableHeight / rows;
              const cardWidth = Math.min(maxCardWidth, maxCardHeight / aspectRatio);
              const cardHeight = cardWidth * aspectRatio;
              const totalWidth = cols * cardWidth + (cols - 1) * gap;
              const totalHeight = rows * cardHeight + (rows - 1) * gap;
  
              if (totalWidth <= containerWidth && totalHeight <= containerHeight) {
                const utilisation = (totalWidth * totalHeight) / (containerWidth * containerHeight);
                const equilibre = 1 - Math.abs(cols - rows) / Math.max(cols, rows);
                const score = cardHeight * utilisation * equilibre;
  
                if (score > bestScore) {
                  bestScore = score;
                  bestConfig = { columns: cols, cardSize: cardHeight, rows };
                }
              }
            }
  
            return bestConfig;
          };
  
          const optimal = calculateOptimalGrid();
          setGridDimensions(optimal);
        }, 100);
  
        return () => clearTimeout(timer);
      }
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [generatedPacks.length]);  

  // Ajouter ou modifier un giveaway
  const handleSaveGiveaway = () => {
    if (!newGiveaway.name.trim()) return;

    if (editingGiveaway !== null) {
      // Modification
      const updated = [...giveaways];
      updated[editingGiveaway] = { ...newGiveaway };
      setGiveaways(updated);
      setEditingGiveaway(null);
    } else {
      // Ajout
      setGiveaways([...giveaways, { ...newGiveaway }]);
    }
    
    setNewGiveaway({ name: "", tier: "tier1", number: 1, iconIndex: 0 });
  };

  // Supprimer un giveaway
  const handleDeleteGiveaway = (index) => {
    setGiveaways(giveaways.filter((_, i) => i !== index));
  };

  // Modifier un giveaway
  const handleEditGiveaway = (index) => {
    setNewGiveaway({ ...giveaways[index] });
    setEditingGiveaway(index);
  };

  // Petit utilitaire de shuffle (Fisher–Yates)
  function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Générer le pack
  const generatePack = () => {
    // Catégories → indices d'icônes
    const SET_UTILITY = new Set(["Badge","Contract","Gameshare"].map(n => ICON_NAMES.indexOf(n)));
    const SET_FIGHTER = new Set([
      "Antimatter","Dash","Female","Hook","Jetpack","Jump","Lobber","Male","Manipulator","Railgun","Striker"
    ].map(n => ICON_NAMES.indexOf(n)));
    const SET_BOSS = new Set([
      "Autorepear","Boss","Gaspod","Gravitygun","Hammer","Laser","Spike","Toxicgun"
    ].map(n => ICON_NAMES.indexOf(n)));
  
    const pf = Math.max(0, parseInt(packsFighter, 10) || 0);
    const pb = Math.max(0, parseInt(packsBoss, 10) || 0);
    const cpp = Math.max(1, Math.min(7, parseInt(cardsPerPack, 10) || 1));
  
    // 1) Construire les pools à partir des giveaways
    const poolFighter = [];
    const poolBoss = [];
  
    giveaways.forEach((g) => {
      const n = Math.max(0, g.number || 0);
      for (let i = 0; i < n; i++) {
        const item = { ...g }; // éviter de partager la même ref
        if (SET_FIGHTER.has(g.iconIndex) || SET_UTILITY.has(g.iconIndex)) poolFighter.push({ ...item });
        if (SET_BOSS.has(g.iconIndex)    || SET_UTILITY.has(g.iconIndex)) poolBoss.push({ ...item });
      }
    });
  
    shuffleInPlace(poolFighter);
    shuffleInPlace(poolBoss);
  
    // 2) Créer TOUS les packs vides (giveaway=null partout)
    const packs = [];
    for (let p = 0; p < pf; p++) {
      packs.push({
        id: `fighter-pack-${p + 1}`,
        number: p + 1,
        type: "fighter",
        slots: Array.from({ length: cpp }, (_, s) => ({
          id: `fighter-pack-${p + 1}-slot-${s + 1}`,
          giveaway: null,
          revealed: false,
        })),
      });
    }
    for (let p = 0; p < pb; p++) {
      packs.push({
        id: `boss-pack-${p + 1}`,
        number: p + 1,
        type: "boss",
        slots: Array.from({ length: cpp }, (_, s) => ({
          id: `boss-pack-${p + 1}-slot-${s + 1}`,
          giveaway: null,
          revealed: false,
        })),
      });
    }
  
    // 3) Lister toutes les positions de slots par type, puis les mélanger
    const fighterPositions = [];
    const bossPositions = [];
    packs.forEach((pack, pi) => {
      pack.slots.forEach((_, si) => {
        if (pack.type === "fighter") fighterPositions.push([pi, si]);
        else bossPositions.push([pi, si]);
      });
    });
    shuffleInPlace(fighterPositions);
    shuffleInPlace(bossPositions);
  
    // 4) Répartir aléatoirement les pools dans les positions
    // (si plus d’items que de slots, l’excédent est ignoré)
    poolFighter.forEach((g) => {
      const pos = fighterPositions.pop();
      if (!pos) return;
      const [pi, si] = pos;
      packs[pi].slots[si].giveaway = { ...g };
    });
  
    poolBoss.forEach((g) => {
      const pos = bossPositions.pop();
      if (!pos) return;
      const [pi, si] = pos;
      packs[pi].slots[si].giveaway = { ...g };
    });
  
    // 5) (optionnel) mélanger l’ordre d’affichage des packs,
    // mais comme tu les tries par id au rendu, ce n’est pas critique.
    // shuffleInPlace(packs);
  
    setGeneratedPacks(packs);
    setSelectedPack(null);
    setConfigStep(false);
  };
  
  
  
  const revealSlot = (packId, slotId) => {
    setGeneratedPacks((prev) => {
      const next = prev.map((pack) => {
        if (pack.id !== packId) return pack;
        return {
          ...pack,
          slots: pack.slots.map((s) => (s.id === slotId ? { ...s, revealed: true } : s)),
        };
      });
      // si la modale est ouverte sur ce pack, on la remet à jour
      const updated = next.find((p) => p.id === packId);
      if (selectedPack?.id === packId) setSelectedPack(updated);
      return next;
    });
  };  

  // Révéler une carte
  const revealCard = (cardId) => {
    setRevealedCards(prev => new Set([...prev, cardId]));
  };

  // Retour à la configuration
  const backToConfig = () => {
    setConfigStep(true);
    setGeneratedPacks([]);
    setSelectedPack(null);
  };

  if (!configStep) {
    return (
      <>
        <div className="w-full min-h-screen bg-transparent">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-primary mb-4">Pack Opening</h2>
            <p className="text-lg text-gray-300 mb-4">
              Click on the cards to reveal them ! 🃏
            </p>
            <Button onClick={backToConfig} variant="outline">
              Back to list
            </Button>
          </div>
  
          {/* Grille de packs */}
          <div
            className="flex flex-wrap gap-4 mx-auto justify-center items-center"
            style={{ gridTemplateColumns: `repeat(${gridDimensions.columns}, 1fr)`, maxWidth: "fit-content" }}
          >
            {[...generatedPacks]
              .sort((a, b) => idNum(a.id) - idNum(b.id))
              .map((pack) => (
                <Card
                  key={pack.id}
                  pack={pack}
                  cardSize={
                    screenWidth && screenWidth < 1024
                      ? Math.max(gridDimensions.cardSize * 2, MIN_CARD_SIZE)
                      : Math.max(gridDimensions.cardSize, MIN_CARD_SIZE)
                  }
                  onOpen={() => setSelectedPack(pack)}
                  tiers={TIERS}
                  icons={ICONS}
                />
              ))}
          </div>


          {/* Modale pack */}
          <AnimatePresence>
            {selectedPack && (
              <PackOpenModal
              pack={selectedPack}
              onClose={() => setSelectedPack(null)}
              onRevealSlot={revealSlot}
              tiers={TIERS}
              icons={ICONS}
              cardSize={
                screenWidth && screenWidth < 1024
                  ? Math.max(gridDimensions.cardSize * 2, MIN_CARD_SIZE)
                  : Math.max(gridDimensions.cardSize, MIN_CARD_SIZE)
              }
            />            
            )}
          </AnimatePresence>

        </div>
  
        
      </>
    );
  }
  
  // Interface de configuration
  return (
    <div className="w-full p-6 min-h-screen bg-transparent">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-primary mb-4">Pack Opening</h2>
          <p className="text-lg text-gray-300">
            Configure on-chain pack generation
          </p>
        </div>

        {/* Configuration des giveaways */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Giveaways</h3>
          
          {/* Formulaire d'ajout/modification */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <Input
              placeholder="Giveaway name"
              value={newGiveaway.name}
              onChange={(e) => setNewGiveaway({...newGiveaway, name: e.target.value})}
            />
            
            <Select
              value={newGiveaway.tier}
              onValueChange={(value) => setNewGiveaway({...newGiveaway, tier: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIERS.map(tier => (
                  <SelectItem key={tier.value} value={tier.value}>
                    <span className={tier.color}>{tier.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              min="1"
              placeholder="Number"
              value={newGiveaway.number}
              onChange={(e) => setNewGiveaway({...newGiveaway, number: parseInt(e.target.value) || 1})}
            />
            
            <Select
              value={newGiveaway.iconIndex.toString()}
              onValueChange={(value) => setNewGiveaway({...newGiveaway, iconIndex: parseInt(value)})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICONS.map((icon, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    <div className="flex items-center gap-2">
                      <img src={icon} alt={`Icon ${index + 1}`} className="w-6 h-6" />
                      {ICON_NAMES[index]}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={handleSaveGiveaway}>
              {editingGiveaway !== null ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {editingGiveaway !== null ? "Modify" : "ADD"}
            </Button>
          </div>

          {/* Liste des giveaways */}
          {giveaways.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Giveaway</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {giveaways.map((giveaway, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-white">{giveaway.name}</TableCell>
                    <TableCell>
                      <span className={TIERS.find(t => t.value === giveaway.tier)?.color}>
                        {TIERS.find(t => t.value === giveaway.tier)?.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-white">{giveaway.number}</TableCell>
                    <TableCell>
                      <img src={ICONS[giveaway.iconIndex]} alt="Icon" className="w-8 h-8" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditGiveaway(index)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteGiveaway(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Configuration du nombre de packs */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Packs</h3>

          <div className="flex flex-row items-center gap-8 flex-wrap">
            <div className="flex flex-col gap-2">
              <label className="text-white">Packs Fighter number</label>
              <Input
                type="number"
                min="0"
                max="200"
                value={packsFighter}
                onChange={(e) => setPacksFighter(Math.max(0, Math.min(200, parseInt(e.target.value) || 0)))}
                className="w-40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white">Packs Boss number</label>
              <Input
                type="number"
                min="0"
                max="200"
                value={packsBoss}
                onChange={(e) => setPacksBoss(Math.max(0, Math.min(200, parseInt(e.target.value) || 0)))}
                className="w-40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white">Card(s) / pack</label>
              <Input
                type="number"
                min="1"
                max="7"
                value={cardsPerPack}
                onChange={(e) => setCardsPerPack(Math.max(1, Math.min(7, parseInt(e.target.value) || 1)))}
                className="w-40"
              />
            </div>
          </div>

          {/* Indicateurs % par catégorie (par carte) */}
          {(() => {
            // Catégories d'icônes -> indices via ICON_NAMES
            const SET_UTILITY = new Set(["Badge", "Contract", "Gameshare"].map(n => ICON_NAMES.indexOf(n)));
            const SET_FIGHTER = new Set([
              "Antimatter","Dash","Female","Hook","Jetpack","Jump","Lobber","Male","Manipulator","Railgun","Striker"
            ].map(n => ICON_NAMES.indexOf(n)));
            const SET_BOSS = new Set([
              "Autorepear","Boss","Gaspod","Gravitygun","Hammer","Laser","Spike","Toxicgun"
            ].map(n => ICON_NAMES.indexOf(n)));

            // Dénominateurs = nb de cartes concernées
            const pf = parseInt(packsFighter, 10) || 0;
            const pb = parseInt(packsBoss, 10) || 0;
            const cpp = parseInt(cardsPerPack, 10) || 0;

            const totalCardsUtility = (pf + pb) * cpp;  // Utility peut tomber dans les 2 types de packs
            const totalCardsFighter = pf * cpp;
            const totalCardsBoss    = pb * cpp;

            // Compteurs par tier et catégorie
            const countTierCat = (tier, set) =>
              giveaways.reduce((acc, g) => {
                const n = parseInt(g.number, 10) || 0;
                return acc + (g.tier === tier && set.has(g.iconIndex) ? n : 0);
              }, 0);

            const U1 = countTierCat("tier1", SET_UTILITY);
            const U2 = countTierCat("tier2", SET_UTILITY);
            const U3 = countTierCat("tier3", SET_UTILITY);

            const F1 = countTierCat("tier1", SET_FIGHTER);
            const F2 = countTierCat("tier2", SET_FIGHTER);
            const F3 = countTierCat("tier3", SET_FIGHTER);

            const B1 = countTierCat("tier1", SET_BOSS);
            const B2 = countTierCat("tier2", SET_BOSS);
            const B3 = countTierCat("tier3", SET_BOSS);

            const totalFighterRewards = giveaways.reduce(
              (acc, g) => acc + (SET_FIGHTER.has(g.iconIndex) ? (parseInt(g.number, 10) || 0) : 0),
              0
            );
            const totalBossRewards = giveaways.reduce(
              (acc, g) => acc + (SET_BOSS.has(g.iconIndex) ? (parseInt(g.number, 10) || 0) : 0),
              0
            );
            const totalUtilityRewards = giveaways.reduce(
              (acc, g) => acc + (SET_UTILITY.has(g.iconIndex) ? (parseInt(g.number, 10) || 0) : 0),
              0
            );

            const pct = (num, den) =>
              den > 0 ? Math.min(100, (num / den) * 100).toFixed(1) : "0.0";

            return (
              <div className="mt-4 space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-md border border-white/10 p-3 text-center">
                  <div className="text-white/70 text-sm">Total Fighter reward(s)</div>
                  <div className="text-2xl font-bold text-white">{totalFighterRewards}</div>
                </div>
                <div className="rounded-md border border-white/10 p-3 text-center">
                  <div className="text-white/70 text-sm">Total Boss reward(s)</div>
                  <div className="text-2xl font-bold text-white">{totalBossRewards}</div>
                </div>
                <div className="rounded-md border border-white/10 p-3 text-center">
                  <div className="text-white/70 text-sm">Total Utility reward(s)</div>
                  <div className="text-2xl font-bold text-white">{totalUtilityRewards}</div>
                </div>
              </div>

                {/* Utility */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-md border border-white/10 p-3 text-center">
                    <div className="text-white/70 text-sm">Utility Tier 1 luck rate</div>
                    <div className="text-xl font-bold text-white">{pct(U1, totalCardsUtility)}%</div>
                  </div>
                  <div className="rounded-md border border-white/10 p-3 text-center">
                    <div className="text-white/70 text-sm">Utility Tier 2 luck rate</div>
                    <div className="text-xl font-bold text-green-300">{pct(U2, totalCardsUtility)}%</div>
                  </div>
                  <div className="rounded-md border border-white/10 p-3 text-center">
                    <div className="text-white/70 text-sm">Utility Tier 3 luck rate</div>
                    <div className="text-xl font-bold text-yellow-500">{pct(U3, totalCardsUtility)}%</div>
                  </div>
                </div>

                {/* Fighter */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-md border border-white/10 p-3 text-center">
                    <div className="text-white/70 text-sm">Fighter Tier 1 luck rate</div>
                    <div className="text-xl font-bold text-white">{pct(F1, totalCardsFighter)}%</div>
                  </div>
                  <div className="rounded-md border border-white/10 p-3 text-center">
                    <div className="text-white/70 text-sm">Fighter Tier 2 luck rate</div>
                    <div className="text-xl font-bold text-green-300">{pct(F2, totalCardsFighter)}%</div>
                  </div>
                  <div className="rounded-md border border-white/10 p-3 text-center">
                    <div className="text-white/70 text-sm">Fighter Tier 3 luck rate</div>
                    <div className="text-xl font-bold text-yellow-500">{pct(F3, totalCardsFighter)}%</div>
                  </div>
                </div>

                {/* Boss */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-md border border-white/10 p-3 text-center">
                    <div className="text-white/70 text-sm">Boss Tier 1 luck rate</div>
                    <div className="text-xl font-bold text-white">{pct(B1, totalCardsBoss)}%</div>
                  </div>
                  <div className="rounded-md border border-white/10 p-3 text-center">
                    <div className="text-white/70 text-sm">Boss Tier 2 luck rate</div>
                    <div className="text-xl font-bold text-green-300">{pct(B2, totalCardsBoss)}%</div>
                  </div>
                  <div className="rounded-md border border-white/10 p-3 text-center">
                    <div className="text-white/70 text-sm">Boss Tier 3 luck rate</div>
                    <div className="text-xl font-bold text-yellow-500">{pct(B3, totalCardsBoss)}%</div>
                  </div>
                </div>
              </div>
            );
          })()}


        </div>

        {/* Bouton de génération */}
        <div className="text-center">
          
          <Button
            onClick={generatePack}
            size="lg"
            className="text-lg px-8 py-3"
            disabled={totalPacks < 1 || cardsPerPack < 1}
          >
            Generate ({totalPacks} packs)
          </Button>
        </div>
      </div>

    </div>
  );
}