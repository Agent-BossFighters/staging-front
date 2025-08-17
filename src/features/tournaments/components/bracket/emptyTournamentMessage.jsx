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
    <div className="flex flex-wrap items-center justify-center w-full pr-0 xl:pr-4 py-10">
      <div className="flex flex-row w-full text-gray-400 mb-6 items-center justify-center text-center">
        No matches have been created for this tournament yet.
      </div>
      
      {isCreator && tournament?.status !== 'pending' && (
        <div className="flex flex-row justify-center">
          <Button
            onClick={onGenerateMatches}
            className="bg-primary hover:bg-primary/80 text-black transition-transform duration-200 hover:scale-105"
            disabled={generatingMatches}
          >
            <PlayCircle size={16} className="mr-2" />
            {generatingMatches ? "Generating matches..." : "GENERATE MATCHES"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyTournamentMessage;
