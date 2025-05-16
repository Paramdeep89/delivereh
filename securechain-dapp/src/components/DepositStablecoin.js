import { useState } from "react";
import { ethers } from "ethers";
import POLICY_EVALUATOR_ARTIFACT from "../abi/PolicyEvaluator.json";

const POLICY_EVALUATOR_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // Replace with latest

function DepositStablecoin({ signer }) {
  const [driverAddress, setDriverAddress] = useState("");
  const [amount, setAmount] = useState("100");
  const [status, setStatus] = useState("");

  const handleDeposit = async () => {
    try {
      const trimmedAddress = driverAddress.trim();

      if (!ethers.isAddress(trimmedAddress)) {
        setStatus("❌ Invalid wallet address.");
        return;
      }

      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        setStatus("❌ Enter a valid deposit amount.");
        return;
      }

      const contract = new ethers.Contract(
        POLICY_EVALUATOR_ADDRESS,
        POLICY_EVALUATOR_ARTIFACT.abi,
        signer
      );

      const amountInWei = ethers.parseUnits(amount, 18); // Use 6 if simulating USDC
      const tx = await contract.depositStablecoin(trimmedAddress, amountInWei);
      setStatus("⏳ Waiting for confirmation...");
      await tx.wait();
      setStatus(`✅ Deposited ${amount} stablecoins to ${trimmedAddress}`);
    } catch (error) {
      console.error(error);
      const reason = error?.reason || error?.message || "Unknown error";
      setStatus("❌ Deposit failed: " + reason);
    }
  };

  return (
    <section>
      <h3>💰 Deposit Stablecoin</h3>
      <input
        type="text"
        placeholder="Driver wallet address"
        value={driverAddress}
        onChange={(e) => setDriverAddress(e.target.value)}
        style={{ marginRight: "1rem", width: "300px" }}
      />
      <input
        type="number"
        placeholder="Amount (e.g. 100)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginRight: "1rem", width: "100px" }}
      />
      <button onClick={handleDeposit}>Deposit</button>
      <p>{status}</p>
    </section>
  );
}

export default DepositStablecoin;
