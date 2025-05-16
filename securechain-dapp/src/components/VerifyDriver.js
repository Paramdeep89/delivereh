import { useState } from "react";
import { ethers } from "ethers";
import POLICY_EVALUATOR_ABI from "../abi/PolicyEvaluator.json";

const POLICY_EVALUATOR_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3"; // <-- replace with your deployed address

function VerifyDriver({ signer }) {
  const [driverAddress, setDriverAddress] = useState("");
  const [status, setStatus] = useState("");

  const handleVerifyDriver = async () => {
    try {
      const contract = new ethers.Contract(
        POLICY_EVALUATOR_ADDRESS,
        POLICY_EVALUATOR_ABI.abi,
        signer
      );

      const tx = await contract.setVerifiedDriver(driverAddress, true);
      setStatus("⏳ Waiting for confirmation...");
      await tx.wait();
      setStatus("✅ Driver verified successfully.");
    } catch (error) {
      console.error(error);
      setStatus("❌ Error verifying driver.");
    }
  };

  return (
    <section>
 <div>
      <h3>🚛 Add Verified Driver</h3>
      <input
        type="text"
        placeholder="Driver wallet address"
        value={driverAddress}
        onChange={(e) => setDriverAddress(e.target.value)}
      />
      <button onClick={handleVerifyDriver}>Verify Driver</button>
      <p>{status}</p>
    </div>
    </section>
   
  );
}

export default VerifyDriver;
