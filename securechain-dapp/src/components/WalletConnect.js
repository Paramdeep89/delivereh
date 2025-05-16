import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function WalletConnect({ onConnected }) {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const [addr] = await window.ethereum.request({ method: "eth_requestAccounts" });
          const signer = await provider.getSigner();

          setAccount(addr);
          onConnected({ address: addr, provider, signer });

          console.log("🔗 Connected wallet:", addr);
        } catch (error) {
          console.error("❌ Wallet connection failed:", error);
        }
      } else {
        alert("🦊 Please install MetaMask!");
      }
    };

    connectWallet();

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setAccount(accounts[0]);
        onConnected({ address: accounts[0], provider, signer });

        console.log("🔁 Account changed:", accounts[0]);
      } else {
        setAccount(null);
        console.warn("⚠️ Wallet disconnected.");
      }
    };

    window.ethereum?.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []); // ✅ Runs only once on mount

  return (
    <section>
      <div>
        {account ? (
          <p>🔗 Connected: {account}</p>
        ) : (
          <button onClick={() => window.location.reload()}>Connect Wallet</button>
        )}
      </div>
    </section>
  );
}
