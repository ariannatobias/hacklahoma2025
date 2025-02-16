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
  const [stake, setStake] = useState("");
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

  useEffect(() => {
    (async () => {
      try {
        const contractInstance = await getContract();
        (window as any).contract = contractInstance; // Attach contract to global scope
        console.log("✅ Contract loaded:", contractInstance);
      } catch (error) {
        console.error("❌ Error loading contract:", error);
      }
    })();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const contract = await getContract();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        
        const session = await contract.sessions(userAddress);
        console.log("Session Data:", session);
  
        if (Number(session[0]) > 0) {
          setIsActive(true);
          setTimeLeft(Number(session[1]) * 60);
        } else {
          setIsActive(false);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
  
    checkSession();
  }, []);  

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
        console.log("Session Data:", session); // Debugging output

        // Convert BigInt values to Number
        const startTime = Number(session[0]);  // Convert BigInt to Number
        const duration = Number(session[1]);   // Convert BigInt to Number
        const stake = Number(session[2]);      // Convert BigInt to Number

        if (startTime > 0) { 
            setMessage("You already have an active session.");
            return;
        }

        const tx = await contract.startSession(duration, { value: ethers.parseEther(stake.toString()) });
        await tx.wait();
        setMessage("Focus session started!");
        setIsActive(true);
        setTimeLeft(duration * 60);
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
          <div className="timer-container">
            <CircularProgressbar
              value={(duration * 60 - timeLeft) / (duration * 60) * 100}
              text={`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`}
              styles={buildStyles({
                pathColor: "#6EE7B7",
                textColor: "#fff",
                trailColor: "rgba(255,255,255,0.3)",
                pathTransitionDuration: 0.5,
              })}
            />
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
          </motion.div>
        )}
        <p className="message">{message}</p>
      </motion.div>
    </div>
  );  
}

export default App;