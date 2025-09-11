import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyProvider } from "@privy-io/react-auth";
import { createContext, useContext, useState } from "react";
import { mainnet, sepolia, base } from "viem/chains";
import { http } from "viem";

const queryClient = new QueryClient();

// Configuration pour Intuition Testnet
const intuitionTestnetChain = {
  id: 13579,
  name: "Intuition Testnet",
  network: "intuition-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "tTRUST",
    symbol: "tTRUST",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.rpc.intuition.systems"],
    },
    public: {
      http: ["https://testnet.rpc.intuition.systems"],
    },
  },
  blockExplorers: {
    default: {
      name: "Intuition Testnet Explorer",
      url: "https://intuition-testnet.explorer.caldera.xyz",
    },
  },
  testnet: true,
};

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, base, intuitionTestnetChain],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [intuitionTestnetChain.id]: http(),
  },
});

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        walletAddress,
        setWalletConnected,
        setWalletAddress,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const PrivyWalletProvider = ({ children }) => {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: false,
          showWalletUIs: true,
        },
        loginMethods: ["wallet", "email", "google", "twitter"],
        appearance: {
          theme: "dark",
          showWalletLoginFirst: true,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <WalletProvider>{children}</WalletProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
