import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] flex flex-col items-center">
    <div className="w-full flex justify-center pt-8 pb-4">
      <div className="max-w-2xl w-full rounded-2xl bg-[#1e293b] shadow-2xl px-8 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-[#38bdf8] tracking-tight">Prompt Library</div>
        <div className="text-md font-semibold text-[#38bdf8]">davidgonzalezfx</div>
      </div>
    </div>
    <main className="max-w-2xl w-full mx-auto p-8">{children}</main>
  </div>
);

export default Layout; 
