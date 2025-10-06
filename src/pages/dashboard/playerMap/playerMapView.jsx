import {
  GraphComponent,
  PlayerMapConfig,
  setPinataConstants,
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
import { CUSTOM_PLAYER_MAP_CONSTANTS } from "../../../constants/playerMapConstants";
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
  }, []);

  // Initialiser les constantes Pinata pour Player-map
  useEffect(() => {
    // Définir les constantes Pinata globalement
    setPinataConstants(CUSTOM_PLAYER_MAP_CONSTANTS);
    console.log("Player-map Pinata constants initialized");
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
    setIsRegistrationOpen(false);
  };

  // Gestionnaires pour le formulaire de création de joueur
  const handleOpenPlayerCreation = () => {
    setIsPlayerCreationOpen(true);
  };

  const handleClosePlayerCreation = () => {
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
    <div className="w-[80vw] mx-auto flex flex-col h-full">
      <h1 className="text-5xl font-extrabold pt-8 pb-2 text-primary mb-4">
        PLAYER MAP
      </h1>

      <div className="relative flex-1 w-full">
        <GraphComponent
          {...commonProps}
          onCreatePlayer={handleOpenPlayerCreation}
          onConnectWallet={handleConnectWallet}
          config={{
            constants: CUSTOM_PLAYER_MAP_CONSTANTS
          }}
        />
      </div>

    </div>
  );
}
