import React, { useState, useEffect, useRef } from "react";
import { FrameHost } from "@farcaster/frame-host";
import { exposeToIframe } from "@farcaster/frame-host";
import { getWalletClient } from "@wagmi/core";
import { useAccount } from "wagmi";
import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { RpcTransactionRequest, WatchAssetParams } from "viem";

const DEBUG = true;
const LOADING_TIMEOUT_MS = 2000; // 2 seconds timeout for loading state
const FRAME_ID = "bankless-academy-frame";

const FRAME_METADATA = {
  name: "Bankless Academy",
  iconUrl: "https://app.banklessacademy.com/app-icon.png",
};

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

interface FrameProps {
  url: string;
  onClose?: () => void;
}

interface FrameMessage {
  id: string;
  type: "APPLY" | "GET";
  path: string[];
  argumentList?: any[];
}

interface FrameError {
  message: string;
  code?: string;
}

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, listener: any) => any;
  removeListener: (event: string, listener: any) => any;
}

const log = (...args: any[]) => {
  if (DEBUG) {
    console.log("[Frame]", ...args);
  }
};

const logMessage = (msg: FrameMessage) => {
  if (!DEBUG) return;

  const logParts = [`Message Type: ${msg.type}`];
  if (msg.path?.length) {
    logParts.push(`Path: ${msg.path.join(".")}`);
  }
  if (msg.argumentList?.length) {
    logParts.push("Arguments:", JSON.stringify(msg.argumentList, null, 2));
  }
  log(...logParts);

  if (msg.type === "APPLY") {
    switch (msg.path[0]) {
      case "eip6963RequestProvider":
        log("Provider request received");
        break;
      case "ethProviderRequestV2": {
        const request = msg.argumentList?.[0];
        if (request?.value?.method) {
          log("ETH request:", request.value.method, request.value);
        }
        break;
      }
      default:
        log("Unknown APPLY path:", msg.path[0]);
    }
  } else if (msg.type === "GET") {
    log("GET request for:", msg.path[0]);
  }
};

