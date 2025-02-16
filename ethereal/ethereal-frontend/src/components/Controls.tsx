import React from "react";
import { Clock, DollarSign } from "lucide-react";

interface ControlsProps {
  stake: string;
  setStake: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  onStart: () => void;
  onComplete: () => void;
  onExit: () => void;
  isActive: boolean;
}

export const Controls = ({
  stake,
  setStake,
  duration,
  setDuration,
  onStart,
  onComplete,
  onExit,
  isActive,
}: ControlsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Stake Amount Input */}
        <div className="relative">
          <DollarSign
            className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-200"
            size={20}
          />
          <input
            type="number"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            placeholder="ETH Stake Amount"
            className="w-full px-10 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
          />
        </div>

        {/* Duration Dropdown */}
        <div className="relative">
          <Clock
            className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-200"
            size={20}
          />
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-10 py-3 bg-white/10 rounded-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
          >
            <option value={25}>25 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-4">
        <button
          onClick={onStart}
          disabled={isActive}
          className="w-full py-3 rounded-lg bg-violet-500 text-white font-medium hover:bg-violet-600 transition-colors disabled:opacity-50"
        >
          Start
        </button>
        <button
          onClick={onComplete}
          disabled={!isActive}
          className="w-full py-3 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 transition-colors disabled:opacity-50"
        >
          Complete
        </button>
        <button
          onClick={onExit}
          className="w-full py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
        >
          Exit
        </button>
      </div>
    </div>
  );
};