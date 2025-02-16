import { ethers } from "ethers";
import EtherealABI from "./EtherealABI.json"; // Import the contract ABI

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const RPC_URL = process.env.REACT_APP_SEPOLIA_RPC_URL;

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
  return new ethers.Contract(CONTRACT_ADDRESS, EtherealABI, signer);
};
