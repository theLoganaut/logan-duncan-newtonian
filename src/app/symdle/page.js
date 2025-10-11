"use client"
import "../globals.css"
import KeyboardLayout from "./Keyboard";
import MainView from "./MainView";

export default function Home() {
  return (
    <div className="bg-[#0a0a0a]">
      <MainView />
      <KeyboardLayout />
    </div>
  );
}
