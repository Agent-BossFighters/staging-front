/**
 * Hook pour la gestion des contrôles sur un tournoi
 * (démarrer, terminer, modifier, supprimer)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { kyInstance } from "@utils/api/ky-config";
import toast from "react-hot-toast";
import generateTournamentMatches from "../utils/generateMatchesTournament";

/**
 * Hook pour gérer les contrôles d'un tournoi
 * @param {Object} tournament - Tournoi à gérer
 * @param {Array} teams - Équipes du tournoi
 * @param {Array} matches - Matchs du tournoi
 * @param {Function} refetchTournament - Fonction pour rafraîchir les données du tournoi
 * @param {Function} refetchTeams - Fonction pour rafraîchir les données des équipes
 * @param {Function} refetchMatches - Fonction pour rafraîchir les données des matchs
 * @param {boolean} isCreator - Si l'utilisateur est le créateur du tournoi
 * @param {Function} onTournamentDeleted - Callback pour gérer la suppression côté UI
 * @returns {Object} Fonctions et états pour gérer le tournoi
 */
const useTournamentControls = (
  tournament,
  teams,
  matches,
  refetchTournament,
  refetchTeams,
  refetchMatches,
  isCreator,
  onTournamentDeleted
) => {
  const navigate = useNavigate();
  const [startingTournament, setStartingTournament] = useState(false);
  const [deletingTournament, setDeletingTournament] = useState(false);
  const [generatingMatches, setGeneratingMatches] = useState(false);

  // Fonction pour démarrer le tournoi
  const startTournament = async () => {
    if (!tournament || !isCreator) return;
    
    setStartingTournament(true);
    
    try {
      // Envoyer une requête pour mettre à jour le statut du tournoi
      await kyInstance.put(`v1/tournaments/${tournament.id}`, {
        json: {
          tournament: {
            status: 2 // in_progress
          }
        }
      }).json();
      
      // Générer les matchs automatiquement selon le type de tournoi
      await generateMatches();
      
      toast.success("Le tournoi a démarré avec succès !");
      
      // Rafraîchir les données
      await refetchTournament();
      await refetchTeams();
      await refetchMatches();
      
    } catch (error) {
      console.error("Erreur lors du démarrage du tournoi:", error);
      toast.error("Échec du démarrage du tournoi. Veuillez réessayer.");
    } finally {
      setStartingTournament(false);
    }
  };
  
  // Fonction pour générer automatiquement les matchs
  const generateMatches = async () => {
    setGeneratingMatches(true);
    try {
      // Cette partie a été refactorisée dans generateTournamentMatches
      await generateTournamentMatches(
        tournament,
        teams,
        matches,
        () => {
          refetchMatches();
        },
        isCreator,
        setGeneratingMatches
      );
    } catch (error) {
      console.error("Erreur lors de la génération des matchs:", error);
      toast.error("Échec de la génération des matchs. Veuillez réessayer.");
    } finally {
      setGeneratingMatches(false);
    }
  };
  
  // Fonction pour terminer le tournoi
  const completeTournament = async () => {
    if (!isCreator || tournament.status !== 2) return;
    
    if (!window.confirm("Êtes-vous sûr de vouloir terminer ce tournoi ? Cela calculera les résultats finaux et affichera le classement définitif.")) {
      return;
    }
    
    try {
      // Mettre à jour le statut du tournoi à "completed" (3)
      await kyInstance.put(`v1/tournaments/${tournament.id}`, {
        json: {
          tournament: {
            status: 3 // completed
          }
        }
      }).json();
      
      toast.success("Le tournoi a été terminé avec succès !");
      
      // Rafraîchir les données
      await refetchTournament();
      await refetchTeams();
      await refetchMatches();
      
    } catch (error) {
      console.error("Erreur lors de la terminaison du tournoi:", error);
      toast.error("Échec de la terminaison du tournoi. Veuillez réessayer.");
    }
  };
  
  // Fonction pour supprimer le tournoi
  const deleteTournament = async () => {
    if (!tournament || !isCreator) return;
    
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce tournoi ? Cette action est irréversible.")) {
      return;
    }
    
    setDeletingTournament(true);
    
    try {
      // Envoyer une requête pour supprimer le tournoi
      await kyInstance.delete(`v1/tournaments/${tournament.id}`).json();
      
      toast.success("Le tournoi a été supprimé avec succès !");
      
      // Appeler le callback pour réinitialiser l'UI si fourni
      if (typeof onTournamentDeleted === 'function') {
        onTournamentDeleted();
      }
      
      // Rediriger vers la liste des tournois sans query parameter
      // après suppression pour éviter d'essayer de charger le tournoi supprimé
      navigate('/dashboard/fighting', { replace: true });
      
    } catch (error) {
      console.error("Erreur lors de la suppression du tournoi:", error);
      toast.error("Échec de la suppression du tournoi. Veuillez réessayer.");
    } finally {
      setDeletingTournament(false);
    }
  };
  
  // Fonction pour rediriger vers la page de modification du tournoi
  const editTournament = () => {
    if (!tournament || !isCreator) return;
    // Redirection vers le formulaire d'édition avec le path standard
    navigate(`/dashboard/fighting/${tournament.id}/edit`);
  };

  return {
    startingTournament,
    deletingTournament,
    generatingMatches,
    startTournament,
    completeTournament,
    deleteTournament,
    editTournament,
    generateMatches
  };
};

export default useTournamentControls; 