export default function Frame({
  url,
  onClose,
}: FrameProps): React.ReactElement {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { address } = useAccount();

  const resetLoadingState = () => {
    setIsLoading(false);
    setIsInitialized(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleIframeLoad = () => {
    log("Iframe loaded");
    resetLoadingState();
  };

  useEffect(() => {
    if (!url || !address) return;

    let isCurrentFrame = true;
    log("Initializing frame host...");
    setIsLoading(true);
    setIsInitialized(false);

    // Set a timeout to force initialization if frame takes too long
    timeoutRef.current = setTimeout(() => {
      if (isCurrentFrame) {
        log("Loading timeout reached, forcing initialization");
        resetLoadingState();
      }
    }, LOADING_TIMEOUT_MS);

    const initFrame = async () => {
      if (!iframeRef.current) {
        log("No iframe ref found");
        resetLoadingState();
        return;
      }

      let provider: EthereumProvider | undefined;
      try {
        const client = await getWalletClient(config);
        if (client) {
          provider = {
            request: async (args: { method: string; params?: any[] }) => {
              if (!isCurrentFrame) return null;
              try {
                const result = await client.request({
                  method: args.method,
                  params: args.params || [],
                } as any);
                return result;
              } catch (error) {
                console.error("Wallet request error:", error);
                throw error;
              }
            },
            on: (_event: string, _listener: any) => {
              log("Provider event listener added:", _event);
              return provider;
            },
            removeListener: (_event: string, _listener: any) => {
              log("Provider event listener removed:", _event);
              return provider;
            },
          };
        }
      } catch (err: any) {
        if (!isCurrentFrame) return;
        const errorMessage = err?.message || "Failed to initialize wallet";
        log("Wallet initialization error:", errorMessage);
        setError(errorMessage);
        resetLoadingState();
      }

      if (!isCurrentFrame) return;

      const handleMessage = (event: MessageEvent) => {
        if (!isCurrentFrame) return;
        if (event.source === iframeRef.current?.contentWindow) {
          logMessage(event.data as FrameMessage);
        }
      };

      window.addEventListener("message", handleMessage);

      const { endpoint } = exposeToIframe({
        iframe: iframeRef.current,
        sdk: {
          ready: (options: any) => {
            if (!isCurrentFrame) return;
            log("Frame ready called with options:", options);
            resetLoadingState();
          },
          eip6963RequestProvider: () => {
            if (!isCurrentFrame) return;
            log("Provider requested");
            if (endpoint) {
              log("Announcing provider...");
              endpoint.emit({
                event: "eip6963:announceProvider",
                info: {
                  name: "Bankless Academy Frame",
                  icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23000000' d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>",
                  rdns: "com.banklessacademy.frame",
                  uuid: "1395b549-854c-48c4-96af-5a58012196e5",
                },
              });
              log("Provider announced");
            }
          },
          ethProviderRequestV2: async (request: any) => {
            if (!isCurrentFrame || !provider) {
              return {
                error: {
                  code: -32603,
                  message: "Wallet not available",
                },
              };
            }

            log("ETH request:", request.value.method, request.value);
            if (!request?.value?.method) {
              return {
                error: {
                  code: -32602,
                  message: "Invalid request format",
                },
              };
            }

            try {
              const response = await provider.request({
                method: request.value.method,
                params: request.value.params || [],
              });
              log("ETH response:", response);
              return { result: response };
            } catch (error: any) {
              log("ETH error:", error);
              return {
                error: {
                  code: error?.code || -32603,
                  message: error?.message || "Internal error",
                  data: error?.data,
                },
              };
            }
          },
        } as unknown as FrameHost,
        ethProvider: provider as any,
        frameOrigin: "*",
        debug: DEBUG,
      });

      cleanupRef.current = () => {
        isCurrentFrame = false;
        window.removeEventListener("message", handleMessage);
        if (iframeRef.current) {
          iframeRef.current.removeEventListener("load", handleIframeLoad);
        }
      };
    };

    // Add load event listener to iframe
    if (iframeRef.current) {
      iframeRef.current.addEventListener("load", handleIframeLoad);
    }

    initFrame();

    return () => {
      isCurrentFrame = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      setIsLoading(false);
      setIsInitialized(false);
    };
  }, [url, address]);

  const frameUrl = url.includes("?")
    ? `${url}&webapp=true`
    : `${url}?webapp=true`;

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = frameUrl;
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      className={`frame-wrapper ${
        isMinimized ? "frame-wrapper--minimized" : ""
      }`}
    >
      <div className="frame-container">
        <div className="frame-header">
          <div className="frame-header-left">
            <img
              src={FRAME_METADATA.iconUrl}
              alt="Frame Icon"
              className="frame-header-icon"
            />
            <span className="frame-header-title">{FRAME_METADATA.name}</span>
          </div>
          <div className="frame-header-actions">
            <button
              className="frame-header-button"
              onClick={handleRefresh}
              aria-label="Refresh"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13.65 2.35A7.958 7.958 0 0 0 8 0a8 8 0 1 0 8 8h-2a6 6 0 1 1-1.35-3.8l1-1.85z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              className="frame-header-button"
              onClick={handleMinimize}
              aria-label="Minimize"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 7v2H2V7h12z" fill="currentColor" />
              </svg>
            </button>
            <button
              className="frame-header-button"
              onClick={onClose}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12.95 4.464a1 1 0 0 0-1.414-1.414L8 6.586 4.464 3.05A1 1 0 0 0 3.05 4.464L6.586 8 3.05 11.536a1 1 0 1 0 1.414 1.414L8 9.414l3.536 3.536a1 1 0 0 0 1.414-1.414L9.414 8l3.536-3.536z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
        {isLoading && (
          <div className="frame-loading">
            <div className="frame-spinner" />
          </div>
        )}
        {error && <div className="frame-error">{error}</div>}
        <iframe
          ref={iframeRef}
          id={FRAME_ID}
          src={frameUrl}
          height={695}
          width={424}
          onLoad={handleIframeLoad}
          onError={(err) => {
            setError("Failed to load frame");
            resetLoadingState();
          }}
          className={`frame-iframe ${
            isInitialized ? "frame-iframe--initialized" : ""
          }`}
          allow="microphone; camera; clipboard-write 'src'"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
          style={{
            border: "none",
            opacity: isInitialized ? 1 : 0.5,
            transition: "opacity 0.3s ease",
            maxWidth: "100vw",
            backgroundColor: "#000000",
          }}
        ></iframe>
      </div>
      <style>
        {`
          .frame-wrapper {
            pointer-events: none;
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.75rem;
            transition: all 0.3s ease-in-out;
            width: auto;
          }

          .frame-wrapper--minimized {
            transform: translateY(calc(100% - 48px));
          }

          .frame-container {
            pointer-events: auto;
            position: relative;
            width: 424px;
            margin: 0;
            background: var(--frame-bg, #fff);
            border-radius: 0.75rem;
            box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.12);
            overflow: hidden;
            transition: all 0.3s ease-in-out;
          }

          .frame-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem;
            background: #000000;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .frame-header-left {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .frame-header-icon {
            width: 24px;
            height: 24px;
            border-radius: 4px;
          }

          .frame-header-title {
            color: #ffffff;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .frame-header-actions {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .frame-header-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            padding: 0;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            color: #ffffff;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }

          .frame-header-button:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          .frame-header-button:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
          }

          .frame-loading {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 0.75rem;
            z-index: 1;
          }

          .frame-spinner {
            width: 2rem;
            height: 2rem;
            border: 0.25rem solid #e2e8f0;
            border-top-color: #3182ce;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .frame-error {
            color: #e53e3e;
            margin-bottom: 0.75rem;
            text-align: center;
            padding: 0.5rem;
            background: #fff5f5;
            border-radius: 0.375rem;
          }

          .frame-iframe {
            width: 424px;
            height: 695px;
            border: none;
            opacity: 0.5;
            transition: opacity 0.3s ease;
            border-radius: 0.75rem;
            visibility: visible;
          }

          .frame-iframe--initialized {
            opacity: 1;
            visibility: visible;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          @media (min-width: 1280px) {
            .frame-wrapper {
              bottom: 0;
              right: auto;
              width: 424px;
            }
          }
        `}
      </style>
    </div>
  );
}
