const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with account:", deployer.address);

  // Deploy PolicyEvaluator
  const PolicyEvaluator = await hre.ethers.getContractFactory("PolicyEvaluator");
  const evaluator = await PolicyEvaluator.deploy("SecureChainPolicy-V1");
  await evaluator.waitForDeployment(); // ✅ instead of evaluator.deployed()
  console.log("PolicyEvaluator deployed to:", await evaluator.getAddress());

  // Deploy SecureChain with evaluator address
  const SecureChain = await hre.ethers.getContractFactory("SecureChain");
  const secureChain = await SecureChain.deploy(await evaluator.getAddress());
  await secureChain.waitForDeployment(); // ✅ new method
  console.log("SecureChain deployed to:", await secureChain.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
