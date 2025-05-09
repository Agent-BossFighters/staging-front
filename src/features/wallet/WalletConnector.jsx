import { usePrivy } from "@privy-io/react-auth";
import { useWallet } from "@context/wallet.context";
import { useEffect } from "react";

export default function WalletConnector() {
  const { login, ready, authenticated, user, logout, connectWallet } = usePrivy();
  const { setWalletConnected, setWalletAddress } = useWallet();

  useEffect(() => {

    if (ready) {
      if (authenticated) {
        // L'utilisateur est authentifié
        if (user?.wallet) {
          setWalletConnected(true);
          setWalletAddress(user.wallet.address);
        } else {
          // L'utilisateur est authentifié mais n'a pas de wallet connecté
          setWalletConnected(false);
          setWalletAddress(null);
        }
      } else {
        // L'utilisateur n'est pas authentifié
        setWalletConnected(false);
        setWalletAddress(null);
      }
    }
  }, [authenticated, user, ready, setWalletConnected, setWalletAddress]);

  if (!ready) {
    return <div>Loading...</div>;
  }

  const handleConnect = async () => {
    try {
      if (authenticated) {
        await connectWallet();
      } else {
        await login();
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
      setWalletConnected(false);
      setWalletAddress(null);
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return (
    <>
      {!authenticated ? (
        <a
          onClick={handleConnect}
          className="py-2 px-2 hover:text-primary w-full block whitespace-nowrap cursor-pointer"
        >
          Connect wallet
        </a>
      ) : (
        <>
          {user?.wallet?.address && (
            <div className="text-sm text-muted-foreground py-2 px-2">
              {user.wallet.address.substring(0, 6)}...
              {user.wallet.address.substring(38)}
            </div>
          )}
          <a
            onClick={handleDisconnect}
            className="py-2 px-2 hover:text-primary w-full block whitespace-nowrap cursor-pointer"
          >
            Disconnect
          </a>
        </>
      )}
    </>
  );
}
