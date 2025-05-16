import { ethers } from "ethers";
import SecureChainABI from "../abi/SecureChain.json";
import PolicyEvaluatorABI from "../abi/PolicyEvaluator.json";

// Replace these with your actual deployed addresses
 const SECURECHAIN_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
 const EVALUATOR_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

export const getContracts = (providerOrSigner) => {
  const secureChain = new ethers.Contract(SECURECHAIN_ADDRESS, SecureChainABI.abi, providerOrSigner);
  const evaluator = new ethers.Contract(EVALUATOR_ADDRESS, PolicyEvaluatorABI.abi, providerOrSigner);
  return { secureChain, evaluator };
};
