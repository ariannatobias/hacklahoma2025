# **Ethereal – A Tranquil Way to Stay Focused**  
*Built on Ethereum for Hacklahoma 2025*  

**Note:** The smart contract functionality is not working as expected. I was unable to resolve the contract deployment issues. :(  

## **Overview**  
Ethereal is a simple, mindful productivity tool designed to help users stay focused while working or studying. Instead of getting distracted, users commit to a focus session by staking ETH into a smart contract.

- If a session is completed, the staked ETH is returned along with an optional NFT reward.
- If a session is exited early, a portion of the stake is forfeited as an incentive to stay focused.

Ethereal was built for Hacklahoma 2025, utilizing Ethereum smart contracts, Layer 2 scaling, and NFT incentives to create an effective focus system.

## **Features**  
- **Commit to Focus with ETH** – Users stake a small amount of ETH to begin a session.  
- **Earn Back the Stake** – If a session is completed, the full stake is refunded.  
- **Penalty for Leaving Early** – If a session is exited early, a portion of the stake is lost.  
- **NFT Rewards (Optional)** – Completing multiple sessions earns unique Ethereal NFTs.  
- **Layer 2 Compatibility** – Designed to reduce gas fees using Optimism or Arbitrum.  
- **Decentralized and Transparent** – The system is powered by Ethereum and fully on-chain.  

## **Built With**  
| **Component** | **Tech Stack** |
|--------------|---------------|
| **Smart Contracts** | Solidity, Hardhat |
| **Blockchain** | Ethereum|
| **Frontend** | React, Ethers.js |
| **Wallet Integration** | MetaMask |
| **Storage** | IPFS (for NFT metadata) |
| **Deployment** | Sepolia Testnet |

## **How It Works**  
1. **Start a Session** – Users stake ETH and set a focus timer.  
2. **Deep Work Mode** – The smart contract holds the ETH while the session is active.  
3. **Complete or Exit Early** –  
   - Completing the session returns the staked ETH along with potential rewards.  
   - Exiting early results in a penalty, where a portion of the stake is lost.  
4. **NFT Streaks** – Users who complete multiple sessions earn an Ethereal NFT.  

## **Getting Started**  
### **Clone the Repository**  
```bash
git clone https://github.com/YOUR_GITHUB/ethereal-focus.git
cd ethereal-focus
```

### **Install Dependencies**  
```bash
npm install
```

### **Deploy the Smart Contract**  
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### **Start the Frontend**  
```bash
npm start
```
Open `http://localhost:3000/` to start using Ethereal.  
