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
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function TournamentListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { tournamentId } = useParams();
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    search: "",
    registration: "all",
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [filteredMyTournaments, setFilteredMyTournaments] = useState([]);
  const [filteredRegisteredTournaments, setFilteredRegisteredTournaments] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { tournaments, isLoading, error, refetch } = useTournamentsList(filters);
  
  // Utiliser le hook useMyTournaments pour récupérer les tournois de l'utilisateur
  const { myTournaments, isLoading: loadingMyTournaments, error: myTournamentsError, refetch: refetchMyTournaments } = useMyTournaments(user?.id);
  
  // Utiliser le hook useRegisteredTournaments pour récupérer les tournois auxquels l'utilisateur est inscrit
  const { registeredTournaments, isLoading: loadingRegisteredTournaments, error: registeredTournamentsError, refetch: refetchRegisteredTournaments } = useRegisteredTournaments();

  // États pour la gestion du tournoi sélectionné
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [showTournamentDetails, setShowTournamentDetails] = useState(false);
  
  // États pour la gestion des onglets
  const [activeTab, setActiveTab] = useState("all");

  // Vérifier si un tournoi est spécifié dans l'URL et s'il existe
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tournamentIdFromUrl = searchParams.get('tournament');
    
    if (tournamentIdFromUrl) {
      // Si un ID de tournoi est dans l'URL, vérifier d'abord s'il existe dans les listes chargées
      const allTournaments = [
        ...(tournaments || []),
        ...(myTournaments || []),
        ...(registeredTournaments || [])
      ];
      
      const tournamentExists = allTournaments.some(t => t.id.toString() === tournamentIdFromUrl.toString());
      
      if (tournamentExists) {
        setSelectedTournamentId(tournamentIdFromUrl);
        setShowTournamentDetails(true);
        
        // Déterminer l'onglet actif en fonction du tournoi
        if (myTournaments && myTournaments.some(t => t.id.toString() === tournamentIdFromUrl.toString())) {
          setActiveTab('my');
        } else if (registeredTournaments && registeredTournaments.some(t => t.id.toString() === tournamentIdFromUrl.toString())) {
          setActiveTab('registered');
        } else {
          setActiveTab('all');
        }
      } else {
        // Si le tournoi n'existe pas dans les listes chargées mais que nous avons déjà fait la requête
        if (!isLoading && !loadingMyTournaments && !loadingRegisteredTournaments) {
          // Réinitialiser l'URL et afficher un message d'erreur
          navigate('/dashboard/fighting', { replace: true });
          setSelectedTournamentId(null);
          setShowTournamentDetails(false);
          toast.error(`Le tournoi avec l'ID ${tournamentIdFromUrl} n'a pas été trouvé ou a été supprimé.`);
        }
      }
    }
  }, [location.search, tournaments, myTournaments, registeredTournaments, isLoading, loadingMyTournaments, loadingRegisteredTournaments, navigate]);

  // Fonction pour filtrer les tournois en fonction de la recherche
  const filterTournamentsByQuery = (tournamentsArray) => {
    if (!tournamentsArray || !Array.isArray(tournamentsArray)) return [];
    
    if (searchQuery.trim() === "") {
      return tournamentsArray;
    } else {
      const query = searchQuery.toLowerCase();
      return tournamentsArray.filter(tournament => 
        tournament.name.toLowerCase().includes(query) ||
        (tournament.rules && tournament.rules.toLowerCase().includes(query))
      );
    }
  };

  useEffect(() => {
    setFilteredTournaments(filterTournamentsByQuery(tournaments));
    setFilteredMyTournaments(filterTournamentsByQuery(myTournaments));
    setFilteredRegisteredTournaments(filterTournamentsByQuery(registeredTournaments));
    
  }, [tournaments, myTournaments, registeredTournaments, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTournamentCreated = () => {
    refetch(); // Actualiser la liste des tournois après création
    refetchMyTournaments(); // Actualiser mes tournois avec la fonction fournie par le hook
    refetchRegisteredTournaments(); // Actualiser les tournois auxquels je suis inscrit
    setIsCreateModalOpen(false);
  };
  
  // Fonction pour afficher les détails d'un tournoi
  const handleOpenTournament = (tournament) => {
    console.log("Opening tournament:", tournament.name, tournament.id);
    setSelectedTournamentId(tournament.id);
    setShowTournamentDetails(true);
    
    // Mettre à jour l'URL sans recharger la page
    navigate(`/dashboard/fighting?tournament=${tournament.id}`, { replace: true });
  };
  
  // Fonction pour revenir à la liste des tournois
  const handleBackToList = () => {
    setShowTournamentDetails(false);
    setSelectedTournamentId(null);
    
    // Réinitialiser l'URL sans recharger la page
    navigate('/dashboard/fighting', { replace: true });
  };

  // Composant pour afficher le contenu d'un tournoi
  const TournamentContent = ({ tournamentId }) => {
    const { tournament, isLoading, error } = useTournament(tournamentId);
    const { teams } = useTournamentTeams(tournamentId);
    const { matches, refetch: refetchMatches } = useTournamentMatches(tournamentId);
    
    // Callback pour gérer la suppression du tournoi
    const handleTournamentDeleted = () => {
      setShowTournamentDetails(false);
      setSelectedTournamentId(null);
    };
    
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
          <div className="mt-4">
            <Button 
              variant="default" 
              className="flex items-center gap-2"
              onClick={handleBackToList}
            >
              <ArrowLeft size={16} />
              Back to List
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-full h-full mt-4">
        <div className="mb-4 flex justify-end">
          <Button 
            variant="default" 
            className="flex items-center gap-2"
            onClick={handleBackToList}
          >
            <ArrowLeft size={16} />
            Back to List
          </Button>
        </div>
        <TournamentBracketShowtime 
          tournament={tournament} 
          teams={teams || []} 
          matches={matches || []}
          onMatchUpdated={refetchMatches}
          onTournamentDeleted={handleTournamentDeleted}
        />
      </div>
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
            </div>
            <div className="border-primary border-b-2 w-full gap-4"></div>
          </TabsList>
        </div>
        
        {/* Section TOURNAMENT LIST - masquée lorsqu'un tournoi est affiché */}
        {!showTournamentDetails && (
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
          {showTournamentDetails && activeTab === "all" ? (
            <TournamentContent tournamentId={selectedTournamentId} />
          ) : isLoading ? (
            <div className="flex justify-center py-10">
              <div className="loader">Loading...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">Error loading tournaments: {error.message}</div>
          ) : (
            <TournamentTable 
              tournaments={filteredTournaments} 
              onTournamentClick={handleOpenTournament}
              tableType="all"
            />
          )}
        </TabsContent>
        
        <TabsContent value="registered" className="mt-4">
          {showTournamentDetails && activeTab === "registered" ? (
            <TournamentContent tournamentId={selectedTournamentId} />
          ) : loadingRegisteredTournaments ? (
            <div className="flex justify-center py-10">
              <div className="loader">Loading...</div>
            </div>
          ) : registeredTournamentsError ? (
            <div className="text-red-500 p-4 text-center">{registeredTournamentsError}</div>
          ) : filteredRegisteredTournaments.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              {searchQuery.trim() !== "" ? 
                "No registered tournaments found matching your search." : 
                "You have not registered for any tournaments yet."}
            </div>
          ) : (
            <TournamentTable 
              tournaments={filteredRegisteredTournaments} 
              onTournamentClick={handleOpenTournament}
              tableType="registered"
            />
          )}
        </TabsContent>
        
        <TabsContent value="my" className="mt-4">
          {showTournamentDetails && activeTab === "my" ? (
            <TournamentContent tournamentId={selectedTournamentId} />
          ) : loadingMyTournaments ? (
            <div className="flex justify-center py-10">
              <div className="loader">Loading...</div>
            </div>
          ) : myTournamentsError ? (
            <div className="text-red-500 p-4 text-center">{myTournamentsError}</div>
          ) : filteredMyTournaments.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              {searchQuery.trim() !== "" ? 
                "No tournaments created by you match your search." : 
                "You have not created any tournaments yet."}
            </div>
          ) : (
            <TournamentTable 
              tournaments={filteredMyTournaments} 
              onTournamentClick={handleOpenTournament}
              tableType="my"
            />
          )}
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