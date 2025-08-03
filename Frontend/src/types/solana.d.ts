interface SolanaWallet {
  connect(): Promise<{ publicKey: { toBytes(): Uint8Array } }>;
  disconnect(): Promise<void>;
  isConnected: boolean;
  publicKey: { toBytes(): Uint8Array } | null;
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
  signTransaction(transaction: any): Promise<any>;
  signAllTransactions(transactions: any[]): Promise<any[]>;
}

declare global {
  interface Window {
    solana?: SolanaWallet;
    phantom?: SolanaWallet;
    braveSolana?: SolanaWallet;
  }
}

export {}; 