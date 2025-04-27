import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";

/**
 * Affiche un message pour le créateur du tournoi
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.tournament - Le tournoi
 * @param {Function} props.onClose - Fonction pour fermer la modale
 * @returns {JSX.Element} - Élément JSX
 */
export function CreatorView({ tournament, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-800 border border-gray-700 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl text-yellow-400">Cannot Join Tournament</CardTitle>
          <CardDescription className="text-gray-400">
            {tournament.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <div className="text-amber-400 mb-4">You are the creator of this tournament</div>
          <div className="text-gray-300 mb-4">
            As the tournament creator, you cannot participate as a player.
          </div>
          <Button 
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 