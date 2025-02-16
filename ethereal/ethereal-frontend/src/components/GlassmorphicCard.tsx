import React from "react";
interface GlassmorphicCardProps {
  children: React.ReactNode;
}
export const GlassmorphicCard = ({ children }: GlassmorphicCardProps) => {
  return (
    <div className="backdrop-blur-lg bg-white/20 rounded-3xl p-8 shadow-lg border border-white/20 transition-all duration-300">
      {children}
    </div>
  );
};
