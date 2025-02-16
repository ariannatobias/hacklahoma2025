import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getContract } from "./contract";
import { ethers } from "ethers";

const App = () => {
  const [stake, setStake] = useState("");
  const [duration, setDuration] = useState(25);
  const [message, setMessage] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    if (sessionActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sessionActive, timeLeft]);

  const startFocusSession = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.startSession(duration, { value: ethers.parseEther(stake) });
      await tx.wait();
      setMessage("Focus session started!");
      setSessionActive(true);
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
      setSessionActive(false);
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
      setSessionActive(false);
    } catch (error) {
      console.error(error);
      setMessage("Error exiting early.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-softLavender via-tranquilBlue to-warmBeige text-deepCharcoal">
      <motion.div
        className="bg-white/50 backdrop-blur-md shadow-lg rounded-3xl p-6 w-96 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold">🌿 Ethereal: Stay Focused, Earn Rewards ✨</h1>

        {!sessionActive ? (
          <div className="mt-4">
            <label className="block text-sm font-medium">Stake Amount (ETH):</label>
            <input
              type="text"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              className="w-full p-2 mt-1 rounded-lg border shadow-sm focus:ring gentleTeal focus:outline-none"
            />

            <label className="block text-sm font-medium mt-3">Focus Duration (minutes):</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full p-2 mt-1 rounded-lg border shadow-sm focus:ring gentleTeal focus:outline-none"
            />

            <button
              onClick={startFocusSession}
              className="mt-4 w-full bg-gentleTeal text-white py-2 rounded-lg shadow-md transition hover:bg-opacity-80"
            >
              Start Focus Session
            </button>
          </div>
        ) : (
          <motion.div
            className="relative w-40 h-40 flex items-center justify-center text-center rounded-full shadow-lg mt-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "radial-gradient(circle, rgba(152,221,202,0.8) 30%, rgba(152,221,202,0.5) 60%, rgba(152,221,202,0.2) 100%)",
              filter: "blur(5px)",
            }}
          >
            <div className="relative text-black text-xl font-semibold">
              {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`}
              <p className="text-sm">minutes left</p>
            </div>
          </motion.div>
        )}

        {sessionActive && (
          <div className="mt-4 space-x-2">
            <button onClick={completeSession} className="bg-green-500 text-white px-4 py-2 rounded-lg">Complete Session</button>
            <button onClick={exitSessionEarly} className="bg-red-500 text-white px-4 py-2 rounded-lg">Exit Early</button>
          </div>
        )}

        <p className="mt-3 text-sm text-gray-600">{message}</p>
      </motion.div>
    </div>
  );
};

export default App;
