"use client"
import Sidebar from './sidebar';
import pythonDocs from '../data/pythonDocs';
import dynamic from 'next/dynamic';
import "../globals.css"
import docudleData from '../data/pythonDocs.json';

export default function DocudleLayout({ children }) {
  return (
    <div className="flex bg-[#0a0a0a] h-screen">
      <Sidebar data={docudleData} />
      {children}
    </div>
  );
}