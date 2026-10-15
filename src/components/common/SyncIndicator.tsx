import React from 'react';
import { Cloud, CloudOff, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { usePteData } from '../../context/PteDataContext';

export const SyncIndicator: React.FC = () => {
  const { syncStatus, isConnected, lastSavedAt } = usePteData();

  if (!isConnected || syncStatus === 'offline') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30">
        <CloudOff className="w-3.5 h-3.5 animate-pulse" />
        <span>Offline</span>
      </div>
    );
  }

  if (syncStatus === 'syncing') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        <span>Syncing...</span>
      </div>
    );
  }

  if (syncStatus === 'error') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Sync Error</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-help"
      title={lastSavedAt ? `Saved to Firebase at ${lastSavedAt}` : 'Saved to Firebase'}
    >
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>Saved to RTDB</span>
    </div>
  );
};
