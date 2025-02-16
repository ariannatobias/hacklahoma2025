import { ethers } from "ethers";
import EtherealABI from "./EtherealABI.json"; 

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "";
const RPC_URL = process.env.REACT_APP_SEPOLIA_RPC_URL || "";

if (!CONTRACT_ADDRESS) {
  console.error("❌ Contract address is missing! Check .env file.");
}
if (!RPC_URL) {
  console.error("❌ RPC URL is missing! Check .env file.");
}

// Create a provider (read-only)
export const getProvider = () => new ethers.JsonRpcProvider(RPC_URL);

// Create a signer (to send transactions)
export const getSigner = async () => {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider.getSigner();
};

// Get contract instance
export const getContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, EtherealABI.abi, signer);
};