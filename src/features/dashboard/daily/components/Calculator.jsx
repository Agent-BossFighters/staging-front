import React, { useState } from 'react'
import { useRarityManagement } from "../hooks/useRarityManagement";
import RaritySelect from "./rarity-select";
import { Spark } from "@img/index";

const defaultSlot = {
  rarity: '',
  energyStart: '',
  energyEnd: ''
}

export default function Calculator() {
  const { rarities } = useRarityManagement();

  // Génère un objet { [rarity]: price }
  const rarityPrices = rarities.reduce((acc, r) => {
    if (r.price) acc[r.rarity.toLowerCase()] = r.price;
    return acc;
  }, {});

  const [slots, setSlots] = useState(Array(5).fill({ ...defaultSlot }))
  const [autoComplete, setAutoComplete] = useState(false)

  const handleChange = (index, field, value) => {
    const updated = [...slots]
    updated[index] = { ...updated[index], [field]: value }
    setSlots(updated)
  }

  const totalPriceEnergyUsed = slots.reduce((sum, slot) => {
    const start = parseInt(slot.energyStart || '0')
    const end = parseInt(slot.energyEnd || '0')
    // Extraire la rareté si format "rare#123"
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

  return (
    <div className="border-4 border-yellow-400 rounded-lg mb-10 w-[auto] p-4">
      <div className="flex flex-nowrap mb-3 max-w-full gap-2">
        <h2 className="text-xl font-bold">CALCULATOR</h2>
        <label className="mt-auto">
          <span className="text-s text-gray-400 font-semibold">Autocomplete rarity</span>
          <input
            type="checkbox"
            checked={autoComplete}
            onChange={() => setAutoComplete(!autoComplete)}
          />
        </label>
      </div>
      <div className="flex">
        <div className="grid grid-cols-5 gap-4">
          {slots.map((slot, i) => (
            <div key={i} className="flex flex-col gap-2">
              <h3 className="bg-yellow-400 text-black rounded-lg font-bold text-center">SLOT {i + 1}</h3>
              <span className="text-s text-gray-300 font-semibold">BADGE USED</span>
              <div className="items-center gap-2">
                {console.log({slot})}
                <RaritySelect
                  value={slot.rarity}
                  onChange={val => handleChange(i, 'rarity', val)}
                  disabled={false}
                  showIssueId={true}
                />
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex flex-col w-full md:w-1/2">
                  <span className="text-s text-gray-400 mb-1">ENERGY START</span>
                  <input
                    type="number"
                    placeholder="Start"
                    value={slot.energyStart}
                    onChange={e => handleChange(i, 'energyStart', e.target.value)}
                    className="bg-[#23272f] border border-gray-400 rounded-lg mt-auto px-1 py-2 text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
                  <div className="flex flex-col w-full md:w-1/2">
                  <span className="text-s text-gray-400 mb-1 max-w-[88%]">ENERGY END</span>
                  <input
                    type="number"
                    placeholder="End"
                    value={slot.energyEnd}
                    onChange={e => handleChange(i, 'energyEnd', e.target.value)}
                    className="bg-[#23272f] border border-gray-400 rounded-lg mt-auto px-1 py-2 text-white focus:outline-none focus:border-yellow-400"
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
          <p className="text-md font-semibold">
            <span className="text-red-500">{totalPriceEnergyUsed.toFixed(2)} $</span>
          </p>
        </div>
          <button
            onClick={() => {
              if (autoComplete) {
                handleNextMatch();
              } else {
                setSlots(Array(5).fill({ ...defaultSlot }));
              }
            }}
            className="bg-yellow-400 mt-auto text-black rounded-sm hover:bg-yellow-500 transition"
          >
            NEXT MATCH
          </button>
        </div>
      </div>
    </div>
  )
}
