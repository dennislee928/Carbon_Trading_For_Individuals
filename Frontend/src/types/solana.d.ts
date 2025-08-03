// Solana 錢包類型定義
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      isSolflare?: boolean;
      isConnected?: boolean;
      connect: () => Promise<{ publicKey: { toBytes: () => Uint8Array } }>;
      disconnect: () => Promise<void>;
      signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
      publicKey?: { toBytes: () => Uint8Array };
    };
  }
}

export {};
