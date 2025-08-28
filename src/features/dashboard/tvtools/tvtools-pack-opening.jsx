import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Antimatter, Autorepear, Badge, Boss, Contract, Dash, Female, Gameshare, Gaspod, Gravitygun, Hammer, Hook, Jetpack, Jump, Laser, Lobber, Male, Manipulator, Railgun, Spike, Striker, Toxicgun, A, FightersPack, BossPack, IconLoose} from "@img/index";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/table";
import { Plus, Edit, Trash2, X } from "lucide-react";

const ICONS = [Antimatter, Autorepear, Badge, Boss, Contract, Dash, Female, Gameshare, Gaspod, Gravitygun, Hammer, Hook, Jetpack, Jump, Laser, Lobber, Male, Manipulator, Railgun, Spike, Striker, Toxicgun];

const ICON_NAMES = ["Antimatter", "Autorepear", "Badge", "Boss", "Contract", "Dash", "Female", "Gameshare", "Gaspod", "Gravitygun", "Hammer", "Hook", "Jetpack", "Jump", "Laser", "Lobber", "Male", "Manipulator", "Railgun", "Spike", "Striker", "Toxicgun"];


const TIERS = [
  { value: "tier1", label: "Tier 1 ★", color: "text-white" },
  { value: "tier2", label: "Tier 2 ★★", color: "text-green-300" },
  { value: "tier3", label: "Tier 3 ★★★", color: "text-yellow-500" },
];

