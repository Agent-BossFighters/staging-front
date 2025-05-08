import {
  PlayerMapHome,
  RegistrationForm,
  GraphComponent,
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

export default function PlayerMapView() {
  const { user, ready } = usePrivy();
  const [isOpen, setIsOpen] = useState(false);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const account = useAccount();

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
