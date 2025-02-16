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
      console.log("Starting session with", stake, "ETH for", duration, "minutes");
  
      const tx = await contract.startSession(duration, { value: ethers.parseEther(stake) });
      await tx.wait();
      
      setMessage("Focus session started!");
    } catch (error: any) {
      console.error("Transaction failed:", error);
      setMessage("Error: " + (error.reason || error.message));
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
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🌿 Ethereal: Stay Focused, Earn Rewards ✨</h1>

      {!sessionActive ? (
        <>
          <label>Stake Amount (ETH):</label>
          <input type="text" value={stake} onChange={(e) => setStake(e.target.value)} />

          <br />

          <label>Focus Duration (minutes):</label>
          <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />

          <br />

          <button onClick={startFocusSession}>Start Focus Session</button>
        </>
      ) : (
        <motion.div
          className="relative w-80 h-80 flex items-center justify-center text-center rounded-full shadow-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, rgba(255,180,90,0.8) 30%, rgba(255,140,0,0.5) 60%, rgba(255,180,90,0.2) 100%)",
            filter: "blur(10px)",
            margin: "20px auto"
          }}
        >
          <div className="relative text-black text-2xl font-semibold">
            {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`}
            <p className="text-sm">minutes left</p>
          </div>
        </motion.div>
      )}

      {sessionActive && (
        <>
          <button onClick={completeSession}>Complete Session</button>
          <button onClick={exitSessionEarly}>Exit Early</button>
        </>
      )}

      <p>{message}</p>
    </div>
  );
};

export default App;
