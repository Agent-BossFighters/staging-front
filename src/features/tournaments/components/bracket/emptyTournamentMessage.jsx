import React from 'react';
import { Button } from "@shared/ui/button";
import { PlayCircle } from 'lucide-react';

const EmptyTournamentMessage = ({ 
  isCreator, 
  tournament, 
  generatingMatches, 
  onGenerateMatches 
}) => {
  return (
    <div className="mt-8 bg-gray-900 rounded-md text-center py-10">
      <div className="text-gray-400 mb-6">
        Aucun match n'a encore été créé pour ce tournoi.
      </div>
      
      {isCreator && tournament?.status !== 'pending' && (
        <div className="flex justify-center">
          <Button
            onClick={onGenerateMatches}
            className="bg-primary hover:bg-primary/80 text-black"
            disabled={generatingMatches}
          >
            <PlayCircle size={16} className="mr-2" />
            {generatingMatches ? "Génération en cours..." : "GÉNÉRER TOUS LES MATCHS POUR TOUS LES ROUNDS"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyTournamentMessage;
