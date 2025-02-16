import React, { useState, useEffect } from "react";
import { GlassmorphicCard } from "./components/GlassmorphicCard";
import { FocusTimer } from "./components/FocusTimer";
import { getContract } from "./contract";
import { ethers } from "ethers";
import { motion } from "framer-motion";

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
    <main className="min-h-screen w-full bg-gradient-to-br from-violet-500 via-teal-500 to-amber-200 p-6 flex items-center justify-center">
      <GlassmorphicCard>
        <div className="space-y-8 w-full max-w-md">
          <h1 className="text-3xl font-semibold text-center text-white mb-8">
            🌿 Ethereal Focus
          </h1>

          {!isActive ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <label className="block text-sm font-medium text-white">Stake Amount (ETH):</label>
              <input
                type="text"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="w-full p-2 mt-1 rounded-lg border bg-white/20 backdrop-blur-md text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-300"
                placeholder="0.01"
              />

              <label className="block text-sm font-medium text-white mt-3">Focus Duration (minutes):</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full p-2 mt-1 rounded-lg border bg-white/20 backdrop-blur-md text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-300"
                placeholder="25"
              />

              <button
                onClick={startFocusSession}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg shadow-md transition hover:bg-opacity-80"
              >
                Start Focus Session
              </button>
            </motion.div>
          ) : (
            <FocusTimer 
              progress={(timeLeft / (duration * 60)) * 100}  // Convert remaining time to percentage
              timeRemaining={`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`}
            />

          )}

          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center space-x-4"
            >
              <button onClick={completeSession} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Complete</button>
              <button onClick={exitSessionEarly} className="bg-red-500 text-white px-4 py-2 rounded-lg">Exit Early</button>
            </motion.div>
          )}

          <p className="mt-3 text-sm text-gray-300 text-center">{message}</p>
        </div>
      </GlassmorphicCard>
    </main>
  );
}

export default App;
