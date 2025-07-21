import React, { useState } from 'react'
import { useRarityManagement } from "../hooks/useRarityManagement";

const defaultSlot = {
  badgeId: '',
  rarity: '',
  energyStart: '',
  energyEnd: ''
}

export default function Calculator() {
  const { badges: userBadges, rarities } = useRarityManagement();

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

  const handleBadgeSelect = (index, badgeId) => {
    const badge = userBadges.find(b => b.id === badgeId)
    if (!badge) return

    const updated = [...slots]
    updated[index] = {
      ...updated[index],
      badgeId: badge.id,
      rarity: badge.rarity
    }
    setSlots(updated)
  }

  const totalEnergyUsed = slots.reduce((sum, slot) => {
    const start = parseInt(slot.energyStart || '0')
    const end = parseInt(slot.energyEnd || '0')
    if (!slot.rarity || isNaN(start) || isNaN(end)) return sum
    const rarityKey = slot.rarity?.toLowerCase()
    const price = rarityPrices[slot.rarity?.toLowerCase()] || 0
    console.log(`Slot ${slot.badgeId} | rarity: ${slot.rarity} | key: ${rarityKey} | price: ${price}`)
    return sum + (start - end) * price
  }, 0)

  const totalRawEnergyUsed = slots.reduce((sum, slot) => {
  const start = parseInt(slot.energyStart || '0')
  const end = parseInt(slot.energyEnd || '0')
  if (isNaN(start) || isNaN(end)) return sum
  return sum + (start - end)
}, 0)

  const handleNextMatch = () => {
    if (autoComplete) {
      setSlots(prev =>
        prev.map((slot) => ({
          ...slot,
          energyStart: slot.energyEnd || '',
          energyEnd: ''
        }))
      )
    } else {
      setSlots(Array(5).fill({ ...defaultSlot }))
    }
  }

  return (
    <div className="border-4 border-yellow-400 rounded-lg mb-10 w-[auto] p-4">
      <div className="flex flex-nowrap mb-6 max-w-full">
        <h2 className="text-xl font-bold mb-4">CALCULATOR</h2>
        <label className="gap-2">
          <span className="text-sm text-gray-700">Autocomplete rarity</span>
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
              <h3 className="bg-yellow-400 text-black rounded-lg font-medium text-center">SLOT {i + 1}</h3>

              <select
                className="border rounded px-2 py-1 text-black text-sm"
                onChange={e => handleChange(i, 'rarity', e.target.value)}
                value={slot.rarity}
              >
                <option value="">SELECT</option>
                {rarities.map(r => (
                  <option key={r.rarity} value={r.rarity}>
                    {r.rarity}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Energy Start"
                value={slot.energyStart}
                onChange={e => handleChange(i, 'energyStart', e.target.value)}
                className="border text-black rounded px-2 py-1 text-sm"
              />

              <input
                type="number"
                placeholder="Energy End"
                value={slot.energyEnd}
                onChange={e => handleChange(i, 'energyEnd', e.target.value)}
                className="border text-black rounded px-2 py-1 text-sm"
              />
            </div>
          ))}
        </div>
        <div className="ml-5">
          <div>
            ⚡
            <p className="text-md font-semibold">ENERGY USED</p>
            <p><span className="text-indigo-600">{totalRawEnergyUsed}</span></p>
            <p className="text-md font-semibold"><span className="text-green-600">{totalEnergyUsed.toFixed(2)} $</span></p>
          </div>
          <button
            onClick={handleNextMatch}
            className="bg-yellow-400 text-black px-6 py-2 rounded-xl hover:bg-purple-700 transition"
          >
            NEXT MATCH
          </button>
        </div>
      </div>
    </div>
  )
}
