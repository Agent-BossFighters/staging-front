import {
  GraphComponent,
  auth as playerMapAuth,
  PlayerMapConfig,
} from "player-map";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { AuthUtils } from "@utils/api/auth.utils";

export default function PlayerMapView() {
  const { user, ready, login } = usePrivy();
  // États séparés pour chaque modal
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isPlayerCreationOpen, setIsPlayerCreationOpen] = useState(false);
  
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const account = useAccount();

  // Initialiser la configuration de Player-map
  useEffect(() => {
    // Initialiser la configuration avec l'URL de l'API
    PlayerMapConfig.init({
      apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
    });

    console.log(
      "Player-map configuration initialized with:",
      PlayerMapConfig.get()
    );
  }, []);

  // Initialiser l'authentification Player-map avec le token d'authentification
  useEffect(() => {
    const token = AuthUtils.getAuthToken();
    if (token) {
      console.log("Initializing Player-map authentication");
      playerMapAuth.initialize(token);
    } else {
      console.warn("No authentication token available for Player-map");
    }
  }, []);

  useEffect(() => {
    console.log("Privy State:", {
      user,
      ready,
      wallet: user?.wallet,
      walletClient,
      publicClient: !!publicClient,
      account,
    });
  }, [user, ready, walletClient, publicClient, account]);

  // Gestionnaires pour le formulaire d'enregistrement
  const handleOpenRegistration = () => {
    setIsRegistrationOpen(true);
  };

  const handleCloseRegistration = () => {
    console.log("Main app closing registration modal");
    setIsRegistrationOpen(false);
  };

  // Gestionnaires pour le formulaire de création de joueur
  const handleOpenPlayerCreation = () => {
    console.log("Opening player creation form");
    setIsPlayerCreationOpen(true);
  };

  const handleClosePlayerCreation = () => {
    console.log("Main app closing player creation modal");
    setIsPlayerCreationOpen(false);
  };

  // Si walletClient est null/undefined, utiliser un objet factice basé sur les infos Privy
  const effectiveWalletClient = walletClient || {
    account: {
      address: user?.wallet?.address,
    },
    writeContract: async (params) => {
      console.error("walletClient.writeContract not available, using fallback");
      // Ici, vous pourriez implémenter une méthode fallback qui utilise user?.wallet
      throw new Error("No wallet client available for transactions");
    },
    readContract: async (params) => {
      console.error("walletClient.readContract not available, using fallback");
      throw new Error("No wallet client available for reading contracts");
    },
    waitForTransactionReceipt: async (params) => {
      console.error(
        "walletClient.waitForTransactionReceipt not available, using fallback"
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return {};
    },
  };

  // Propriétés communes pour tous les composants
  const commonProps = {
    walletConnected: effectiveWalletClient,
    walletAddress: user?.wallet?.address,
    publicClient: publicClient,
    wagmiConfig: {
      publicClient,
      walletClient: effectiveWalletClient,
    },
    walletHooks: {
      useAccount,
      useConnect,
      useWalletClient,
      usePublicClient,
    },
  };

  // Gestion de la connexion wallet via Privy
  const handleConnectWallet = () => {
    console.log("Handling wallet connection in main app via Privy");
    login();
  };

  if (!ready) {
    return <div>Loading wallet state...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl font-extrabold pt-8 pb-2 text-primary">
          PLAYER MAP
        </h1>
        {!playerMapAuth.isAuthenticated() && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <p className="font-bold">Attention</p>
            <p>Vous n'êtes pas authentifié pour utiliser Player Map.</p>
          </div>
        )}
      </div>

      <div className="relative flex-1 w-full" style={{ height: "calc(100vh - 200px)" }}>
        <GraphComponent
            {...commonProps} 
            onCreatePlayer={handleOpenPlayerCreation}
            onConnectWallet={handleConnectWallet}
        />
      </div>
    </div>
  );
} 