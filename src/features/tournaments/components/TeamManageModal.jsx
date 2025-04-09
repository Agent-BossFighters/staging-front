import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/card";
import { Input } from "@shared/ui/input";
import { Badge } from "@shared/ui/badge";
import { UserX, X, Edit2, Check, Copy } from "lucide-react";
import { kyInstance } from "@utils/api/ky-config";
import toast from "react-hot-toast";

const TeamManageModal = ({ isOpen, onClose, team, members, onMemberKicked }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [teamName, setTeamName] = useState(team?.name || "");
  
  if (!isOpen) return null;

  const handleKickPlayer = async (playerId) => {
    if (!confirm("Are you sure you want to exclude this player from the team?")) return;
    
    try {
      await kyInstance.delete(`v1/tournaments/${team.tournament_id}/teams/${team.id}/kick/${playerId}`).json();
      toast.success("Player excluded from the team.");
      onMemberKicked(playerId);
    } catch (err) {
      console.error("Error when excluding the player:", err);
      const errorMessage = err.responseData?.error || "Impossible to exclude the player. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleUpdateTeamName = async () => {
    if (!teamName.trim()) {
      toast.error("Team name cannot be empty");
      return;
    }

    try {
      await kyInstance.patch(`v1/tournaments/${team.tournament_id}/teams/${team.id}`, {
        json: { name: teamName }
      }).json();
      toast.success("Team name updated successfully");
      setIsEditingName(false);
    } catch (err) {
      console.error("Error updating team name:", err);
      const errorMessage = err.responseData?.error || "Failed to update team name. Please try again.";
      toast.error(errorMessage);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button
                  size="sm"
                  onClick={handleUpdateTeamName}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setTeamName(team.name);
                    setIsEditingName(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-xl text-primary font-semibold">
                  {team.name}
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingName(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Code d'invitation - Only show if team has an invitation code */}
          {team.invitation_code && (
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Invitation Code</h4>
              <div className="flex items-center gap-2 p-2 bg-gray-700 rounded">
                <span className="text-white font-mono">{team.invitation_code}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(team.invitation_code);
                    toast.success("Code copied!");
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Liste des membres */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Team members</h4>
            <Card className="bg-gray-700 border-gray-600">
              <div className="divide-y divide-gray-600">
                {members.map((member) => (
                  <div
                    key={member.playerId}
                    className="flex items-center justify-between p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white">{member.username}</span>
                      {member.playerId === team.captain_id && (
                        <Badge className="bg-primary text-black">Captain</Badge>
                      )}
                    </div>
                    {member.playerId !== team.captain_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleKickPlayer(member.playerId)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TeamManageModal; 