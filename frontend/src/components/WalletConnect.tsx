import React from 'react';
import { useWeb3 } from '../utils/Web3Context';

export const WalletConnect: React.FC = () => {
  const { account, chainId, connect, disconnect, isConnected } = useWeb3();

  return (
    <div className="wallet-connect">
      {!isConnected ? (
        <button onClick={connect} className="connect-button">
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <p>Connected Account: {account}</p>
          <p>Chain ID: {chainId}</p>
          <button onClick={disconnect} className="disconnect-button">
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}; 