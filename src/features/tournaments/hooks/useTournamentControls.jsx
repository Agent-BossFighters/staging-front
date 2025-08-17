/**
 * Hook pour la gestion des contrôles sur un tournoi
 * (démarrer, terminer, modifier, supprimer)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { kyInstance } from "@utils/api/ky-config";
import toast from "react-hot-toast";
import generateTournamentMatches from "../utils/generateMatchesTournament";
import { isTournamentInProgress } from "../utils/tournamentStatus";

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
  onTournamentDeleted,
  refetchTournamentsList,
  refetchMyTournaments,
  refetchRegisteredTournaments
) => {
  const navigate = useNavigate();
  const [startingTournament, setStartingTournament] = useState(false);
  const [deletingTournament, setDeletingTournament] = useState(false);
  const [cancelingTournament, setCancelingTournament] = useState(false);
  const [generatingMatches, setGeneratingMatches] = useState(false);

  // Fonction pour démarrer le tournoi
  const startTournament = async () => {
    if (!tournament || !isCreator) return;
    
    setStartingTournament(true);
    
    try {
      console.log("Starting tournament:", tournament.id);
      
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
      
      toast.success("Tournament started successfully!");
      
      console.log("Refetching tournament data...");
      // Rafraîchir les données
      await refetchTournament();
      await refetchTeams();
      await refetchMatches();
      
      // Rafraîchir aussi les listes de tournois
      console.log("Refetching tournament lists...");
      await refetchTournamentsList();
      await refetchMyTournaments();
      await refetchRegisteredTournaments();
      console.log("Refetch completed!");
      
    } catch (error) {
      console.error("Error starting tournament:", error);
      toast.error("Failed to start tournament. Please try again.");
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
      console.error("Error generating matches:", error);
      toast.error("Failed to generate matches. Please try again.");
    } finally {
      setGeneratingMatches(false);
    }
  };
  
  // Fonction pour terminer le tournoi
  const completeTournament = async () => {
    if (!isCreator || !isTournamentInProgress(tournament)) return;
    
    if (!window.confirm("Are you sure you want to complete this tournament? This will calculate the final results and display the final ranking.")) {
      return;
    }
    
    try {
      console.log("Completing tournament:", tournament.id);
      
      // Mettre à jour le statut du tournoi à "completed" (3)
      await kyInstance.put(`v1/tournaments/${tournament.id}`, {
        json: {
          tournament: {
            status: 3 // completed
          }
        }
      }).json();
      
      toast.success("Tournament completed successfully!");
      
      console.log("Refetching tournament data after completion...");
      // Rafraîchir les données
      await refetchTournament();
      await refetchTeams();
      await refetchMatches();
      
      // Rafraîchir aussi les listes de tournois
      console.log("Refetching tournament lists after completion...");
      await refetchTournamentsList();
      await refetchMyTournaments();
      await refetchRegisteredTournaments();
      console.log("Refetch after completion completed!");
      
    } catch (error) {
      console.error("Error completing tournament:", error);
      toast.error("Failed to complete tournament. Please try again.");
    }
  };
  
  // Fonction pour annuler le tournoi
  const cancelTournament = async () => {
    if (!tournament || !isCreator) return;
    
    if (!window.confirm("Are you sure you want to cancel this tournament? This action cannot be undone.")) {
      return;
    }
    
    setCancelingTournament(true);
    
    try {
      // Mettre à jour le statut du tournoi à "cancelled" (4)
      await kyInstance.put(`v1/tournaments/${tournament.id}`, {
        json: {
          tournament: {
            status: 4 // cancelled
          }
        }
      }).json();
      
      toast.success("Tournament cancelled successfully!");
      
      console.log("Refetching tournament data after cancellation...");
      // Rafraîchir les données
      await refetchTournament();
      await refetchTeams();
      await refetchMatches();
      
      // Rafraîchir aussi les listes de tournois
      console.log("Refetching tournament lists after cancellation...");
      await refetchTournamentsList();
      await refetchMyTournaments();
      await refetchRegisteredTournaments();
      console.log("Refetch after cancellation completed!");
      
    } catch (error) {
      console.error("Error cancelling tournament:", error);
      toast.error("Failed to cancel tournament. Please try again.");
    } finally {
      setCancelingTournament(false);
    }
  };
  
  // Fonction pour supprimer le tournoi
  const deleteTournament = async () => {
    if (!tournament || !isCreator) return;
    
    // Empêcher la suppression si le tournoi est démarré ou terminé
    if (tournament.status === 2 || tournament.status === 3) {
      toast.error("Cannot delete a tournament that has started. You can cancel it instead.");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this tournament? This action is irreversible.")) {
      return;
    }
    
    setDeletingTournament(true);
    
    try {
      // Envoyer une requête pour supprimer le tournoi
      await kyInstance.delete(`v1/tournaments/${tournament.id}`).json();
      
      toast.success("Tournament deleted successfully!");
      
      // Rafraîchir les listes de tournois
      console.log("Refetching tournament lists after deletion...");
      await refetchTournamentsList();
      await refetchMyTournaments();
      await refetchRegisteredTournaments();
      console.log("Refetch after deletion completed!");
      
      // Appeler le callback pour réinitialiser l'UI si fourni
      if (typeof onTournamentDeleted === 'function') {
        onTournamentDeleted();
      }
      
      // Rediriger vers la liste des tournois sans query parameter
      // après suppression pour éviter d'essayer de charger le tournoi supprimé
      navigate('/dashboard/fighting', { replace: true });
      
    } catch (error) {
      console.error("Error deleting tournament:", error);
      toast.error("Failed to delete tournament. Please try again.");
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
    cancelingTournament,
    generatingMatches,
    startTournament,
    completeTournament,
    deleteTournament,
    cancelTournament,
    editTournament,
    generateMatches
  };
};

export default useTournamentControls; 