import { usePrivy } from "@privy-io/react-auth";
import { useWallet } from "@context/wallet.context";
import { useEffect } from "react";

export default function WalletConnector() {
  const { login, ready, authenticated, user, logout, connectWallet } = usePrivy();
  const { setWalletConnected, setWalletAddress } = useWallet();

  useEffect(() => {
    if (authenticated && user) {
      if (user.wallet) {
        setWalletConnected(true);
        setWalletAddress(user.wallet.address);
      }
    }
  }, [authenticated, user, setWalletConnected, setWalletAddress]);

  if (!ready) {
    return <div>Loading...</div>;
  }

  const handleConnect = async () => {
    if (authenticated) {
      connectWallet();
    } else {
      login();
    }
  };

  const handleDisconnect = async () => {
    await logout();
    setWalletConnected(false);
    setWalletAddress(null);
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
              {user.wallet.address.substring(0, 6)}...{user.wallet.address.substring(38)}
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
