import { useState, useEffect } from "react";
import { useTournamentsList, useTournament, useTournamentTeams, useTournamentMatches, useMyTournaments, useRegisteredTournaments } from "@features/tournaments/hooks/useTournaments";
import TournamentTable from "@features/tournaments/components/TournamentTable";
import TournamentBracketShowtime from "@features/tournaments/components/TournamentBracketShowtime";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import TournamentCreateModal from "@features/tournaments/components/TournamentCreateModal";
import { bracketIcon } from "@img";
import { useAuth } from "@context/auth.context";

export default function TournamentListPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    search: "",
    registration: "all",
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { tournaments, isLoading, error, refetch } = useTournamentsList(filters);
  
  // Utiliser le hook useMyTournaments pour récupérer les tournois de l'utilisateur
  const { myTournaments, isLoading: loadingMyTournaments, error: myTournamentsError, refetch: refetchMyTournaments } = useMyTournaments(user?.id);
  
  // Utiliser le hook useRegisteredTournaments pour récupérer les tournois auxquels l'utilisateur est inscrit
  const { registeredTournaments, isLoading: loadingRegisteredTournaments, error: registeredTournamentsError, refetch: refetchRegisteredTournaments } = useRegisteredTournaments();

  // États pour la gestion des onglets
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  // Déterminer si l'onglet actif est un tournoi spécifique
  const isTournamentTabActive = !["all", "my", "registered"].includes(activeTab);

  // Mettre à jour les tournois filtrés lorsque les tournois ou la recherche changent
  useEffect(() => {
    if (!tournaments) return;
    
    // Filtrer les tournois en fonction de la recherche
    if (searchQuery.trim() === "") {
      setFilteredTournaments(tournaments);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = tournaments.filter(tournament => 
        tournament.name.toLowerCase().includes(query) ||
        (tournament.rules && tournament.rules.toLowerCase().includes(query))
      );
      setFilteredTournaments(filtered);
    }
  }, [tournaments, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTournamentCreated = () => {
    refetch(); // Actualiser la liste des tournois après création
    refetchMyTournaments(); // Actualiser mes tournois avec la fonction fournie par le hook
    refetchRegisteredTournaments(); // Actualiser les tournois auxquels je suis inscrit
    setIsCreateModalOpen(false);
  };
  
  // Fonction pour ouvrir un tournoi dans un onglet
  const handleOpenTournament = (tournament) => {
    console.log("Opening tournament:", tournament.name, tournament.id);
    
    // Vérifier si l'onglet est déjà ouvert
    if (openTabs.some(tab => tab.id.toString() === tournament.id.toString())) {
      setActiveTab(tournament.id.toString());
      return;
    }
    
    // Ajouter un nouvel onglet
    setOpenTabs(prev => [...prev, {
      id: tournament.id.toString(),
      name: tournament.name
    }]);
    
    // Activer le nouvel onglet
    setActiveTab(tournament.id.toString());
  };

  // Fonction pour fermer un onglet
  const handleCloseTab = (tabId, e) => {
    e.stopPropagation(); // Empêcher l'activation de l'onglet lors de la fermeture
    
    // Supprimer l'onglet
    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId));
    
    // Si l'onglet actif est fermé, revenir à l'onglet "all"
    if (activeTab === tabId) {
      setActiveTab("all");
    }
  };

  // Composant pour afficher le contenu d'un onglet de tournoi
  const TournamentTabContent = ({ tournamentId }) => {
    const { tournament, isLoading, error } = useTournament(tournamentId);
    const { teams } = useTournamentTeams(tournamentId);
    const { matches, refetch: refetchMatches } = useTournamentMatches(tournamentId);
    
    if (isLoading) {
      return (
        <div className="flex justify-center py-10">
          <div className="loader">Loading tournament details...</div>
        </div>
      );
    }
    
    if (error || !tournament) {
      return (
        <div className="text-red-500 p-4 text-center">
          Error loading tournament: {error?.message || "Tournament not found"}
        </div>
      );
    }
    
    return (
      <TournamentBracketShowtime 
        tournament={tournament} 
        teams={teams || []} 
        matches={matches || []}
        onMatchUpdated={refetchMatches}
      />
    );
  };

  return (
    <div className="w-5/6 mx-auto h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl font-extrabold pt-8 pb-2 text-primary">FIGHTING</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col">
        <div className="w-fit">
          <TabsList className="bg-transparent text-2xl pb-0 justify-start gap-1 flex flex-col">
            <div className="flex gap-1">
              <TabsTrigger value="all">TOURNAMENT(S)</TabsTrigger>
              <TabsTrigger value="registered">REGISTERED TOURNAMENT(S)</TabsTrigger>
              <TabsTrigger value="my">MY TOURNAMENT(S)</TabsTrigger>
              
              {/* Onglets dynamiques pour les tournois */}
              {openTabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="relative pr-8">
                  {tab.name}
                  <button 
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={(e) => handleCloseTab(tab.id, e)}
                  >
                    ×
                  </button>
                </TabsTrigger>
              ))}
            </div>
            <div className="border-primary border-b-2 w-full gap-4"></div>
          </TabsList>
        </div>
        
        {/* Section TOURNAMENT LIST - masquée lorsqu'un onglet de tournoi est actif */}
        {!isTournamentTabActive && (
          <div className="mt-6">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <img src={bracketIcon} alt="bracket" className="w-6 h-6 mr-2" />
                  TOURNAMENT LIST
                </h2>
              </div>
              
              <div className="flex justify-start gap-4 items-center mb-4">
                <div className="max-w-xs w-full md:w-72">
                  <Input
                    type="text"
                    placeholder="Search Tournament"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <Button 
                  variant="default" 
                  className="bg-primary hover:bg-primary/90 text-black"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  CREATE
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Contenu des onglets de catégorie */}
        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="loader">Loading...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">Error loading tournaments: {error.message}</div>
          ) : (
            <TournamentTable 
              tournaments={filteredTournaments} 
              onTournamentClick={handleOpenTournament}
            />
          )}
        </TabsContent>
        
        <TabsContent value="registered" className="mt-4">
          {loadingRegisteredTournaments ? (
            <div className="flex justify-center py-10">
              <div className="loader">Loading...</div>
            </div>
          ) : registeredTournamentsError ? (
            <div className="text-red-500 p-4 text-center">{registeredTournamentsError}</div>
          ) : registeredTournaments.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              You have not registered for any tournaments yet.
            </div>
          ) : (
            <TournamentTable 
              tournaments={registeredTournaments} 
              onTournamentClick={handleOpenTournament}
            />
          )}
        </TabsContent>
        
        <TabsContent value="my" className="mt-4">
          {loadingMyTournaments ? (
            <div className="flex justify-center py-10">
              <div className="loader">Loading...</div>
            </div>
          ) : myTournamentsError ? (
            <div className="text-red-500 p-4 text-center">{myTournamentsError}</div>
          ) : myTournaments.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              You have not created any tournaments yet.
            </div>
          ) : (
            <TournamentTable 
              tournaments={myTournaments} 
              onTournamentClick={handleOpenTournament}
            />
          )}
        </TabsContent>

        {/* Onglets dynamiques pour les tournois */}
        {openTabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="mt-4">
            <TournamentTabContent tournamentId={tab.id} />
          </TabsContent>
        ))}
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