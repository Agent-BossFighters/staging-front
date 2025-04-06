import React, { useState, useEffect } from 'react';
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Edit, Save, X, PlayCircle } from 'lucide-react';
import { useAuth } from "@context/auth.context";
import toast from "react-hot-toast";
import { kyInstance } from "@utils/api/ky-config";

const TournamentBracketArena = ({ tournament, teams, matches, onMatchUpdated }) => {
  const { user } = useAuth();
  const [editingMatch, setEditingMatch] = useState(null);
  const [scores, setScores] = useState({ team_a_points: 0, team_b_points: 0 });
  const [saving, setSaving] = useState(false);
  
  // Déterminer si l'utilisateur est le créateur du tournoi
  const isCreator = user && tournament && user.id === tournament.creator_id;
  
  // Déterminer le statut du tournoi
  const isTournamentCompleted = tournament?.status === "completed" || tournament?.status === 3;
  
  // Regrouper les matchs par round
  const groupedMatches = matches?.reduce((acc, match) => {
    const round = match.round_number || 1;
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {}) || {};
  
  // Calculer le nombre de rounds
  const numberOfRounds = Math.max(...Object.keys(groupedMatches).map(r => parseInt(r)), 0) || 3;
  
  // Rechercher l'équipe par ID
  const getTeamById = (teamId) => {
    return teams?.find(team => team.id === teamId) || { name: '?', id: null };
  };
  
  // Calculer le vainqueur du tournoi
  const findWinner = () => {
    if (!isTournamentCompleted || !matches || matches.length === 0) return null;
    
    // Trouver le dernier match (supposé être la finale)
    const finalMatches = groupedMatches[numberOfRounds] || [];
    if (finalMatches.length === 0) return null;
    
    const finalMatch = finalMatches[0];
    if (!finalMatch || !finalMatch.winner_id) return null;
    
    return getTeamById(finalMatch.winner_id);
  };
  
  // Obtenir le gagnant du match
  const getMatchWinner = (match) => {
    if (!match || match.status !== 'completed') return null;
    
    if (match.winner_id) {
      return match.winner_id;
    }
    
    // Si winner_id n'est pas défini, déterminer le gagnant par les points
    if (match.team_a_points > match.team_b_points) {
      return match.team_a_id;
    } else if (match.team_b_points > match.team_a_points) {
      return match.team_b_id;
    }
    
    return null; // Match nul ou pas encore de résultat
  };
  
  // Déterminer la classe de couleur en fonction du résultat
  const getResultClass = (match, teamId) => {
    if (!match || match.status !== 'completed') return '';
    
    const winnerId = getMatchWinner(match);
    
    if (!winnerId) return 'bg-yellow-600 bg-opacity-50'; // Match nul
    if (winnerId === teamId) return 'bg-green-600';
    
    return 'bg-red-800 opacity-50';
  };
  
  // Fonctions pour l'édition des scores
  const handleEditScores = (match) => {
    setEditingMatch(match);
    setScores({
      team_a_points: match.team_a_points || 0,
      team_b_points: match.team_b_points || 0
    });
  };

  const handleScoreChange = (team, value) => {
    const numValue = parseInt(value) || 0;
    setScores(prev => ({
      ...prev,
      [team]: numValue
    }));
  };

  // Pour générer manuellement les matchs
  const generateMatchesManually = async () => {
    if (!isCreator || !teams || teams.length < 2) return;
    
    setSaving(true);
    
    try {
      const teamIds = teams.map(team => team.id);
      
      // Mélanger les équipes pour les appariements aléatoires
      const shuffledTeams = [...teamIds].sort(() => Math.random() - 0.5);
      
      // S'il y a un nombre impair d'équipes, ajouter un "bye"
      if (shuffledTeams.length % 2 !== 0) {
        shuffledTeams.push(null);
      }
      
      // Créer le premier round de matchs
      const matchPromises = [];
      
      for (let i = 0; i < shuffledTeams.length; i += 2) {
        // Si l'un des adversaires est null (bye), ne pas créer de match
        if (shuffledTeams[i] !== null && shuffledTeams[i+1] !== null) {
          const matchPromise = kyInstance.post(`v1/tournaments/${tournament.id}/tournament_matches`, {
            json: {
              match: {
                team_a_id: shuffledTeams[i],
                team_b_id: shuffledTeams[i+1],
                round_number: 1,
                status: 'pending'
              }
            }
          });
          
          matchPromises.push(matchPromise);
        }
      }
      
      // Attendre que tous les matchs soient créés
      await Promise.all(matchPromises);
      
      toast.success(`${matchPromises.length} matchs ont été générés pour le premier tour!`);
      
      // Rafraîchir les données
      if (onMatchUpdated) {
        onMatchUpdated();
      }
    } catch (error) {
      console.error("Erreur lors de la génération des matchs:", error);
      toast.error("Échec de la génération des matchs. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };
  
  // Vérifier si tous les matchs d'un round sont terminés et générer le round suivant
  const checkRoundCompletionAndAdvance = async () => {
    if (!isCreator) return;
    
    // Trouver le round le plus récent
    const rounds = Object.keys(groupedMatches).map(r => parseInt(r)).sort((a, b) => a - b);
    if (rounds.length === 0) return;
    
    const currentRound = rounds[rounds.length - 1];
    const roundMatches = groupedMatches[currentRound] || [];
    
    // Vérifier si tous les matchs du round sont terminés
    const allMatchesCompleted = roundMatches.every(match => match.status === 'completed');
    
    // S'il y a au moins 2 matchs et qu'ils sont tous terminés, générer le prochain round
    if (allMatchesCompleted && roundMatches.length >= 2) {
      try {
        setSaving(true);
        
        const winners = roundMatches
          .filter(match => match.winner_id) // Filtrer uniquement les matchs avec un gagnant
          .map(match => match.winner_id);   // Récupérer les IDs des gagnants
        
        // S'il y a un nombre impair de gagnants, ajouter un "bye"
        if (winners.length % 2 !== 0) {
          winners.push(null);
        }
        
        // Créer les matchs du prochain round
        const matchPromises = [];
        const nextRound = currentRound + 1;
        
        for (let i = 0; i < winners.length; i += 2) {
          // Si l'un des adversaires est null (bye), ne pas créer de match
          if (winners[i] !== null && winners[i+1] !== null) {
            const matchPromise = kyInstance.post(`v1/tournaments/${tournament.id}/tournament_matches`, {
              json: {
                match: {
                  team_a_id: winners[i],
                  team_b_id: winners[i+1],
                  round_number: nextRound,
                  status: 'pending'
                }
              }
            });
            
            matchPromises.push(matchPromise);
          }
        }
        
        if (matchPromises.length > 0) {
          // Attendre que tous les matchs soient créés
          await Promise.all(matchPromises);
          
          toast.success(`Les matchs du round ${nextRound} ont été générés!`);
          
          // Rafraîchir les données
          if (onMatchUpdated) {
            onMatchUpdated();
          }
        }
      } catch (error) {
        console.error("Erreur lors de la génération des matchs du prochain round:", error);
        toast.error("Échec de la génération des matchs du prochain round.");
      } finally {
        setSaving(false);
      }
    }
  };
  
  // Mise à jour des scores d'un match
  const handleSaveScores = async () => {
    if (!editingMatch) return;
    
    setSaving(true);
    try {
      // Déterminer le vainqueur basé sur les scores
      let winner_id = null;
      if (scores.team_a_points > scores.team_b_points) {
        winner_id = editingMatch.team_a_id;
      } else if (scores.team_b_points > scores.team_a_points) {
        winner_id = editingMatch.team_b_id;
      }
      
      const updatedMatch = {
        ...scores,
        winner_id,
        status: 'completed'
      };
      
      await kyInstance.put(`v1/tournaments/${tournament.id}/tournament_matches/${editingMatch.id}`, {
        json: {
          match: updatedMatch
        }
      }).json();
      
      toast.success('Résultats du match enregistrés avec succès!');
      setEditingMatch(null);
      
      // Mettre à jour les données
      if (onMatchUpdated) {
        onMatchUpdated();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des scores:', error);
      toast.error('Erreur lors de l\'enregistrement des scores. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };
  
  // Vérifier la progression après chaque sauvegarde de score
  useEffect(() => {
    if (matches && matches.length > 0) {
      checkRoundCompletionAndAdvance();
    }
  }, [matches]);

  const handleCancelEdit = () => {
    setEditingMatch(null);
  };

  const startMatch = async (match) => {
    try {
      await kyInstance.put(`v1/tournaments/${tournament.id}/matches/${match.id}`, {
        json: {
          match: { status: 'in_progress' }
        }
      }).json();
      
      toast.success('Match démarré!');
      
      // Mettre à jour les données
      if (onMatchUpdated) {
        onMatchUpdated();
      }
    } catch (error) {
      console.error('Erreur lors du démarrage du match:', error);
      toast.error('Erreur lors du démarrage du match. Veuillez réessayer.');
    }
  };

  // Trouver le classement final
  const winner = findWinner();
  
  // Rendu du composant
  return (
    <div className="bracket-container">
      <h2 className="text-xl font-bold text-yellow-400 mb-6">Tournoi Arena - Élimination directe</h2>
      
      {/* Arbre du tournoi */}
      <div className="bracket-tree">
        {Array.from({ length: numberOfRounds }).map((_, roundIndex) => {
          const round = roundIndex + 1;
          const roundMatches = groupedMatches[round] || [];
          
          return (
            <div key={round} className="mb-8">
              <div className="bg-yellow-400 text-black font-bold p-3 rounded-t-md">
                {round === 1 ? "PREMIER TOUR" : 
                 round === 2 ? "QUARTS DE FINALE" : 
                 round === 3 ? "DEMI-FINALES" : 
                 round === 4 ? "FINALE" : `ROUND ${round}`}
              </div>
              <div className="bg-gray-900 p-4 rounded-b-md grid gap-4 grid-cols-1">
                {roundMatches.map((match, index) => (
                  <div 
                    key={match.id} 
                    className={`match-container p-4 rounded-md relative ${match.status === 'completed' ? 'bg-opacity-20' : 'bg-gray-800'}`}
                  >
                    {/* Status badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className={
                        match.status === 'completed' ? 'bg-green-600' : 
                        match.status === 'in_progress' ? 'bg-blue-600' : 'bg-gray-600'
                      }>
                        {match.status?.toUpperCase() || 'PENDING'}
                      </Badge>
                    </div>
                    
                    {/* Match info */}
                    <div className="mb-1 text-gray-400">Match #{index + 1}</div>
                    
                    {/* Team A */}
                    <div className={`flex items-center justify-between p-3 mb-2 rounded ${getResultClass(match, match.team_a_id)}`}>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-2 text-xs font-bold">A</div>
                        <span className="text-white">{getTeamById(match.team_a_id).name}</span>
                      </div>
                      
                      {editingMatch && editingMatch.id === match.id ? (
                        <input 
                          type="number"
                          min="0"
                          className="w-12 text-center bg-gray-700 text-white border border-gray-600 rounded p-1"
                          value={scores.team_a_points}
                          onChange={(e) => handleScoreChange('team_a_points', e.target.value)}
                        />
                      ) : (
                        <div className="font-bold text-lg text-white">{match.team_a_points || '0'}</div>
                      )}
                    </div>
                    
                    {/* Team B */}
                    <div className={`flex items-center justify-between p-3 rounded ${getResultClass(match, match.team_b_id)}`}>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2 text-xs font-bold">B</div>
                        <span className="text-white">{getTeamById(match.team_b_id).name}</span>
                      </div>
                      
                      {editingMatch && editingMatch.id === match.id ? (
                        <input 
                          type="number"
                          min="0"
                          className="w-12 text-center bg-gray-700 text-white border border-gray-600 rounded p-1"
                          value={scores.team_b_points}
                          onChange={(e) => handleScoreChange('team_b_points', e.target.value)}
                        />
                      ) : (
                        <div className="font-bold text-lg text-white">{match.team_b_points || '0'}</div>
                      )}
                    </div>
                    
                    {/* Admin controls */}
                    {isCreator && (
                      <div className="mt-4 flex justify-end gap-2">
                        {editingMatch && editingMatch.id === match.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={handleSaveScores}
                              disabled={saving}
                            >
                              <Save size={16} className="mr-1" />
                              Enregistrer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={saving}
                            >
                              <X size={16} className="mr-1" />
                              Annuler
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditScores(match)}
                            >
                              <Edit size={16} className="mr-1" />
                              Éditer
                            </Button>
                            
                            {match.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => startMatch(match)}
                              >
                                Démarrer
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {roundMatches.length === 0 && (
                  <div className="text-center py-6 text-gray-400">
                    Matchs à déterminer
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Affichage du vainqueur du tournoi */}
      {isTournamentCompleted && winner && (
        <div className="mt-8 bg-yellow-600 bg-opacity-20 p-6 rounded-md text-center">
          <h3 className="text-xl text-yellow-400 font-bold mb-2">VAINQUEUR DU TOURNOI</h3>
          <div className="text-2xl text-white font-bold">{winner.name}</div>
        </div>
      )}
      
      {/* Message si aucun match n'a encore été créé */}
      {Object.keys(groupedMatches).length === 0 && (
        <div className="text-center py-10 bg-gray-900 rounded-md mt-8">
          <div className="text-gray-400 mb-6">
            Aucun match n'a encore été créé pour ce tournoi.
          </div>
          
          {isCreator && tournament?.status !== 'pending' && (
            <div className="flex justify-center">
              <Button
                onClick={generateMatchesManually}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                disabled={saving}
              >
                <PlayCircle size={16} className="mr-2" />
                {saving ? "Génération en cours..." : "Générer les matchs"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TournamentBracketArena; 