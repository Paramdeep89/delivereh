const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [owner, driver] = await ethers.getSigners();

  // Connect to deployed contracts (paste actual deployed addresses if needed)
  const evaluator = await ethers.getContractAt("PolicyEvaluator", "0x5fbdb2315678afecb367f032d93f642f64180aa3");
  const secureChain = await ethers.getContractAt("SecureChain", "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512");

  const cargoId = "cargo-123";
  const cargoKey = ethers.toBigInt(ethers.getAddress(driver.address)); // crude way to simulate cargoKey

  console.log("Setting verified driver...");
  await evaluator.connect(owner).setVerifiedDriver(driver.address, true);

  console.log("Depositing stablecoin...");
  await evaluator.connect(owner).depositStablecoin(driver.address, ethers.parseUnits("100", 18));

  console.log("Assigning driver role...");
  await secureChain.connect(owner).assignRole(driver.address, 1); // Role.Driver = 1

  console.log("Registering cargo...");
  await secureChain.connect(driver).registerCargo(cargoId, 800); // 800kg

  console.log("Updating cargo status (should pass all FRE rules)...");
  await secureChain.connect(driver).updateCargoStatus(cargoId, 1); // 1 = InTransit

  console.log("✅ All steps executed successfully!");
}

main().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
