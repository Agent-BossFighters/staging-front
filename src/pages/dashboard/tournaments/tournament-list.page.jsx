import { useState, useEffect } from "react";
import { useTournamentsList } from "@features/tournaments/hooks/useTournaments";
import TournamentTable from "@features/tournaments/components/TournamentTable";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import TournamentCreateModal from "@features/tournaments/components/TournamentCreateModal";
import { bracketIcon } from "@img";
import { useAuth } from "@context/auth.context";
import { kyInstance } from "@utils/api/ky-config";

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
  
  // États pour les tournois filtrés
  const [myTournaments, setMyTournaments] = useState([]);
  // Commenté : État pour les tournois auxquels l'utilisateur est inscrit
  // const [registeredTournaments, setRegisteredTournaments] = useState([]);
  const [loadingMyTournaments, setLoadingMyTournaments] = useState(false);
  // Commenté : État de chargement pour les tournois auxquels l'utilisateur est inscrit
  // const [loadingRegisteredTournaments, setLoadingRegisteredTournaments] = useState(false);
  const [myTournamentsError, setMyTournamentsError] = useState(null);
  // Commenté : État d'erreur pour les tournois auxquels l'utilisateur est inscrit
  // const [registeredTournamentsError, setRegisteredTournamentsError] = useState(null);

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
        tournament.rules?.toLowerCase().includes(query)
      );
      setFilteredTournaments(filtered);
    }
  }, [tournaments, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Ne pas mettre à jour les filtres API ici pour éviter des appels inutiles
    // La recherche se fait maintenant côté client
  };

  const handleTournamentCreated = () => {
    refetch(); // Actualiser la liste des tournois après création
    fetchMyTournaments(); // Actualiser mes tournois
    // Commenté : Actualiser les tournois auxquels je suis inscrit
    // fetchRegisteredTournaments();
    setIsCreateModalOpen(false);
  };
  
  // Récupérer les tournois dont l'utilisateur est créateur
  const fetchMyTournaments = async () => {
    if (!user) return;
    
    setLoadingMyTournaments(true);
    
    try {
      // Récupérer tous les tournois puis filtrer côté client
      const response = await kyInstance.get('v1/tournaments').json();
      
      let tournamentList = [];
      if (response.tournaments && Array.isArray(response.tournaments)) {
        tournamentList = response.tournaments;
      }
      
      // Filtrer uniquement les tournois créés par l'utilisateur actuel
      const createdTournaments = tournamentList.filter(
        tournament => tournament.creator_id === user.id
      );
      
      setMyTournaments(createdTournaments);
      setMyTournamentsError(null);
    } catch (err) {
      console.error("Error fetching my tournaments:", err);
      setMyTournaments([]);
      setMyTournamentsError("Failed to load your tournaments: " + (err.message || "Unknown error"));
    } finally {
      setLoadingMyTournaments(false);
    }
  };
  
  /* Commenté : Fonction pour récupérer les tournois auxquels l'utilisateur est inscrit
  const fetchRegisteredTournaments = async () => {
    if (!user) return;
    
    setLoadingRegisteredTournaments(true);
    
    try {
      // Utiliser l'endpoint correct pour les tournois auxquels l'utilisateur est inscrit
      const response = await kyInstance.get(`v1/users/${user.id}/registered_tournaments`).json();
      
      let tournamentList = [];
      if (response.tournaments && Array.isArray(response.tournaments)) {
        tournamentList = response.tournaments;
      } else if (Array.isArray(response)) {
        tournamentList = response;
      }
      
      setRegisteredTournaments(tournamentList);
      setRegisteredTournamentsError(null);
    } catch (err) {
      console.error("Error fetching registered tournaments:", err);
      setRegisteredTournaments([]);
      setRegisteredTournamentsError("Failed to load tournaments you're registered in: " + (err.message || "Unknown error"));
    } finally {
      setLoadingRegisteredTournaments(false);
    }
  };
  */
  
  // Charger les tournois au chargement de la page
  useEffect(() => {
    if (user) {
      fetchMyTournaments();
      // Commenté : Charger les tournois auxquels l'utilisateur est inscrit
      // fetchRegisteredTournaments();
    }
  }, [user]);

  return (
    <div className="w-5/6 mx-auto h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl font-extrabold pt-8 pb-2 text-primary">FIGHTING</h1>
      </div>

      <Tabs defaultValue="all" className="w-full flex flex-col">
        <div className="w-fit">
          <TabsList className="bg-transparent text-2xl pb-0 justify-start gap-1 flex flex-col">
            <div className="flex gap-1">
              <TabsTrigger value="all">TOURNAMENT(S)</TabsTrigger>
              {/* Onglet désactivé: Tournois auxquels l'utilisateur est inscrit */}
              <TabsTrigger value="registered" disabled>REGISTERED TOURNAMENT(S)</TabsTrigger>
              <TabsTrigger value="my">MY TOURNAMENT(S)</TabsTrigger>
            </div>
            <div className="border-primary border-b-2 w-full gap-4"></div>
          </TabsList>
        </div>
        
        <div className="mt-6">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <img src={bracketIcon} alt="bracket" className="w-6 h-6 mr-2" />
                TOURNAMENT LIST
              </h2>
            </div>
            
            <div className="flex justify-start gap-4 items-center">
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
                variant="accent" 
                className="bg-primary hover:bg-primary/90 text-black"
                onClick={() => setIsCreateModalOpen(true)}
              >
                CREATE A TOURNAMENT
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="loader">Loading...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">Error loading tournaments: {error.message}</div>
          ) : (
            <TournamentTable tournaments={filteredTournaments} />
          )}
        </TabsContent>
        
        {/* Commenté : Contenu de l'onglet des tournois auxquels l'utilisateur est inscrit
        <TabsContent value="registered" className="mt-4">
          {loadingRegisteredTournaments ? (
            <div className="flex justify-center py-10">
              <div className="loader">Loading...</div>
            </div>
          ) : registeredTournamentsError ? (
            <div className="text-red-500 p-4 text-center">{registeredTournamentsError}</div>
          ) : registeredTournaments.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              You are not registered to any tournaments yet.
            </div>
          ) : (
            <TournamentTable tournaments={registeredTournaments} />
          )}
        </TabsContent>
        */}
        
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
            <TournamentTable tournaments={myTournaments} />
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