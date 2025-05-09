import {
  PlayerMapHome,
  RegistrationForm,
  GraphComponent,
  auth as playerMapAuth,
  PlayerMapConfig,
  // PlayerMapGraph,
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
  const { user, ready } = usePrivy();
  const [isOpen, setIsOpen] = useState(false);
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

  const handleClose = () => {
    console.log("Main app closing modal");
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
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
  };

  // Passer l'objet wallet complet et les clients nécessaires
  const registrationProps = {
    walletConnected: effectiveWalletClient,
    walletAddress: user?.wallet?.address,
    isOpen: Boolean(isOpen),
    onClose: handleClose,
    wagmiConfig: {
      publicClient,
      walletClient: effectiveWalletClient,
    },
  };

  if (!ready) {
    return <div>Loading wallet state...</div>;
  }

  return (
    <div className="w-5/6 mx-auto h-full">
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

      <PlayerMapHome {...registrationProps} />
      <GraphComponent {...registrationProps} />
      <RegistrationForm
        {...registrationProps}
        walletHooks={{
          useAccount,
          useConnect,
          useWalletClient,
          usePublicClient,
        }}
      />
      {/* <PlayerMapGraph {...registrationProps} /> */}
    </div>
  );
}
