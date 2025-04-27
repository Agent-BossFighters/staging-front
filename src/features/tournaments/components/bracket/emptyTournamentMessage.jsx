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
        No matches have been created for this tournament yet.
      </div>
      
      {isCreator && tournament?.status !== 'pending' && (
        <div className="flex justify-center">
          <Button
            onClick={onGenerateMatches}
            className="bg-primary hover:bg-primary/80 text-black"
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
