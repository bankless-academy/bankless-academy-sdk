"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { type ReactNode } from "react";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error("Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID environment variable");
}

// Configure chains with fallback RPCs
const chains = [mainnet] as const;

// Configure RPC providers with fallbacks
const transports = {
  [mainnet.id]: http(
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
      ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
      : undefined,
    {
      retryCount: 3,
      timeout: 10_000,
    }
  ),
};

// Configure wallet connectors
const connectors = [
  injected(),
  metaMask(),
  walletConnect({
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    metadata: {
      name: "Bankless Academy SDK Examples",
      description: "Example implementations of the Bankless Academy SDK components",
      url: "https://app.banklessacademy.com",
      icons: ["https://app.banklessacademy.com/app-icon.png"],
    },
  }),
];

// Create Wagmi config
const config = createConfig({
  chains,
  transports,
  connectors,
  ssr: true, // Enable SSR support
});

// Configure QueryClient with proper settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
