import React from 'react';
import { Settings } from 'lucide-react';
import { getTournamentTimeStatus } from "../../utils/tournamentStatus";

/**
 * Affiche les détails d'un tournoi (infos générales, dates, etc.)
 */
const TournamentDetails = ({ tournament, isCreator }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-yellow-400 mb-4">Details</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Created by:</span>
          <span className="text-white">{tournament.creator?.username || "Unknown"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Teams:</span>
          <span className="text-white">{tournament.teams_count || '0'} / {tournament.max_teams}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Players per team:</span>
          <span className="text-white">{tournament.players_per_team}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Min players:</span>
          <span className="text-white">{tournament.min_players_per_team}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Agent level:</span>
          <span className="text-white">{tournament.agent_level_required}</span>
        </div>
        {tournament.boss && (
          <div className="flex justify-between">
            <span className="text-gray-400">Boss:</span>
            <span className="text-white">{tournament.boss.name}</span>
          </div>
        )}
        {tournament.scheduled_start_time && (
          <div className="flex justify-between">
            <span className="text-gray-400">Starts at:</span>
            <span className="text-white">{new Date(tournament.scheduled_start_time).toLocaleString()}</span>
          </div>
        )}
        {tournament.scheduled_end_time && (
          <div className="flex justify-between">
            <span className="text-gray-400">Ends at:</span>
            <span className="text-white">{new Date(tournament.scheduled_end_time).toLocaleString()}</span>
          </div>
        )}

        <div className="border-t border-gray-700 pt-3 mt-3">
          <span className="text-gray-400">Status:</span>
          <div className="text-white mt-1">
            {getTournamentTimeStatus(tournament)}
          </div>
        </div>

        {/* Zone d'administration - informations supplémentaires pour les admins */}
        {isCreator && (
          <div className="border-t border-gray-700 pt-3 mt-3">
            <div className="flex items-center text-yellow-400 mb-2">
              <Settings size={16} className="mr-1" />
              <span className="font-medium">Admin Controls</span>
            </div>

            <div className="text-sm text-gray-300 space-y-2">
              <div>ID: {tournament.id}</div>
              {tournament.entry_code && (
                <div>Entry Code: <code className="bg-gray-700 px-1 rounded">{tournament.entry_code}</code></div>
              )}
              <div>Created: {new Date(tournament.created_at).toLocaleString()}</div>
              {tournament.updated_at && (
                <div>Last Updated: {new Date(tournament.updated_at).toLocaleString()}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentDetails; 