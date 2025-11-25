import React from 'react';
import { TransactionStatus } from '../types';
import { IconBack, IconLocation, IconSuccess, IconPending, IconFailed, IconDownload } from './Icons';

interface Props {
  reference: string;
  status: TransactionStatus;
  date: string;
  location: string;
}

const TransactionHeader: React.FC<Props> = ({ reference, status, date, location }) => {
  const getStatusColor = (s: TransactionStatus) => {
    switch (s) {
      case TransactionStatus.APPROVED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case TransactionStatus.FAILED: return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = (s: TransactionStatus) => {
    switch (s) {
      case TransactionStatus.APPROVED: return <IconSuccess />;
      case TransactionStatus.FAILED: return <IconFailed />;
      default: return <IconPending />;
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
              <IconBack />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900">Funds In</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                  {status}
                </span>
              </div>
              <div className="text-sm text-slate-500 mt-1 flex items-center gap-3">
                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">Ref: {reference}</span>
                <span className="text-slate-300">|</span>
                <span>{date}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {location && (
               <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                <IconLocation />
                Show on map
              </a>
            )}
            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors">
               <IconDownload />
               Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHeader;
