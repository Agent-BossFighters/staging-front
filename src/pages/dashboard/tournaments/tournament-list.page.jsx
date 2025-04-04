import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTournamentsList } from "@features/tournaments/hooks/useTournaments";
import TournamentCard from "@features/tournaments/components/TournamentCard";
import TournamentFilters from "@features/tournaments/components/TournamentFilters";
import { Button } from "@shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import TournamentCreateModal from "@features/tournaments/components/TournamentCreateModal";

export default function TournamentListPage() {
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    search: "",
    registration: "all",
  });
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { tournaments, isLoading, error, refetch } = useTournamentsList(filters);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleTournamentCreated = () => {
    refetch(); // Actualiser la liste des tournois après création
    setIsCreateModalOpen(false);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-yellow-400">Tournaments</h1>
        <Button 
          variant="accent" 
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Tournament
        </Button>
      </div>

      <TournamentFilters filters={filters} onFilterChange={handleFilterChange} />

      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="bg-gray-800 border-b border-gray-700">
          <TabsTrigger value="all">All Tournaments</TabsTrigger>
          <TabsTrigger value="my">My Tournaments</TabsTrigger>
          <TabsTrigger value="registered">Registered</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="loader">Loading...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">Error loading tournaments: {error.message}</div>
          ) : tournaments.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No tournaments found. Try adjusting your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="my" className="mt-4">
          <div className="text-center py-10 text-gray-400">
            Your created tournaments will appear here.
          </div>
        </TabsContent>
        <TabsContent value="registered" className="mt-4">
          <div className="text-center py-10 text-gray-400">
            Tournaments you've registered for will appear here.
          </div>
        </TabsContent>
      </Tabs>

      {isCreateModalOpen && (
        <TournamentCreateModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={handleTournamentCreated} 
        />
      )}
    </div>
  );
} 