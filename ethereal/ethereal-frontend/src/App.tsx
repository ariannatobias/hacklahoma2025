import React, { useState, useEffect } from "react";
import { getContract } from "./contract";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import "./styles.css";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function App() {
  const [isActive, setIsActive] = useState(false);
  const [stake, setStake] = useState("");
  const [duration, setDuration] = useState(25);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isActive, timeLeft]);

  const startFocusSession = async () => {
    try {
        const contract = await getContract();
        
        // Ensure MetaMask is available
        if (!window.ethereum) {
            setMessage("MetaMask is not installed.");
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const isActive = await contract.isSessionActive(userAddress);
        if (isActive) {
            setMessage("You already have an active session.");
            return;
        }

        const tx = await contract.startSession(duration, { value: ethers.parseEther(stake) });
        await tx.wait();
        setMessage("Focus session started!");
        setIsActive(true);
      setTimeLeft(duration * 60);
      console.log("Session started. isActive:", isActive);

    } catch (error) {
        console.error(error);
        setMessage("Error starting session.");
    }
};

  const completeSession = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.completeSession();
      await tx.wait();
      setMessage("Focus session completed! ETH refunded.");
      setIsActive(false);
    } catch (error) {
      console.error(error);
      setMessage("Error completing session.");
    }
  };

  const exitSessionEarly = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.exitEarly();
      await tx.wait();
      setMessage("Exited early. Penalty applied.");
      setIsActive(false);
    } catch (error) {
      console.error(error);
      setMessage("Error exiting early.");
    }
  };

  const forceExitSession = async () => {
    try {
        const contract = await getContract();
        const tx = await contract.exitEarly();
        await tx.wait();
        setMessage("Session forcibly exited. Try starting a new one.");
    } catch (error) {
        console.error(error);
        setMessage("Error exiting session.");
    }
};

  return (
    <div className="container">
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="title">Ethereal Focus</h1>
  
        {!isActive ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <div className="input-group">
              <label>Stake Amount (ETH):</label>
              <input
                type="text"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="0.01"
              />
            </div>
  
            <div className="input-group">
              <label>Focus Duration (minutes):</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                placeholder="25"
              />
            </div>
  
            <button onClick={startFocusSession} className="btn start">Start Focus Session</button>
          </motion.div>
        ) : (
          <div className="timer">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        )}
  
        {isActive && (
          <motion.div 
            className="btn-group"
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <button onClick={completeSession} className="btn complete">Complete</button>
            <button onClick={exitSessionEarly} className="btn exit">Exit Early</button>
            <button onClick={forceExitSession} className="btn force-exit">Force Exit</button>
          </motion.div>
        )}
        <p className="message">{message}</p>
      </motion.div>
    </div>
  );  
}

export default App;