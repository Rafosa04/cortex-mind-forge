
import React, { useState } from "react";
import { motion } from "framer-motion";

interface FeedTabsProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function FeedTabs({ activeTab, onChange }: FeedTabsProps) {
  const tabs = [
    { id: "feed", label: "Feed" },
    { id: "trending", label: "Em Alta" },
    { id: "following", label: "Seguindo" }
  ];

  return (
    <div className="flex w-full border-b border-border mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id ? "text-primary" : "text-foreground/70 hover:text-foreground"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              layoutId="activeTab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
