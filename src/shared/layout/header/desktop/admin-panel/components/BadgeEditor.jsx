import React from "react";

const BadgeEditor = ({ 
  badges, 
  itemValues, 
  handleItemValueChange, 
  handleSaveBadges, 
  isUpdating, 
  onClose 
}) => {
  return (
    <div className="top-full left-0 mt-2 z-50 bg-gray-800 p-4 rounded-md border border-gray-700 w-64 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-primary text-sm font-medium uper">Update Badges Floor Price</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {badges.map(badge => (
          <div key={badge.id} className="mb-3">
            <label className="block text-gray-300 text-xs mb-1">
              {badge.rarity.name} Floor Price ($)
            </label>
            <input
              type="number"
              step="0.0001"
              value={itemValues[badge.id] || ''}
              onChange={(e) => handleItemValueChange(badge.id, e.target.value)}
              className="w-full px-2 py-1 text-sm bg-gray-700 text-white border border-gray-600 rounded"
            />
          </div>
        ))}
      </div>
      
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => handleSaveBadges(onClose)}
          disabled={isUpdating}
          className="px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50"
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={onClose}
          disabled={isUpdating}
          className="px-3 py-1 text-xs font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BadgeEditor; 