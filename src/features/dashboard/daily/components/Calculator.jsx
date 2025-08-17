import React, { useState, useEffect } from 'react'
import { useRarityManagement } from "../hooks/useRarityManagement";
import RaritySelect from "./rarity-select";
import { Spark } from "@img/index";
import { Switch } from "@shared/ui/switch";
import { Input } from '@shared/ui/input';
import { Button } from "@shared/ui/button";
import { useUserPreference } from "@context/userPreference.context";
import { Info } from "lucide-react";

const defaultSlot = {
  rarity: '',
  energyStart: '',
  energyEnd: ''
}

export default function Calculator({ onEnergyUsedChange, onPriceChange }) {
  const { streamerMode } = useUserPreference();
  const { rarities } = useRarityManagement();
  const rarityPrices = rarities.reduce((acc, r) => {
    if (r.price) acc[r.rarity.toLowerCase()] = r.price;
    return acc;
  }, {});

  // Initialiser les slots et l'état d'autocomplétion à partir du localStorage
  const [slots, setSlots] = useState(() => {
    const saved = localStorage.getItem("calculator_slots");
    return saved ? JSON.parse(saved) : Array(5).fill({ ...defaultSlot });
  });
  const [autoComplete, setAutoComplete] = useState(() => {
    const saved = localStorage.getItem("calculator_autocomplete");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("calculator_slots", JSON.stringify(slots));
    localStorage.setItem("calculator_autocomplete", JSON.stringify(autoComplete));
  }, [slots, autoComplete]);

  const handleChange = (index, field, value) => {
    const updated = [...slots]
    updated[index] = { ...updated[index], [field]: value }
    setSlots(updated)
  }

  const totalPriceEnergyUsed = slots.reduce((sum, slot) => {
    const start = parseInt(slot.energyStart || '0')
    const end = parseInt(slot.energyEnd || '0')
    const rarity = slot.rarity?.split('#')[0]?.toLowerCase() || ''
    if (!rarity || isNaN(start) || isNaN(end)) return sum
    const price = rarityPrices[rarity] || 0
    return sum + (start - end) * price
  }, 0)

  const totalEnergyUsed = slots.reduce((sum, slot) => {
    const start = parseInt(slot.energyStart || '0')
    const end = parseInt(slot.energyEnd || '0')
    if (isNaN(start) || isNaN(end)) return sum
    return sum + (start - end)
  }, 0)

  const handleNextMatch = () => {
    setSlots(prev =>
      prev.map((slot) => ({
        ...slot,
        energyStart: slot.energyEnd || '',
        energyEnd: ''
      }))
    );
  };
  
  useEffect(() => {
    if (onEnergyUsedChange) onEnergyUsedChange(totalEnergyUsed)
  }, [totalEnergyUsed])

  useEffect(() => {
    if (onPriceChange) onPriceChange(totalPriceEnergyUsed)
  }, [totalPriceEnergyUsed])

  return (
    <div className="border-2 border-yellow-400 rounded-lg mb-10 w-[auto] p-4">
      {/* Autocomplete */}
      <div className="flex flex-nowrap mb-3 max-w-full gap-2">
        <label className="mt-auto flex items-center gap-2">
          <span className="text-s ml-2 text-white font-bold">AUTOCOMPLETE</span>
          <div className="relative group">
            <Info size={32} className="text-gray-200 hover:text-primary cursor-help" />
            <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-[rgba(0,0,0,0.8)] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-64 sm:w-80">
              <p className="break-words">
                Once active, the "Energy end" values will be transferred to "Energy start" values when you use "Next match".
              </p>
              <div className="absolute top-full left-4 border-4 border-transparent border-t-black"></div>
            </div>
          </div>
          <Switch
            checked={autoComplete}
            onCheckedChange={setAutoComplete}
          />
        </label>
      </div>
      <div className="flex flex-wrap items-end justify-center">
        {/* Slots badge */}
        <div className="flex xl:flex-wrap flex-wrap w-full xl:w-5/6">
          {slots.map((slot, i) => (
            <div key={i} className="flex flex-row xl:flex-col gap-4 xl:gap-2 w-full xl:w-1/5 px-2 xl:justify-items-stretch mb-4 xl:mb-0">
              <h3 className="flex bg-yellow-400 text-black rounded-lg font-bold text-center w-2/6 xl:w-full items-center justify-center">SLOT {i + 1}</h3>
              <div className="flex xl:flex-col flex-wrap gap-2 w-2/6 xl:w-full">
                <span className="flex text-s text-white font-bold w-full items-center justify-start">BADGE USED</span>
                <div className="flex items-center justify-center xl:justify-start gap-2">
                  <RaritySelect
                    value={slot.rarity}
                    onChange={val => handleChange(i, 'rarity', val)}
                    disabled={false}
                    showIssueId={true}
                    selectedBadges={slots
                      .filter((_, idx) => idx !== i && _.rarity !== "none")
                      .map(r => r.rarity)}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2 w-full xl:w-full">
                <div className="flex flex-col w-full md:w-1/2">
                  <span className={`text-sm mb-1 font-bold ${slot.rarity && slot.rarity !== "none" ? "text-white" : "text-gray-400"}`}>
                    ENERGY START
                  </span>
                  <Input
                    name={`energyStart-${i}`}
                    value={slot.energyStart}
                    onChange={e => handleChange(i, 'energyStart', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Start"
                    maxLength={40}
                    disabled={!slot.rarity || slot.rarity === "none"}
                  />
                </div>
                <div className="flex flex-col w-full md:w-1/2">
                  <span className={`text-sm mb-1 max-w-[87%] font-bold ${slot.rarity && slot.rarity !== "none" ? "text-white" : "text-gray-400"}`}>
                    ENERGY END
                  </span>
                  <Input
                    name={`energyEnd-${i}`}
                    value={slot.energyEnd}
                    onChange={e => handleChange(i, 'energyEnd', e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="End"
                    maxLength={40}
                    disabled={!slot.rarity || slot.rarity === "none"}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Resultat */}
        <div className="flex flex-row xl:flex-col text-center w-full xl:w-1/6 px-2 justify-center items-center xl:items-end">
          <div className="flex flex-row xl:flex-col w-full justify-center items-center">
            <div className="flex flex-col w-2/6 xl:w-full justify-center items-center">
              <img src={Spark} alt="Energy" className="inline-block w-9 h-13 mb-1" />
              <p className="text-base xl:text-xl font-bold">ENERGY USED</p>
            </div>
            <div className="flex flex-col w-4/6 xl:w-full justify-center items-center">
              <p>
                <span className="text-2xl xl:text-3xl font-bold text-red-500">{totalEnergyUsed}</span>
              </p>
              {!streamerMode && (
                <p className="text-md font-semibold">
                  <span className="text-red-500">{totalPriceEnergyUsed.toFixed(2)} $</span>
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={() => {
              if (autoComplete) {
                handleNextMatch();
              } else {
                setSlots(Array(5).fill({ ...defaultSlot }));
              }
            }}
            className="justify-center whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-background shadow hover:bg-primary/90 font-bold uppercase h-12 w-full py-2 flex items-center gap-2 transition-transform duration-200 hover:scale-105 mt-2"
          >
            NEXT MATCH
          </Button>
        </div>
      </div>
    </div>
  )
}
