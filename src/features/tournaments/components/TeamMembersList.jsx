import React from 'react';
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";

/**
 * Composant d'affichage des membres d'une équipe
 * Version simplifiée qui s'attend à recevoir des données normalisées
 */
export default function TeamMembersList({ 
  members = [],
  maxPlayers = 4,
  captainId, 
  isTeamCaptain,
  onKickPlayer
}) {
  // S'assurer que members est un tableau
  const teamMembers = Array.isArray(members) ? members : [];

  return (
    <div className="space-y-2">
      {/* Générer les slots (occupés ou vides) */}
      {Array.from({ length: maxPlayers }).map((_, index) => {
        const slotNumber = index + 1;
        
        // Chercher le membre dans ce slot
        const member = teamMembers.find(m => 
          // Pour le slot 1, on priorise le capitaine
          (slotNumber === 1) 
            ? (m.isCaptain || m.slotNumber === 1)
            : (m.slotNumber === slotNumber)
        );
        
        // Si un membre occupe ce slot
        if (member) {
          return (
            <div 
              key={`slot-${slotNumber}`} 
              className="flex items-center justify-between bg-gray-700 p-3 rounded"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-600 mr-3 flex items-center justify-center text-sm">
                  {member.username?.[0]?.toUpperCase() || slotNumber}
                </div>
                <div>
                  <div className="text-white">
                    {member.username || 'Joueur inconnu'}
                    {member.isCaptain && (
                      <Badge className="ml-2 bg-yellow-400 text-black text-xs">
                        Capitaine
                      </Badge>
                    )}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Niveau {member.level || 1}
                  </div>
                </div>
              </div>
              
              {isTeamCaptain && !member.isCaptain && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onKickPlayer(member.playerId)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Retirer
                </Button>
              )}
            </div>
          );
        }
        
        // Si le slot est vide
        return (
          <div 
            key={`empty-${slotNumber}`}
            className="flex items-center bg-gray-700/50 p-3 rounded border border-dashed border-gray-600"
          >
            <div className="w-10 h-10 rounded-full bg-gray-600/50 mr-3 flex items-center justify-center text-gray-500">
              {slotNumber}
            </div>
            <div className="text-gray-500">
              Empty slot
            </div>
          </div>
        );
      })}
    </div>
  );
} 