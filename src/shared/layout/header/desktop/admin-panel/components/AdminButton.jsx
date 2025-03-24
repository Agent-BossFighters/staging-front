import React from "react";
import { Button } from "@shared/ui/button";

const AdminButton = ({ 
  isMenuOpen, 
  onMenuToggle, 
  onSectionSelect 
}) => {
  return (
    <>
      <Button onClick={onMenuToggle}>
        ADMIN
      </Button>
      
      {isMenuOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-gray-800 p-2 rounded-md border border-gray-700 w-40 shadow-lg">
          <button 
            onClick={() => onSectionSelect('currencies')}
            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
          >
            Currencies
          </button>
          <button 
            onClick={() => onSectionSelect('badges')}
            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
          >
            Badges
          </button>
          <button 
            onClick={() => onSectionSelect('contracts')}
            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-md transition-colors"
          >
            Contracts
          </button>
        </div>
      )}
    </>
  );
};

export default AdminButton; 