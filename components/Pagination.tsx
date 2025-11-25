
import React from 'react';
import { IconChevronLeft, IconChevronRight } from './Icons';

const Pagination: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-900">1</span> to <span className="font-medium text-slate-900">50</span> of <span className="font-medium text-slate-900">3,248</span> results
      </div>
      
      <div className="flex items-center gap-2">
        <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
          <IconChevronLeft />
        </button>
        
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium bg-slate-900 text-white">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">3</button>
          <span className="text-slate-400 px-1">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">64</button>
