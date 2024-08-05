"use client";
import { useEffect, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
// Chains
import {
  bsc,
  mainnet,
  arbitrum,
  base
} from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // The chains you want to support on the wallet and application. This are accessible via the useChains hook through out the app.
    chains: [
      base,
      mainnet,
      bsc,
      arbitrum
    ],
    transports: {
      // RPC URL for each chain (mainnet and testnet).
      [base.id]: http(base.rpcUrls.default.http[0]),
      [mainnet.id]: http(mainnet.rpcUrls.default.http[0]),
      [bsc.id]: http(bsc.rpcUrls.default.http[0]),
      [arbitrum.id]: http(arbitrum.rpcUrls.default.http[0]),
    },
    // Required API Keys
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
    // App info
    appName: "MinePro Public Sale",
    appDescription: "MinePro Public Sale",
    appIcon: "",
    appUrl: "https://mineprobusiness.net",
  })
);

// Keep this export because we need to use it to invalidate queries for transactions
export const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  // Prevent hydration flicker and errors
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <>
      {hydrated && (
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            {/* Theme allows you to customize the ConnectKit, the default theme will
            be minimal. You can change it by passing the customTheme prop to the
            ConnectKitProvider. Please refer to the ConnectKit documentation for
            more information on which properties you can customize. */}
            <ConnectKitProvider theme={"minimal"}>
              {children}
            </ConnectKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      )}
    </>
  );
};
