import React, { useState, useEffect } from "react";
import { getContract } from "./contract";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./styles.css";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function App() {
  const [isActive, setIsActive] = useState(false);
  const [stake, setStake] = useState("0.01");
  const [duration, setDuration] = useState(25);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isActive, timeLeft]);

  const startFocusSession = async () => {
    try {
      const contract = await getContract();

      if (!window.ethereum) {
        setMessage("MetaMask is not installed.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const session = await contract.sessions(userAddress);
      if (Number(session.startTime) > 0 && session.completed === false) { 
        setMessage("You already have an active session.");
        return;
    }    

      const ethValue = ethers.parseEther(stake);

      const tx = await contract.completeSession({ gasLimit: 300000 });
      await tx.wait();
    
      setMessage("Focus session started!");
      setIsActive(true);
      setTimeLeft(duration * 60);
    } catch (error: any) {
      console.error("Transaction failed:", error.reason || error.message);
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
    } catch (error: any) {
      console.error("Error completing session:", error.reason || error.message);
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
    } catch (error: any) {
      console.error("Error exiting early:", error.reason || error.message);
      setMessage("Error exiting early.");
    }
  };

  const debugSession = async () => {
    try {
      const contract = await getContract();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
  
      const session = await contract.sessions(userAddress);
      console.log("✅ Session Data:", session);
      console.log("Start Time:", Number(session.startTime));
      console.log("Duration:", Number(session.duration));
      console.log("Stake:", ethers.formatEther(session.stake.toString()));
    } catch (error) {
      console.error("❌ Error fetching session:", error);
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
          <div>
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
          </div>
        ) : (
          <CircularProgressbar
            value={(duration * 60 - timeLeft) / (duration * 60) * 100}
            text={`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`}
            styles={buildStyles({ pathColor: "#6EE7B7", textColor: "#fff" })}
          />
        )}

        {isActive && (
          <div>
            <button onClick={completeSession} className="btn complete">Complete</button>
            <button onClick={exitSessionEarly} className="btn exit">Exit Early</button>
          </div>
        )}
        <p className="message">{message}</p>
      </motion.div>
    </div>
  );  
}

export default App;
