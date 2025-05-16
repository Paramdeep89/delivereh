import { useState } from "react";
import { getContracts } from "../contracts";
import POLICY_EVALUATOR_ARTIFACT from "../abi/PolicyEvaluator.json";
import { ethers } from "ethers";

const POLICY_EVALUATOR_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // 🔁 Replace with your deployed contract address
const POLICY_EVALUATOR_ABI = POLICY_EVALUATOR_ARTIFACT.abi;

export default function RoleActions({ signer }) {
  const [targetAddress, setTargetAddress] = useState("");
  const [role, setRole] = useState("1"); // Default to Driver
  const [status, setStatus] = useState("");
  const [queriedRole, setQueriedRole] = useState("");

  const assignRole = async () => {
    try {
      const { secureChain } = getContracts(signer);
      const tx = await secureChain.assignRole(targetAddress, parseInt(role));
      await tx.wait();
      setStatus(`✅ Role "${roleName(parseInt(role))}" assigned to ${targetAddress}`);
    } catch (err) {
      console.error(err);
      const reason = err?.reason || err?.message || "Unknown error";
      setStatus("❌ Failed to assign role: " + reason);
    }
  };

  const revokeRole = async () => {
    try {
      const { secureChain } = getContracts(signer);
      const tx = await secureChain.revokeRole(targetAddress);
      await tx.wait();

      // 🆕 Revoke verification from PolicyEvaluator
      const policyEvaluator = new ethers.Contract(
        POLICY_EVALUATOR_ADDRESS,
        POLICY_EVALUATOR_ABI,
        signer
      );

      const revokeTx = await policyEvaluator.setVerifiedDriver(targetAddress, false);
      await revokeTx.wait();

      setStatus(`✅ Role and driver verification revoked from ${targetAddress}`);
    } catch (err) {
      console.error(err);
      const reason = err?.reason || err?.message || "Unknown error";
      setStatus("❌ Failed to revoke role/verification: " + reason);
    }
  };

  const checkRole = async () => {
    try {
      const { secureChain } = getContracts(signer);
      const roleId = await secureChain.roles(targetAddress);
      const roleNameStr = roleName(Number(roleId));
      setQueriedRole(roleNameStr);
    } catch (err) {
      console.error(err);
      setQueriedRole("❌ Unable to fetch role.");
    }
  };

  const roleName = (id) => {
    if (id === 1) return "Driver";
    if (id === 2) return "Inspector";
    return "None";
  };

  return (
    <section>
      <div>
        <h2>🔐 Role Management</h2>
        <input
          type="text"
          placeholder="0xAddress"
          value={targetAddress}
          onChange={(e) => setTargetAddress(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="1">Driver</option>
          <option value="2">Inspector</option>
        </select>
        <button onClick={assignRole}>Assign Role</button>
        <button onClick={revokeRole}>Revoke Role</button>
        <button onClick={checkRole}>Check Role</button>

        <p className={
          status.includes("✅") ? "status-success" :
          status.includes("❌") ? "status-error" :
          "status-warning"
        }>{status}</p>

        {queriedRole && <p>👤 Current Role: {queriedRole}</p>}
      </div>
    </section>
  );
}
