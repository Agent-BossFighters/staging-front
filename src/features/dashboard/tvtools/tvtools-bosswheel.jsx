import React, { useEffect, useMemo, useState, useRef } from "react";
import { Icon1, Icon2, Icon3, Icon4, Icon5, Icon6, Icon7, Icon8 } from "@img/index";
import confetti from "canvas-confetti";
import { Trash2 } from "lucide-react";

const ICONS = [Icon1, Icon2, Icon3, Icon4, Icon5, Icon6, Icon7, Icon8];

const gapDegrees = 4;
const innerTipRadius = 5;
const colors = ["#FFD32A", "#FFFFFF"];
const SPIN_DURATION = 7000;

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const round2 = (n) => Math.round(n * 100) / 100;

export default function BossWheel() {
  const [elements, setElements] = useState(() => {
    const stored = localStorage.getItem("wheelElements");
    return stored ? JSON.parse(stored) : [];
  });

  const [needleDeg, setNeedleDeg] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [highlightIdx, setHighlightIdx] = useState(null);
  const resultBoxRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("wheelElements", JSON.stringify(elements));
  }, [elements]);

  const visible = useMemo(
    () => elements.map((e, i) => ({ ...e, _idx: i })).filter((e) => e.eventLeft !== 0),
    [elements]
  );

  const totalLuck = visible.reduce((a, e) => a + Number(e.luckRate || 0), 0);
  const totalLuckInt = Math.round(totalLuck);
  const canSpin = visible.length >= 2 && totalLuckInt === 100;

  const segments = useMemo(() => {
    let startRaw = 0;
    return visible.map((e) => {
      const raw = (Number(e.luckRate) / 100) * 360;
      const startAngle = startRaw + gapDegrees / 2;
      const endAngle = startRaw + raw - gapDegrees / 2;
      startRaw += raw;
      return {
        ...e,
        startAngle,
        endAngle,
        angle: Math.max(0, endAngle - startAngle),
        startRaw: startRaw - raw,
        endRaw: startRaw,
      };
    });
  }, [visible]);

  const addElement = () => {
    if (elements.length >= 12) return;
    const nextIndex = elements.length + 1;
    setElements((prev) => [
      ...prev,
      { label: `Item ${nextIndex}`, luckRate: 1, icon: null, eventLeft: 1 },
    ]);
  };

  const updateElement = (idx, field, value) => {
    setElements((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const removeElement = (idx) => {
    setElements((prev) => prev.filter((_, i) => i !== idx));
  };

  const fireConfettiOnResult = (duration = 2000) => {
    const el = resultBoxRef.current;
    if (!el || typeof confetti !== "function") return;
  
    const rect = el.getBoundingClientRect();
    const cx = (rect.left + rect.width / 2) / window.innerWidth;
    const cy = (rect.top  + rect.height / 2) / window.innerHeight;
  
    const colors = ["#FFD32A", "#FFFFFF"];
    const animationEnd = Date.now() + duration;
  
    (function frame() {
      confetti({
        particleCount: 4,
        spread: 120,
        startVelocity: 40,
        ticks: 100,
        scalar: 0.8,
        colors,
        origin: { x: cx, y: cy }
      });
      if (Date.now() < animationEnd) requestAnimationFrame(frame);
    })();
  };


  const spin = () => {
    if (!canSpin || spinning) return;
    const r = Math.random() * 100;
    let acc = 0;
    let visIdx = 0;
    for (let i = 0; i < visible.length; i++) {
      acc += Number(visible[i].luckRate || 0);
      if (r <= acc) {
        visIdx = i;
        break;
      }
    }
    const seg = segments[visIdx];
    const winner = visible[visIdx];

    const mid = (seg.startAngle + seg.endAngle) / 2;
    const targetModulo = (90 + mid) % 360;
    const currentModulo = ((needleDeg % 360) + 360) % 360;
    const delta = (targetModulo - currentModulo + 360) % 360;
    const target = needleDeg + 360 * 12 + delta;

    setSpinning(true);
    setResult(null);
    setHighlightIdx(null);
    setNeedleDeg(target);

    setTimeout(() => {
      setResult({ label: winner.label, icon: winner.icon, _idx: winner._idx });
      setHighlightIdx(winner._idx);
      setSpinning(false);
      requestAnimationFrame(() => fireConfettiOnResult(2000));

      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;


    }, SPIN_DURATION);
  };

  const removeResultItem = () => {
    if (!result) return;
    setElements((prev) => {
      let updated = prev.map((e, i) =>
        i === result._idx ? { ...e, eventLeft: e.eventLeft - 1 } : e
      );
  
      // On regarde si l'élément vient juste de passer à 0
      const justRemoved = updated[result._idx].eventLeft === 0;
  
      if (justRemoved) {
        const removedLuck = Number(prev[result._idx].luckRate || 0);
  
        const aliveIdx = updated
          .map((e, i) => ({ e, i }))
          .filter(({ e }) => e.eventLeft !== 0)
          .map(({ i }) => i);
  
        if (removedLuck > 0 && aliveIdx.length > 0) {
          const share = removedLuck / aliveIdx.length;
          updated = updated.map((e, i) =>
            aliveIdx.includes(i) ? { ...e, luckRate: Number(e.luckRate) + share } : e
          );
        }
  
        // Normalisation pour revenir à 100%
        const vis = updated.filter((e) => e.eventLeft !== 0);
        const sum = vis.reduce((a, e) => a + Number(e.luckRate || 0), 0);
        if (sum > 0) {
          const factor = 100 / sum;
          updated = updated.map((e) =>
            e.eventLeft !== 0 ? { ...e, luckRate: round2(Number(e.luckRate) * factor) } : e
          );
        }
      }
  
      return updated;
    });
  
    setResult(null);
  };
  

  return (
    <div className="min-h-screen text-white md:px-6" >

      <div className="flex flex-col 2xl:flex-row 2xl:items-start 2xl:gap-10">
        <div className="md:flex xl:basis-2/5 w-full h-full my-auto items-center justify-center">
          {canSpin ? (
            <WheelStatic
              segments={segments}
              icons={ICONS}
              needleDeg={needleDeg}
              spinning={spinning}
              onSpin={spin}
              highlightIdx={highlightIdx}
              result={result}
            />
          ) : (
            <div className="text-center text-red-400 p-4">
              Add 2 elements minimum and total Luck rate 100% to have the possibility to spin.
            </div>
          )}
        </div>

        <div className="xl:basis-3/5 w-full mt-0 md:mt-0">
          <div className="h-[100px] w-full flex items-center justify-center mb-4" ref={resultBoxRef}>
            {result && (
              <div className="flex items-center gap-8">
                <img
                  src={ICONS[result.icon]}
                  alt={result.label}
                  className="h-16"
                  style={{ transform: "scale(1.5)" }}
                />
                <div className="text-l font-bold text-center">
                  {result.label?.trim() || "Untitled"}
                </div>
                <button
                  onClick={removeResultItem}
                  className="justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-background shadow hover:bg-primary/90 font-bold uppercase h-9 px-4 py-2 items-center gap-2"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <ElementsTable
            elements={elements}
            icons={ICONS}
            onAdd={addElement}
            onUpdate={updateElement}
            onRemove={removeElement}
          />
        </div>
      </div>
    </div>
  );
}

function WheelStatic({ segments, icons, needleDeg, spinning, onSpin, highlightIdx, result }) {
  const viewBox = 100;
  const cx = 50;
  const cy = 50;
  const rOuter = 38;
  const rInner = innerTipRadius;
  const iconSize = 20;
  const iconRadius = (rOuter + rInner) / 2 + 16;

  return (
    <div className="relative xs:w-[400px] xs:h-[400px] md:w-[600px] md:h-[600px]">
      <svg viewBox={`0 0 ${viewBox} ${viewBox}`} className="w-full h-full">
        <defs>
          <filter id="seg-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {segments.map((seg, i) => {
          if (seg.angle <= 0) return null;

          const a1 = (Math.PI * seg.startAngle) / 180;
          const a2 = (Math.PI * seg.endAngle) / 180;

          const ix1 = cx + rInner * Math.cos(a1);
          const iy1 = cy + rInner * Math.sin(a1);
          const ix2 = cx + rInner * Math.cos(a2);
          const iy2 = cy + rInner * Math.sin(a2);
          const ox1 = cx + rOuter * Math.cos(a1);
          const oy1 = cy + rOuter * Math.sin(a1);
          const ox2 = cx + rOuter * Math.cos(a2);
          const oy2 = cy + rOuter * Math.sin(a2);

          const largeArc = seg.angle > 180 ? 1 : 0;
          const d = [
            `M ${ix1},${iy1}`,
            `L ${ox1},${oy1}`,
            `A ${rOuter},${rOuter} 0 ${largeArc} 1 ${ox2},${oy2}`,
            `L ${ix2},${iy2}`,
            `A ${rInner},${rInner} 0 ${largeArc} 0 ${ix1},${iy1}`,
            "Z",
          ].join(" ");

          const color = colors[i % colors.length];
          const midA = (a1 + a2) / 2;
          const iconX = cx + iconRadius * Math.cos(midA) - iconSize / 2;
          const iconY = cy + iconRadius * Math.sin(midA) - iconSize / 2;

          const isHighlighted = seg._idx === highlightIdx;

          return (
            <g key={i} filter={isHighlighted ? "url(#seg-glow)" : undefined}>
              <path d={d} fill={color} />
              {isHighlighted && (
                <path d={d} fill="none" stroke="#FFD32A" strokeWidth="1.8" opacity="0.95" />
              )}
              <image
                href={icons[seg.icon]}
                width={iconSize}
                height={iconSize}
                x={iconX}
                y={iconY}
                style={{ pointerEvents: "none" }}
              />
            </g>
          );
        })}
      </svg>

      <div
        className="absolute left-1/2 top-1/2 origin-bottom z-10 pointer-events-none"
        style={{
          transform: `translate(-50%, -100%) rotate(${needleDeg}deg)`,
          transition: spinning
            ? `transform ${SPIN_DURATION}ms cubic-bezier(0.1, 0.85, 0.2, 1)`
            : "none",
          width: 120,
          height: 150,
          filter: "drop-shadow(0 8px 8px #212121)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#212121",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        />
      </div>

      <button
        onClick={onSpin}
        disabled={spinning || segments.length < 2 || result /*ici on bloque si un résultat est encore affiché */} 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full text-black text-2xl font-bold uppercase z-20 transition-transform duration-200 hover:scale-105 active:scale-95 shadow-[0_6px_6px_#212121]"
        style={{
          width: "120px",
          height: "120px",
          backgroundColor: "#FFD32A",
          border: "15px solid #212121",
        }}
      >
        Spin
      </button>
    </div>
  );
}

function ElementsTable({ elements, icons, onAdd, onUpdate, onRemove }) {
  const inputCls =
    "flex h-12 border-b border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors hover:border-primary focus:border-b-2 focus:border-primary placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full";
  const numberExtra =
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("[role='combobox']") && !e.target.closest(".absolute")) {
        setOpenDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col w-full gap-8">
      <table className="table-auto w-full text-sm border-none">
        <thead className="bg-[#1E272E]">
          <tr>
            <th className="p-2 text-left">Element</th>
            <th className="p-2 text-left">Luck rate</th>
            <th className="p-2 text-left">Icon</th>
            <th className="p-2 text-left">Event left</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody className="bg-black">
          {elements.map((el, i) => (
            <tr
              key={i}
              className={`border-t border-gray-700 ${el.eventLeft === 0 ? "text-red-500" : ""}`}
            >
              <td className="p-1">
                <input
                  type="text"
                  maxLength={255}
                  value={el.label}
                  onChange={(e) => onUpdate(i, "label", e.target.value)}
                  className={inputCls}
                  placeholder="Element title"
                />
              </td>
              <td className="p-1">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={el.luckRate}
                    onChange={(e) =>
                      onUpdate(i, "luckRate", clamp(Number(e.target.value || 0), 1, 99))
                    }
                    className={`${inputCls} ${numberExtra}`}
                  />
                  <span>%</span>
                </div>
              </td>
              <td className="p-1 relative">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    role="combobox"
                    aria-expanded={openDropdownIndex === i}
                    aria-autocomplete="none"
                    onClick={() =>
                      setOpenDropdownIndex(openDropdownIndex === i ? null : i)
                    }
                    className="flex items-center justify-between whitespace-nowrap border border-input py-2 text-sm shadow-sm ml-3 w-20 h-12 px-2 rounded-full bg-[#212121]"
                  >
                    <span style={{ pointerEvents: "none" }}>
                      {el.icon != null ? (
                        <img src={icons[el.icon]} alt="" className="w-11 h-11 mx-auto" />
                      ) : null}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-down h-4 w-4 opacity-50"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </button>
                  {openDropdownIndex === i && (
                    <div className="absolute top-full left-0 mt-1 bg-black border border-white p-1 z-10 flex flex-wrap gap-1">
                      {icons
                        .map((iconSrc, idx) => ({ iconSrc, idx }))
                        .filter(({ idx }) => {
                          if (el.icon === idx) return true;
                          return !elements.some((e, j) => j !== i && e.icon === idx);
                        })
                        .map(({ iconSrc, idx }) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              onUpdate(i, "icon", idx);
                              setOpenDropdownIndex(null);
                            }}
                            className="p-1 hover:bg-gray-700"
                            title={`Icon ${idx + 1}`}
                          >
                            <img src={iconSrc} alt={`Icon ${idx + 1}`} className="w-12 h-12" />
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </td>
              <td className="p-1 max-w-4">
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={el.eventLeft}
                  onChange={(e) =>
                    onUpdate(i, "eventLeft", clamp(Number(e.target.value || 0), 0, 99))
                  }
                  className={`${inputCls} ${numberExtra}`}
                />
              </td>
              <td className="p-1 text-center">
                <button
                  onClick={() => onRemove(i)}
                  className="p-2"
                >
                  <Trash2 className="font-size-bold h-6 w-6 hover:text-red-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {elements.length < 12 && (
        <button
          onClick={onAdd}
          className="self-end justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-background shadow hover:bg-primary/90 font-bold uppercase h-9 px-4 py-2 items-center gap-2"
        >
          + Add Element
        </button>
      )}
    </div>
  );
}
