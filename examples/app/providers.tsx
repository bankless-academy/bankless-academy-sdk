"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { type ReactNode, useMemo } from "react";
import { injected, metaMask } from "wagmi/connectors";

export function Providers({ children }: { children: ReactNode }) {
  // Configure chains with fallback RPCs
  const chains = useMemo(() => [mainnet] as const, []);

  // Configure RPC providers with fallbacks
  const transports = useMemo(
    () => ({
      [mainnet.id]: http(
        process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
          ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
          : undefined,
        {
          retryCount: 3,
          timeout: 10_000,
        }
      ),
    }),
    []
  );

  // Configure wallet connectors
  const connectors = useMemo(() => [injected(), metaMask()], []);

  // Create Wagmi config
  const config = useMemo(
    () =>
      createConfig({
        chains,
        transports,
        connectors,
        ssr: false,
      }),
    [chains, transports, connectors]
  );

  // Configure QueryClient with proper settings
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnWindowFocus: false,
          },
        },
      }),
    []
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
