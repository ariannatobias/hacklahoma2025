require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",  // ✅ Ensures valid URL
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
  },
};