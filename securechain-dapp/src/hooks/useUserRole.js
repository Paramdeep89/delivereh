import { useEffect, useState } from "react";
import { getContracts } from "../contracts";
import { ethers } from "ethers";

export default function useUserRole(address) {
  const [role, setRole] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!address) return;

      // 🧪 DEBUG LOGS
      console.log("🔍 [useUserRole] Checking role for address:", address);

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log("🔍 [useUserRole] BrowserProvider initialized:", provider);

        const { secureChain } = getContracts(provider);
        console.log("🔍 [useUserRole] secureChain.roles(...) with address:", address);

        // 🚨 This line triggers ENS resolution if address is invalid or ENS-based
        const roleId = await secureChain.roles(address);

        const owner = await secureChain.owner();
        console.log("🔍 [useUserRole] Contract owner address:", owner);

        setRole(Number(roleId));
        setIsOwner(owner.toLowerCase() === address.toLowerCase());
      } catch (err) {
        console.error("❌ [useUserRole] Failed to fetch role info:", err);
        setRole(null);
        setIsOwner(false);
      }
    };

    checkRole();
  }, [address]);

  return { role, isOwner };
}
