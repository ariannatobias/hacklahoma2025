import { ethers } from "ethers";
import EtherealABI from "./EtherealABI.json" with { type: "json" };
import dotenv from "dotenv";
dotenv.config();

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const RPC_URL = process.env.REACT_APP_SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Ensure your .env has this
if (!PRIVATE_KEY) {
    console.error("❌ Private key is missing! Check your .env file.");
    process.exit(1);
  }
  
  // Ensure private key is valid
  try {
    new ethers.Wallet(PRIVATE_KEY);
  } catch (error) {
    console.error("❌ Invalid private key format.");
    process.exit(1);
  }
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, EtherealABI.abi, wallet);

async function exitSession() {
    try {
        const tx = await contract.exitEarly();
        await tx.wait();
        console.log("✅ Session forcibly exited.");
    } catch (error) {
        console.error("❌ Error exiting session:", error);
    }
}

exitSession();
