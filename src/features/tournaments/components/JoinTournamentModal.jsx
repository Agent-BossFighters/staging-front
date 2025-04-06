import { useState, useEffect } from "react";
import { kyInstance } from "@utils/api/ky-config";
import { useAuth } from "@context/auth.context";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import toast from "react-hot-toast";

export default function JoinTournamentModal({ tournament, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("create");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  
  // Form state
  const [teamName, setTeamName] = useState("");
  const [entryCode, setEntryCode] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  
  // Verify if user is the creator of the tournament
  const isCreator = user && tournament.creator_id === user.id;
  
  useEffect(() => {
    // If user is the creator, show error and close modal after a delay
    if (isCreator) {
      setError("As the tournament creator, you cannot participate as a player.");
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  }, [isCreator, onClose]);
  
  if (!isOpen) return null;
  
  // If user is the creator, show a message and prevent joining
  if (isCreator) {
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

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await kyInstance.post(`v1/tournaments/${tournament.id}/teams`, {
        json: {
          team: {
            name: teamName,
            entry_code: entryCode || null,
            generate_code: true
          }
        }
      }).json();
      
      toast.success("Team created successfully!");
      setSuccess(true);
      // After a delay, trigger a page refresh or update the UI
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Error creating team:", err);
      const errorMessage = err.responseData?.error || "Failed to create team. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Note: The API endpoint and parameters might need adjustment
      const response = await kyInstance.post(`v1/tournaments/${tournament.id}/join_team`, {
        json: {
          invitation_code: invitationCode
        }
      }).json();
      
      toast.success("Joined team successfully!");
      setSuccess(true);
      // After a delay, trigger a page refresh or update the UI
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Error joining team:", err);
      const errorMessage = err.responseData?.error || "Failed to join team. Please check the invitation code.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-800 border border-gray-700 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl text-yellow-400">Join Tournament</CardTitle>
          <CardDescription className="text-gray-400">
            {tournament.name}
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 bg-gray-700">
            <TabsTrigger value="create">Create Team</TabsTrigger>
            <TabsTrigger value="join">Join Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-4">
            {success ? (
              <CardContent className="text-center py-6">
                <div className="text-green-500 mb-2">Team created successfully!</div>
                <div className="text-gray-400">Redirecting to tournament page...</div>
              </CardContent>
            ) : (
              <form onSubmit={handleCreateTeam}>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="team-name" className="block text-sm text-gray-400 mb-1">
                      Team Name
                    </label>
                    <Input
                      id="team-name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white focus:border-yellow-400"
                      placeholder="Enter team name"
                      required
                    />
                  </div>
                  
                  {tournament.entry_code && (
                    <div>
                      <label htmlFor="entry-code" className="block text-sm text-gray-400 mb-1">
                        Tournament Entry Code
                      </label>
                      <Input
                        id="entry-code"
                        value={entryCode}
                        onChange={(e) => setEntryCode(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white focus:border-yellow-400"
                        placeholder="Enter tournament code"
                        required
                      />
                    </div>
                  )}
                  
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    className="border-gray-600 text-gray-300"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                    disabled={isLoading || !teamName || (tournament.entry_code && !entryCode)}
                  >
                    {isLoading ? "Creating..." : "Create Team"}
                  </Button>
                </CardFooter>
              </form>
            )}
          </TabsContent>
          
          <TabsContent value="join" className="mt-4">
            {success ? (
              <CardContent className="text-center py-6">
                <div className="text-green-500 mb-2">Joined team successfully!</div>
                <div className="text-gray-400">Redirecting to tournament page...</div>
              </CardContent>
            ) : (
              <form onSubmit={handleJoinTeam}>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="invitation-code" className="block text-sm text-gray-400 mb-1">
                      Team Invitation Code
                    </label>
                    <Input
                      id="invitation-code"
                      value={invitationCode}
                      onChange={(e) => setInvitationCode(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white focus:border-yellow-400"
                      placeholder="Enter invitation code"
                      required
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    className="border-gray-600 text-gray-300"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                    disabled={isLoading || !invitationCode}
                  >
                    {isLoading ? "Joining..." : "Join Team"}
                  </Button>
                </CardFooter>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
} 