// Composant Card pour afficher une carte
function Card({ number, isRevealed, giveaway, onReveal, cardSize, onOpen }) {

  return (
    <div
        className="relative flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300"
        style={{
          perspective: "1000px",
          height: `${cardSize}px`,
          aspectRatio: "3/4",
        }}
        onClick={onOpen} // ← au lieu de (!isRevealed ? onReveal : undefined)
      >
      {/* Container avec transformation 3D */}
      <div
        className="relative w-full h-full transition-all duration-700 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isRevealed ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Face avant (non révélée) */}
        <div
          className="absolute inset-0 shadow-2xl flex flex-col justify-center items-center transition-colors"
          style={{ 
            backfaceVisibility: "hidden", 
            backgroundImage: `url(${FightersPack})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          
          {/* # + numéro : taille x2 */}
          <div
            className="absolute top-4 text-primary font-bold leading-none bg-black/30 backdrop-blur-sm rounded-full px-4 py-2"
            style={{ fontSize: `${Math.min(cardSize * 0.30, 22)}px` }}  // 0.15 -> 0.30, cap 36 -> 72
          >
            #{number}
          </div>
        </div>

        {/* Face arrière (révélée) */}
        <div
          className={`absolute inset-0 rounded-xl shadow-2xl flex flex-col items-center justify-center border-2 ${
            giveaway 
              ? "bg-gradient-to-br from-green-600 to-green-800 border-green-500" 
              : "bg-gradient-to-br from-red-600 to-red-800 border-red-500"
          }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-center text-white p-4">
            {giveaway ? (
              <>
                <div 
                  className="font-bold mb-2 text-primary"
                  style={{ fontSize: `${Math.min(cardSize * 0.12, 24)}px` }}
                >
                  WIN
                </div>
                <img
                  src={ICONS[giveaway.iconIndex]}
                  alt="Giveaway icon"
                  className="object-contain mx-auto mb-2"
                  style={{ 
                    width: `${Math.min(cardSize * 0.3, 96)}px`,
                    height: `${Math.min(cardSize * 0.3, 96)}px`
                  }}
                />
                <div 
                  className={`font-bold ${TIERS.find(t => t.value === giveaway.tier)?.color}`}
                  style={{ fontSize: `${Math.min(cardSize * 0.08, 18)}px` }}
                >
                  {TIERS.find(t => t.value === giveaway.tier)?.label}
                </div>
              </>
            ) : (
              <>
                <div 
                  className="font-bold text-red-400"
                  style={{ fontSize: `${Math.min(cardSize * 0.12, 24)}px` }}
                >
                  LOOSE
                </div>
              </>
            )}
          </div>
        </div>
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
function useHoldToRip({ duration = 3000, onComplete }) {
  const [progress, setProgress] = React.useState(0);
  const [holding, setHolding] = React.useState(false);
  const rafRef = React.useRef(null);
  const startRef = React.useRef(null);

  const stop = React.useCallback((completed = false) => {
    setHolding(false);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startRef.current = null;
    if (!completed) setProgress(0);
  }, []);

  const step = React.useCallback(
    (t) => {
      if (!startRef.current) startRef.current = t;
      const elapsed = t - startRef.current;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);
      if (p >= 1) {
        stop(true);
        onComplete?.();
      } else {
        rafRef.current = requestAnimationFrame(step);
      }
    },
    [duration, onComplete, stop]
  );

  const start = React.useCallback(() => {
    if (holding) return;
    setHolding(true);
    setProgress(0);
    rafRef.current = requestAnimationFrame(step);
  }, [holding, step]);

  // Handlers pointer/touch souris + mobile
  const bind = {
    onMouseDown: start,
    onMouseUp: () => stop(false),
    onMouseLeave: () => stop(false),
    onTouchStart: start,
    onTouchEnd: () => stop(false),
    onTouchCancel: () => stop(false),
  };

  return { progress, holding, bind };
}

// Composant pour "déchirer" le haut du pack via clip-path dentelé
function TopTearBand({ progress, bgImage }) {

  return (
    <motion.div
      className="flex top-0 left-0 right-0 h-[6.2%]"
      style={{              // hauteur du bandeau déchiré (ajuste)
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundSize: "cover",
        WebkitMaskRepeat: "no-repeat",
      }}
      // on rogne depuis la GAUCHE vers la DROITE
      animate={{ clipPath: `inset(0 0 0 ${progress * 100}%)` }}
      transition={{ type: "tween", ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

function CardRevealModal({ card, onClose, onReveal, tiers, icons }) {
  const [revealed, setRevealed] = React.useState(false);
  const [burst, setBurst] = React.useState(false);
  const [starsTrigger, setStarsTrigger] = React.useState(0);
  const isWin = Boolean(card?.giveaway);

  if (!card) return null;

  const META = {
    tier1: { stars: 24, color: "#9CA3AF" },
    tier2: { stars: 42, color: "#22C55E" },
    tier3: { stars: 72, color: "#FDE047" },
  };
  const tierKey = card?.giveaway?.tier ?? "tier1";
  const tmeta = META[tierKey] ?? META.tier1;

  // 3s hold → ouverture
  const { progress, holding, bind } = useHoldToRip({
    duration: 3000,
    onComplete: () => {
      if (isWin) {
        setStarsTrigger(Date.now()); // étoiles uniquement si GAIN
      }
      setTimeout(() => setRevealed(true), 1200);
      onReveal?.();
    },
  });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

        {/* Carte / conteneur */}
        <motion.div
          className="relative w-[min(82vw,520px)] aspect-[3/4] rounded-2xl overflow-visible z-50 select-none"
          initial={{ scale: 0.85, opacity: 0, rotate: -2 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.92, opacity: 0, rotate: 2 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          {...bind}
        >
          {/* === COUVERTURE visible tant que !revealed === */}
          {!revealed && (
            <>
              {/* bas du pack */}
              <div
                className="absolute left-0 right-0 -bottom-7 s:-bottom-8 z-[10]"
                style={{
                  height: "99%",
                  backgroundImage: `url(${FightersPack})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "bottom center",
                  backgroundSize: "cover",
                }}
              />
              {/* bandeau haut */}
              <TopTearBand progress={progress} bgImage={FightersPack} />

              {/* header: help + close */}
              <div className="absolute -top-14 left-0 right-0 z-[20] flex items-center justify-center pointer-events-none">
                <div className="h-12 rounded-full text-lg text-primary">Press & hold 3s to open</div>
              </div>
              <button
                onClick={onClose}
                className="absolute -top-14 right-0 z-[30] rounded-full px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white pointer-events-auto"
              >
                <X size={42} />
              </button>

              {/* # numéro */}
              <div className="absolute bottom-4 s:bottom-6 s:mb-2 left-6 s:left-8 z-[20] text-primary/50 text-xl font-semibold">
                #{card.number}
              </div>
            </>
          )}

          {/* ⭐ étoiles au-dessus de tout */}
          {isWin && (
            <StarBurstPersistent
              key={starsTrigger}          // force un remount propre à chaque trigger
              trigger={starsTrigger}
              color={tmeta.color}
              count={tmeta.stars}
              runForMs={20000}
              waveEvery={10000}
              particleDuration={10000}
            />
          )}

          {/* === PANNEAU RÉSULTAT : rendu quand revealed === */}
          {revealed && (
            <motion.div
              className="absolute inset-0 z-[70] flex items-center justify-center"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
            >
              <div className="flex flex-col items-center justify-center w-5/6 s:w-4/6 h-5/6 s:h-4/6 gap-5 border-4 border-primary/50 rounded-2xl bg-gray-900/30 backdrop-blur-sm">
                <div className={isWin ? "text-primary text-3xl uppercase font-bold"
                        : "text-red-600 text-3xl uppercase font-bold"}>
                  {isWin ? "You won" : "No reward"}
                </div>
                {!isWin && (
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 12 }}
                  >
                    <img
                      src={IconLoose}
                      alt="Loose"
                      className="w-35 h-35 mx-auto mt-2 drop-shadow-[0_0_12px_rgba(0,0,0,0.35)]"
                    />
                  </motion.div>
                )}


                {isWin && (
                  <div className="text-xl font-semibold" style={{ color: tmeta.color }}>
                    {tiers.find((t) => t.value === (card?.giveaway?.tier ?? "tier1"))?.label}
                  </div>
                )}

                {card?.giveaway && (
                  <>
                    <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 240, damping: 12 }}>
                      <img
                        src={icons[card.giveaway.iconIndex]}
                        alt="Giveaway"
                        className="w-24 h-24 mx-auto drop-shadow-[0_0_22px_rgba(0,0,0,0.35)]"
                      />
                    </motion.div>
                    <div className="text-2xl font-bold text-white">{card.giveaway.name}</div>
                  </>
                )}

                <button
                  onClick={onClose}
                  className="justify-center whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-background shadow hover:bg-primary/90 font-bold uppercase h-9 px-4 py-2 flex items-center gap-2 transition-transform duration-200 hover:scale-105"
                >
                  Continue
                </button>
              </div>
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
  const [packsNumber, setPacksNumber] = useState(1);     // sera auto-calculé depuis giveaways
  const [cardsPerPack, setCardsPerPack] = useState(1);   // défaut 1, max 7
  const [packsTouched, setPacksTouched] = useState(false); // savoir si l'utilisateur a overridé le défaut
  const [giveaways, setGiveaways] = useState([]);
  const [editingGiveaway, setEditingGiveaway] = useState(null);
  const [newGiveaway, setNewGiveaway] = useState({
    name: "",
    tier: "tier1",
    number: 1,
    iconIndex: 0
  });

  // État du pack généré
  const [generatedCards, setGeneratedCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState(new Set());
  const [gridDimensions, setGridDimensions] = useState({ columns: 4, cardSize: 200 });
  const [screenWidth, setScreenWidth] = useState(0); // 0 pour éviter SSR mismatch
  const MIN_CARD_SIZE = 200; // Taille minimale en pixels

  useEffect(() => {
    const update = () => setScreenWidth(window.innerWidth);
    update(); // 1er montage (client)
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // 👉 État pour gérer la popup
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  // ouvre/ferme la modale
  const openCard = (card) => setActiveCard(card);
  const closeCard = () => setActiveCard(null);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Calculer les dimensions optimales de la grille
  useEffect(() => {
    if (generatedCards.length === 0) return;

    const calculateOptimalGrid = () => {
      const containerWidth = window.innerWidth - 96; // padding 48px de chaque côté
      const containerHeight = window.innerHeight - 200; // header + padding
      
      const numCards = generatedCards.length;
      const aspectRatio = 3/4; // ratio largeur/hauteur des cartes
      const gap = 2; // gap entre les cartes
      
      let bestConfig = { columns: 1, cardSize: 100, rows: numCards };
      let bestScore = 0;
      
      // Tester différentes configurations de colonnes
      for (let cols = 1; cols <= Math.min(numCards, 12); cols++) {
        const rows = Math.ceil(numCards / cols);
        
        // Calculer la taille maximale possible des cartes
        const availableWidth = containerWidth - (cols - 1) * gap;
        const availableHeight = containerHeight - (rows - 1) * gap;
        
        const maxCardWidth = availableWidth / cols;
        const maxCardHeight = availableHeight / rows;
        
        // La carte doit respecter le ratio 3:4
        const cardWidth = Math.min(maxCardWidth, maxCardHeight / aspectRatio);
        const cardHeight = Math.max(cardWidth * aspectRatio, MIN_CARD_SIZE);
        
        // Vérifier si cette configuration rentre dans l'écran
        const totalWidth = cols * cardWidth + (cols - 1) * gap;
        const totalHeight = rows * cardHeight + (rows - 1) * gap;
        
        if (totalWidth <= containerWidth && totalHeight <= containerHeight) {
          // Score basé sur la taille des cartes et l'équilibre de la grille
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
  }, [generatedCards.length]);

  // Recalculer lors du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      if (generatedCards.length > 0) {
        // Délai pour éviter trop de recalculs
        const timer = setTimeout(() => {
          const calculateOptimalGrid = () => {
            const containerWidth = window.innerWidth - 96;
            const containerHeight = window.innerHeight - 200;
            
            const numCards = generatedCards.length;
            const aspectRatio = 3/4;
            const gap = 24;
            
            let bestConfig = { columns: 1, cardSize: 200, rows: numCards };
            let bestScore = 0;
            
            for (let cols = 1; cols <= Math.min(numCards, 12); cols++) {
              const rows = Math.ceil(numCards / cols);
              
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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [generatedCards.length]);

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
    // 1) Construire toutes les occurrences de giveaways
    const allGiveaways = [];
    giveaways.forEach((g) => {
      const n = Math.max(0, g.number ?? 0);
      for (let i = 0; i < n; i++) {
        allGiveaways.push({ ...g });
      }
    });
  
    // 2) Nombre total de slots = packs × cartes/pack
    const totalSlots = Math.max(1, (packsNumber || 1) * (cardsPerPack || 1));
  
    // 3) Mélanger, compléter avec des "pertes", re-mélanger
    let pool = shuffleInPlace([...allGiveaways]);
    if (pool.length > totalSlots) {
      pool = pool.slice(0, totalSlots); // trop de gains => on tronque
    } else {
      while (pool.length < totalSlots) pool.push(null); // slots restants => No reward
    }
    shuffleInPlace(pool);
  
    // 4) Générer une liste à plat de cartes (pack/slot)
    const cards = [];
    let k = 0;
    for (let p = 0; p < packsNumber; p++) {
      for (let s = 0; s < cardsPerPack; s++) {
        const giveaway = pool[k++];
        cards.push({
          id: `pack-${p + 1}-slot-${s + 1}`,
          number: `${p + 1}-${s + 1}`, // affichage '#P-S' (string ok)
          giveaway,
        });
      }
    }
  
    setGeneratedCards(cards);
    setRevealedCards(new Set());
    setConfigStep(false);
  };
  

  // Révéler une carte
  const revealCard = (cardId) => {
    setRevealedCards(prev => new Set([...prev, cardId]));
  };

  // Retour à la configuration
  const backToConfig = () => {
    setConfigStep(true);
    setGeneratedCards([]);
    setRevealedCards(new Set());
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
  
          {/* Grille de cartes */}
          <div
            className="flex flex-wrap gap-4 mx-auto justify-center items-center"
            style={{
              gridTemplateColumns: `repeat(${gridDimensions.columns}, 1fr)`,
              maxWidth: "fit-content",
            }}
          >
            {generatedCards.map((card) => (
              <Card
                key={card.id}
                number={card.number}
                isRevealed={revealedCards.has(card.id)}
                giveaway={card.giveaway}
                onReveal={() => revealCard(card.id)}
                // 🚀 Double la taille des cartes si l'écran fait moins de 1024px
                cardSize={
                  screenWidth && screenWidth < 1024
                    ? Math.max(gridDimensions.cardSize * 2, MIN_CARD_SIZE)
                    : Math.max(gridDimensions.cardSize, MIN_CARD_SIZE)
                }
                onOpen={() => setSelectedCard(card)}   // ← ouvre la popup
              />
            ))}
          </div>
        </div>
  
        {/* Popup d’animation / reveal */}
        <AnimatePresence>
          {selectedCard && (
            <CardRevealModal
              card={selectedCard}
              onClose={() => setSelectedCard(null)}
              onReveal={() => {
                // marque la carte comme révélée côté parent
                revealCard(selectedCard.id);
                // on laisse la modale ouverte pour l’animation, l’utilisateur ferme via "Continue" / "Close"
              }}
              tiers={TIERS}
              icons={ICONS}
            />
          )}
        </AnimatePresence>
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
            Configure pack before opening
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
          <div className="flex flex-row items-center gap-8">
            <div className="flex flex-col items-left gap-4">
              <label className="text-white">Packs number</label>
              <Input
                type="number"
                min="1"
                max="200"
                value={packsNumber}
                onChange={(e) => {
                  setPacksTouched(true);
                  const val = Math.max(1, Math.min(200, parseInt(e.target.value) || 1));
                  setPacksNumber(val);
                }}
                className="w-32"
              />
            </div>
            <div className="flex flex-col items-left gap-4">
              <label className="text-white">Card(s) / pack</label>
              <Input
                type="number"
                min="1"
                max="7"
                value={cardsPerPack}
                onChange={(e) => setCardsPerPack(Math.max(1, Math.min(7, parseInt(e.target.value) || 1)))}
                className="w-32"
              />
            </div>
          </div>

          
        </div>

        {/* Bouton de génération */}
        <div className="text-center">
          <Button
            onClick={generatePack}
            size="lg"
            className="text-lg px-8 py-3"
            disabled={packsNumber < 1 || cardsPerPack < 1}
          >
            Generate ({packsNumber} packs)
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {activeCard && (
            <CardModal
            card={activeCard}
            onClose={closeCard}
            onConfirmReveal={() => {
                // marque la carte comme révélée et laisse la modale gérer l’animation
                revealCard(activeCard.id);
            }}
            tiers={TIERS}
            icons={ICONS}
            />
        )}
      </AnimatePresence>

    </div>
  );
}