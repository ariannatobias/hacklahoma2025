const hre = require("hardhat");

async function main() {
  const Ethereal = await hre.ethers.getContractFactory("Ethereal");
  const ethereal = await Ethereal.deploy();

  await ethereal.waitForDeployment();

  console.log(`✅ Ethereal deployed to: ${ethereal.target}`); // ✅ Prints contract address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
