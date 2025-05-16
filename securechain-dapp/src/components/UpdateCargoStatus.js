import { useState } from "react";
import { getContracts } from "../contracts";

export default function UpdateCargoStatus({ signer, role, isOwner }) {
  const [cargoId, setCargoId] = useState("");
  const [statusCode, setStatusCode] = useState("1");
  const [status, setStatus] = useState("");

  const updateStatus = async () => {
    try {
      if (!cargoId || !statusCode) {
        setStatus("❌ Please enter cargo ID and select a status.");
        return;
      }

      const { secureChain } = getContracts(signer);
      const tx = await secureChain.updateCargoStatus(cargoId, parseInt(statusCode));
      await tx.wait();
      setStatus(`✅ Status updated for ${cargoId}`);
    } catch (err) {
      console.error(err);
      const reason = err?.reason || err?.message || "Unknown error";
      setStatus("❌ FRE Policy Denied: " + reason);
    }
  };

  const statusOptions = [];

  if (isOwner || role === 1) {
    statusOptions.push({ value: "1", label: "InTransit" });
    statusOptions.push({ value: "2", label: "Delivered" });
  }

  if (isOwner || role === 2) {
    statusOptions.push({ value: "3", label: "Locked" });
  }

  return (
    <section>
      <div>
        <h2>✏️ Update Cargo Status</h2>
        <input
          type="text"
          placeholder="Cargo ID"
          value={cargoId}
          onChange={(e) => setCargoId(e.target.value)}
        />
        <select value={statusCode} onChange={(e) => setStatusCode(e.target.value)}>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button onClick={updateStatus}>Update Status</button>
        <p
          className={
            status.includes("✅")
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
