import { PROJECT_NAME } from '../constants'
import { createConfig, http } from 'wagmi'
import {
  mainnet,
  optimism,
  polygon,
  base,
  sepolia,
  polygonMumbai,
  optimismSepolia,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  type Chain,
} from 'wagmi/chains'

import { ENABLE_TESTNET } from '../constants/networks'

const testChains = ENABLE_TESTNET ? [
  sepolia,
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  polygonMumbai,
] : []

export const networks: [Chain, ...Chain[]] = [
  mainnet,
  arbitrum,
  base,
  optimism,
  polygon,
  ...testChains
]

// 1. Get projectID at https://cloud.walletconnect.com
export const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

// 2. Configure wagmi client
export const metadata = {
  name: PROJECT_NAME,
  description: `Connect to ${PROJECT_NAME}`,
  url: 'https://app.banklessacademy.com/',
  icons: ['https://app.banklessacademy.com/logo.jpg'],
}

// Configure wagmi with Frame-specific settings
export const wagmiConfig = createConfig({
  chains: networks,
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    ...(ENABLE_TESTNET && {
      [sepolia.id]: http(),
      [arbitrumSepolia.id]: http(),
      [baseSepolia.id]: http(),
      [optimismSepolia.id]: http(),
      [polygonMumbai.id]: http(),
    }),
  },
  // Add chain switching configuration
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
}) 
