import { Button } from "@shared/ui/button";

/**
 * Affiche un message de succès après avoir rejoint un tournoi
 * @param {Object} props - Propriétés du composant
 * @param {Function} props.onClose - Fonction pour fermer la modale
 * @returns {JSX.Element} - Élément JSX
 */
export function SuccessView({ onClose }) {
  return (
    <div className="text-center p-8">
      <h3 className="text-green-400 text-xl mb-4">Registration Successful!</h3>
      <p className="text-gray-300 mb-6">You have successfully joined the tournament.</p>
      <Button 
        onClick={onClose}
        className="bg-primary hover:bg-primary/90 text-black"
      >
        Close
      </Button>
    </div>
  );
} 