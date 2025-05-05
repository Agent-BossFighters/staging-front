import { usePrivy } from "@privy-io/react-auth";
import { useWallet } from "@context/wallet.context";
import { Button } from "@shared/ui/button";
import { useEffect } from "react";

export default function WalletConnector() {
  const { login, ready, authenticated, user, logout, connectWallet } = usePrivy();
  const { setWalletConnected, setWalletAddress } = useWallet();

  useEffect(() => {
    if (authenticated && user) {
      // Si l'utilisateur a un wallet associé
      if (user.wallet) {
        setWalletConnected(true);
        setWalletAddress(user.wallet.address);
      }
    }
  }, [authenticated, user, setWalletConnected, setWalletAddress]);

  if (!ready) {
    return <div>Chargement...</div>;
  }

  const handleConnect = async () => {
    if (authenticated) {
      // Si l'utilisateur est déjà authentifié mais n'a pas de wallet
      connectWallet();
    } else {
      // Authentification et création de wallet
      login();
    }
  };

  const handleDisconnect = async () => {
    await logout();
    setWalletConnected(false);
    setWalletAddress(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 my-4">
      {!authenticated ? (
        <Button onClick={handleConnect} className="bg-primary">
          Connecter un wallet
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Wallet: {user?.wallet?.address.substring(0, 6)}...{user?.wallet?.address.substring(38)}
          </p>
          <Button onClick={handleDisconnect} variant="outline">
            Déconnecter
          </Button>
        </div>
      )}
    </div>
  );
}
