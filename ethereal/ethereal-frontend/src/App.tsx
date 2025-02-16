import React, { useState } from "react";
import { getContract } from "./contract";
import { ethers } from "ethers";

const App = () => {
  const [stake, setStake] = useState("");
  const [duration, setDuration] = useState(25);
  const [message, setMessage] = useState("");

  // Start Focus Session
  const startFocusSession = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.startSession(duration, { value: ethers.parseEther(stake) });
      await tx.wait();
      setMessage("Focus session started!");
    } catch (error) {
      console.error(error);
      setMessage("Error starting session.");
    }
  };

  // Complete Focus Session
  const completeSession = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.completeSession();
      await tx.wait();
      setMessage("Focus session completed! ETH refunded.");
    } catch (error) {
      console.error(error);
      setMessage("Error completing session.");
    }
  };

  // Exit Early with Penalty
  const exitSessionEarly = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.exitEarly();
      await tx.wait();
      setMessage("Exited early. Penalty applied.");
    } catch (error) {
      console.error(error);
      setMessage("Error exiting early.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🌿 Ethereal: Stay Focused, Earn Rewards ✨</h1>

      <label>Stake Amount (ETH):</label>
      <input type="text" value={stake} onChange={(e) => setStake(e.target.value)} />

      <br />

      <label>Focus Duration (minutes):</label>
      <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />

      <br />

      <button onClick={startFocusSession}>Start Focus Session</button>
      <button onClick={completeSession}>Complete Session</button>
      <button onClick={exitSessionEarly}>Exit Early</button>

      <p>{message}</p>
    </div>
  );
};

export default App;
