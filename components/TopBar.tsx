import React from 'react';
import { IconGlobe, IconChevronDown, IconLogout, IconPending } from './Icons';

const TopBar = () => {
  return (
    <header className="h-14 bg-black text-white flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="font-bold text-xl tracking-tighter flex items-center gap-1">
             <span className="text-white">VERY</span>
             <span className="text-white font-light">PAY</span>
          </div>
          <span className="text-[10px] text-gray-400 mt-1">A Verysell Group Company</span>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer transition-colors">
          <span>Tenants</span>
          <IconChevronDown />
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="hidden md:flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
          <IconGlobe />
          <span>English</span>
          <IconChevronDown />
        </div>

        <div className="hidden md:flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
          <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
            <span className="font-bold">NN</span>
          </div>
          <span>Nguyễn Nam</span>
          <IconChevronDown />
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-900 rounded border border-gray-800">
          <IconPending />
          <span className="font-mono">09:55</span>
        </div>

        <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
          <span>Sign out</span>
          {/* <IconLogout /> */}
        </button>
      </div>
    </header>
  );
};

export default TopBar;