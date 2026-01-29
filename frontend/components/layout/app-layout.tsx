"use client";

import React from "react";
import AppHeader from "./app-header"; // Adjust path if your header is elsewhere

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      
      {/* 1. Top Navigation Header (with User Avatar) */}
      <AppHeader />

      {/* 2. Main Content Area */}
      {/* flex-1 ensures this takes up remaining height if content is short */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

    </div>
  );
}