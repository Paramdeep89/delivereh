import { useState } from "react";
import { getContracts } from "../contracts";

export default function LockCargo({ signer }) {
  const [cargoId, setCargoId] = useState("");
  const [status, setStatus] = useState("");

  const lock = async () => {
    try {
      if (!cargoId) {
        setStatus("❌ Please enter a Cargo ID.");
        return;
      }

      const { secureChain } = getContracts(signer);
      const tx = await secureChain.lockCargo(cargoId);
      await tx.wait();
      setStatus(`🔒 Cargo "${cargoId}" successfully locked by Inspector.`);
      setCargoId("");
    } catch (err) {
      console.error(err);
      const reason = err?.reason || err?.message || "Unknown error";
      setStatus("❌ Failed to lock cargo: " + reason);
    }
  };

  return (
    <section>
      <div>
        <h2>🔒 Lock Cargo (Inspector only)</h2>
        <input
          type="text"
          placeholder="Cargo ID"
          value={cargoId}
          onChange={(e) => setCargoId(e.target.value)}
        />
        <button onClick={lock}>Lock</button>
        <p
          className={
            status.includes("🔒") || status.includes("✅")
              ? "status-success"
              : status.includes("❌")
              ? "status-error"
              : "status-warning"
          }
        >
          {status}
        </p>
      </div>
    </section>
  );
}
