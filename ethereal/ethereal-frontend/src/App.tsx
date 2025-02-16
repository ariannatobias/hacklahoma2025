import React, { useState, useEffect } from "react";
import { GlassmorphicCard } from "./components/GlassmorphicCard";
import { FocusTimer } from "./components/FocusTimer";
import { getContract } from "./contract";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import "./App.css";

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
      const tx = await contract.startSession(duration, { value: ethers.parseEther(stake) });
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
    <main className="main-container">
      <GlassmorphicCard>
        <div className="card">
          <h1>🌿 Ethereal Focus</h1>

          {!isActive ? (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <label>Stake Amount (ETH):</label>
              <input
                type="text"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="0.01"
              />

              <label>Focus Duration (minutes):</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                placeholder="25"
              />

              <button onClick={startFocusSession}>Start Focus Session</button>
            </motion.div>
          ) : (
            <FocusTimer 
              progress={(timeLeft / (duration * 60)) * 100}  
              timeRemaining={`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`}
            />
          )}

          {isActive && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="button-group">
              <button onClick={completeSession}>Complete</button>
              <button onClick={exitSessionEarly} className="button-danger">Exit Early</button>
            </motion.div>
          )}

          <p>{message}</p>
        </div>
      </GlassmorphicCard>
    </main>
  );
}

export default App;