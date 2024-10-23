import React, { ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
// import { clusterApiUrl } from "@solana/web3.js";
// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {

  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

// const network = WalletAdapterNetwork.Mainnet; // Use MainnetBeta or Testnet as needed
// const endpoint = clusterApiUrl(network);
const endpoint = "https://mainnet.helius-rpc.com/?api-key=924873ed-8690-46fa-83cd-b48df97c6bfa";

interface WalletProviderProps {
  children: ReactNode;
}

const WalletProviderComponent: React.FC<WalletProviderProps> = ({
  children,
}) => {
  const wallets = [new SolflareWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProviderComponent;
