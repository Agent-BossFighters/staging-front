import { createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyProvider } from "@privy-io/react-auth";
import { createContext, useContext, useState } from "react";
import { mainnet, sepolia, base, baseSepolia } from "viem/chains";
import { http } from "viem";

const queryClient = new QueryClient();

// Si baseSepolia n'est pas importable directement de viem/chains, on peut le définir manuellement
const baseSepoliaChain = baseSepolia || {
  id: 84532,
  name: "Base Sepolia",
  network: "base-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Base Sepolia Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.base.org"],
    },
    public: {
      http: ["https://sepolia.base.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Basescan",
      url: "https://sepolia.basescan.org",
    },
  },
  testnet: true,
};

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, base, baseSepoliaChain],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [baseSepoliaChain.id]: http(),
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
