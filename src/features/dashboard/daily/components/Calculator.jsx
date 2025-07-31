import React, { useState, useEffect } from 'react'
import { useRarityManagement } from "../hooks/useRarityManagement";
import RaritySelect from "./rarity-select";
import { Spark } from "@img/index";
import { Switch } from "@shared/ui/switch";
import { Input } from '@shared/ui/input';
import { Button } from "@shared/ui/button";
import { useUserPreference } from "@context/userPreference.context";

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
    <div className="border-4 border-yellow-400 rounded-lg mb-10 w-[auto] p-4">
      <div className="flex flex-nowrap mb-3 max-w-full gap-2">
        <h2 className="text-2xl font-bold">CALCULATOR</h2>
        <label className="mt-auto flex items-center gap-2">
          <span className="text-s ml-2 text-white font-bold">AUTOCOMPLETE RARITY</span>
          <Switch
            checked={autoComplete}
            onCheckedChange={setAutoComplete}
          />
        </label>
      </div>
      <div className="flex">
        <div className="grid grid-cols-5 gap-4">
          {slots.map((slot, i) => (
            <div key={i} className="flex flex-col gap-2">
              <h3 className="bg-yellow-400 text-black rounded-lg font-bold text-center">SLOT {i + 1}</h3>
              <span className="text-s text-white font-bold">BADGE USED</span>
              <div className="items-center gap-2">
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

              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col w-full md:w-1/2">
                  <span className={`text-s mb-1 font-bold ${slot.rarity && slot.rarity !== "none" ? "text-white" : "text-gray-400"}`}>
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
                  <span className={`text-s mb-1 max-w-[87%] font-bold ${slot.rarity && slot.rarity !== "none" ? "text-white" : "text-gray-400"}`}>
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
        <div className="flex flex-col text-center min-w-[160px] ml-5">
          <div>
            <img src={Spark} alt="Energy" className="inline-block w-9 h-13 mb-1" />
            <p className="text-xl font-bold">ENERGY USED</p>
            <p>
              <span className="text-3xl font-bold text-red-500">{totalEnergyUsed}</span>
            </p>
            {!streamerMode && (
              <p className="text-md font-semibold">
                <span className="text-red-500">{totalPriceEnergyUsed.toFixed(2)} $</span>
              </p>
            )}
          </div>
          <Button
            onClick={() => {
              if (autoComplete) {
                handleNextMatch();
              } else {
                setSlots(Array(5).fill({ ...defaultSlot }));
              }
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-black mt-auto"
          >
            NEXT MATCH
          </Button>
        </div>
      </div>
    </div>
  )
}
