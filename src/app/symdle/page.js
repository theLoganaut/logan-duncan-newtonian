"use client"
import dynamic from 'next/dynamic';
import "../globals.css"

// Disable SSR for both components
const MainView = dynamic(() => import('./MainView'), { ssr: false });
const KeyboardLayout = dynamic(() => import('./Keyboard'), { ssr: false });

export default function Home() {
  return (
    <div className="bg-[#0a0a0a]">
      <MainView />
      <KeyboardLayout />
    </div>
  );
}