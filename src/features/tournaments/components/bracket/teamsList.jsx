import React from 'react';
import { getTeamColor } from '../../constants/uiConfigs';

const TeamsList = ({ teams }) => {
  return (
    <div className="flex flex-col">
      <div className="bg-primary text-black font-bold p-3 rounded-t-md text-center">
        TEAMS
      </div>
      <div className="flex-1 bg-blue-900 bg-opacity-50 p-4 rounded-b-md">
        {teams?.length > 0 ? (
          teams.map((team, index) => (
            <div key={team.id} className="flex items-center mb-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold ${getTeamColor(index)}`}>
                {index + 1}
              </div>
              <span className="text-white truncate">{team.name}</span>
            </div>
          ))
        ) : (
          <div className="text-gray-400">Aucune équipe n'a encore rejoint ce tournoi.</div>
        )}
      </div>
    </div>
  );
};

export default TeamsList;
