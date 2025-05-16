import { useState } from "react";
import { getContracts } from "../contracts";
import { ethers } from "ethers";

export default function CargoRegister({ signer }) {
  const [cargoId, setCargoId] = useState("");
  const [weight, setWeight] = useState("");
  const [status, setStatus] = useState("");

  const registerCargo = async () => {
    try {
      if (!cargoId || !weight) {
        setStatus("❌ Please enter both cargo ID and weight.");
        return;
      }

      const { secureChain } = getContracts(signer);
      const tx = await secureChain.registerCargo(cargoId, parseInt(weight));
      await tx.wait();

      setStatus(`✅ Cargo "${cargoId}" (weight: ${weight}kg) registered successfully.`);
      setCargoId("");
      setWeight("");
    } catch (err) {
      console.error(err);
      const reason = err?.reason || err?.message || "Unknown error";
      setStatus("❌ Registration failed: " + reason);
    }
  };

  return (
    <section>
      <div>
        <h2>🚚 Register New Cargo</h2>
        <input
          type="text"
          placeholder="Cargo ID"
          value={cargoId}
          onChange={(e) => setCargoId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button onClick={registerCargo}>Register</button>
        <p className={
          status.includes("✅") ? "status-success" :
          status.includes("❌") ? "status-error" :
          "status-warning"
        }>
          {status}
        </p>
      </div>
    </section>
  );
}
