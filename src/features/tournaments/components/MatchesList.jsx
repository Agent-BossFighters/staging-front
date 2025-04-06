import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { useAuth } from '@context/auth.context';
import toast from 'react-hot-toast';
import { Edit, Save, X } from 'lucide-react';
import { kyInstance } from "@utils/api/ky-config";

const MatchesList = ({ tournament, teams, matches, onMatchUpdated }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editingMatch, setEditingMatch] = useState(null);
  const [scores, setScores] = useState({ team_a_points: 0, team_b_points: 0 });
  const [saving, setSaving] = useState(false);

  // Vérifier si l'utilisateur est le créateur du tournoi
  const isCreator = user && tournament && user.id === tournament.creator_id;

  // Regrouper les matchs par round
  const groupedMatches = matches?.reduce((acc, match) => {
    const round = match.round_number || 1;
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {}) || {};

  // Obtenir le nom de l'équipe à partir de l'ID
  const getTeamName = (teamId) => {
    const team = teams?.find(team => team.id === teamId);
    return team ? team.name : 'TBD';
  };

  // Obtenir le nom du boss à partir de l'ID
  const getBossName = (bossId) => {
    if (!bossId) return null;
    
    // Si le tournoi contient directement le boss, on l'utilise
    if (tournament.boss && tournament.boss.id === bossId) {
      return tournament.boss.name;
    }
    
    // Sinon, on renvoie un nom générique
    return 'Boss';
  };

  // Vérifier si l'utilisateur fait partie d'une équipe dans ce match
  const isUserInMatch = (match) => {
    if (!user || !teams) return false;
    
    const teamA = teams.find(team => team.id === match.team_a_id);
    const teamB = teams.find(team => team.id === match.team_b_id);
    
    // Vérifier si l'utilisateur est dans l'équipe A ou B
    const userInTeamA = teamA?.team_members?.some(member => 
      member.player?.id === user.id || member.user?.id === user.id
    );
    
    const userInTeamB = teamB?.team_members?.some(member => 
      member.player?.id === user.id || member.user?.id === user.id
    );
    
    return userInTeamA || userInTeamB;
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return 'Non programmé';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return 'Date invalide';
    }
  };

  const handleViewMatch = (matchId) => {
    navigate(`/dashboard/tournaments/${tournament.id}/matches/${matchId}`);
  };

  const handleEditScores = (match) => {
    setEditingMatch(match);
    setScores({
      team_a_points: match.team_a_points || 0,
      team_b_points: match.team_b_points || 0
    });
  };

  const handleScoreChange = (team, value) => {
    // S'assurer que la valeur est un nombre valide
    const numValue = parseInt(value) || 0;
    setScores(prev => ({
      ...prev,
      [team]: numValue
    }));
  };

  const handleSaveScores = async () => {
    if (!editingMatch) return;
    
    setSaving(true);
    try {
      const updatedMatch = {
        ...scores,
        status: 'completed' // Mettre le match en "completed" une fois les scores saisis
      };
      
      await kyInstance.put(`v1/tournaments/${tournament.id}/tournament_matches/${editingMatch.id}`, {
        json: {
          match: updatedMatch
        }
      }).json();
      
      toast.success('Scores enregistrés avec succès!');
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

  const handleCancelEdit = () => {
    setEditingMatch(null);
  };

  const startMatch = async (match) => {
    try {
      await kyInstance.put(`v1/tournaments/${tournament.id}/tournament_matches/${match.id}`, {
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

  // Obtenir le status label en fonction de la valeur
  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'En attente',
      'in_progress': 'En cours',
      'completed': 'Terminé',
      'cancelled': 'Annulé'
    };
    return labels[status] || status?.toUpperCase() || 'INCONNU';
  };

  return (
    <div className="matches-list">
      <h2 className="text-xl font-bold text-yellow-400 mb-6">Liste des Matchs</h2>
      
      {Object.keys(groupedMatches).length > 0 ? (
        Object.keys(groupedMatches)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(roundNumber => (
            <div key={roundNumber} className="mb-8">
              <div className="bg-yellow-400 text-black font-bold p-3 rounded-t-md">
                ROUND {roundNumber}
              </div>
              <div className="bg-gray-900 rounded-b-md">
                <table className="w-full">
                  <thead className="text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="p-3 text-left">ÉQUIPES</th>
                      <th className="p-3 text-center">STATUT</th>
                      <th className="p-3 text-center">DATE</th>
                      <th className="p-3 text-center">SCORE</th>
                      <th className="p-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedMatches[roundNumber]?.map((match, index) => (
                      <tr key={match.id} className={`border-b border-gray-800 ${index % 2 === 0 ? 'bg-gray-800' : ''}`}>
                        <td className="p-3">
                          <div className="flex flex-col">
                            <span className="text-white">{getTeamName(match.team_a_id)}</span>
                            <span className="text-white mt-1">vs</span>
                            <span className="text-white mt-1">
                              {match.boss_id ? (
                                <span className="text-red-400 font-bold">{getBossName(match.boss_id)}</span>
                              ) : (
                                getTeamName(match.team_b_id)
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <Badge className={
                            match.status === 'completed' ? 'bg-green-600' : 
                            match.status === 'in_progress' ? 'bg-blue-600' : 'bg-gray-600'
                          }>
                            {getStatusLabel(match.status)}
                          </Badge>
                        </td>
                        <td className="p-3 text-center text-gray-300">
                          {formatDate(match.scheduled_time)}
                        </td>
                        <td className="p-3 text-center">
                          {editingMatch && editingMatch.id === match.id ? (
                            <div className="flex justify-center items-center gap-2">
                              <input 
                                type="number"
                                min="0"
                                className="w-12 text-center bg-gray-700 text-white border border-gray-600 rounded p-1"
                                value={scores.team_a_points}
                                onChange={(e) => handleScoreChange('team_a_points', e.target.value)}
                              />
                              <span className="text-white">-</span>
                              <input 
                                type="number"
                                min="0"
                                className="w-12 text-center bg-gray-700 text-white border border-gray-600 rounded p-1"
                                value={scores.team_b_points}
                                onChange={(e) => handleScoreChange('team_b_points', e.target.value)}
                              />
                            </div>
                          ) : (
                            match.status === 'completed' ? (
                              <div className="font-bold text-lg">
                                {match.team_a_points} - {match.team_b_points}
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {editingMatch && editingMatch.id === match.id ? (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="default"
                                className="bg-green-500 hover:bg-green-600 px-2"
                                onClick={handleSaveScores}
                                disabled={saving}
                              >
                                <Save size={16} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="px-2"
                                onClick={handleCancelEdit}
                                disabled={saving}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              {isCreator && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="px-2"
                                  onClick={() => handleEditScores(match)}
                                >
                                  <Edit size={16} />
                                </Button>
                              )}
                              
                              {isCreator && match.status === 'pending' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                  onClick={() => startMatch(match)}
                                >
                                  DÉMARRER
                                </Button>
                              )}
                              
                              <Button 
                                size="sm" 
                                variant={isUserInMatch(match) ? "default" : "outline"}
                                className={isUserInMatch(match) ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                                onClick={() => handleViewMatch(match.id)}
                              >
                                {isUserInMatch(match) && match.status === 'in_progress' 
                                  ? "JOUER"
                                  : "DÉTAILS"}
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
      ) : (
        <div className="text-center py-10 bg-gray-900 rounded-md text-gray-400">
          Aucun match n'a encore été créé pour ce tournoi.
        </div>
      )}
    </div>
  );
};

export default MatchesList; 