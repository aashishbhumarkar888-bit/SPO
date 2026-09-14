import React, { useState } from 'react';
import { ShieldCheck, Info, Sparkles, ExternalLink } from 'lucide-react';
import { IntegrationStatusBadge } from '../../types';

export const INTEGRATION_DEFINITIONS: Record<IntegrationStatusBadge, { title: string; desc: string }> = {
  'LIVE': {
    title: 'LIVE',
    desc: 'Function is actually executable in the current prototype/system.'
  },
  'SYNCED': {
    title: 'SYNCED',
    desc: 'Data/function works locally or through an implemented synchronization mechanism.'
  },
  'INTEGRATION-READY': {
    title: 'INTEGRATION-READY',
    desc: 'UI/data contract is prepared, but external production service is not connected.'
  },
  'PROPOSED': {
    title: 'PROPOSED',
    desc: 'Conceptual/future capability; not implemented.'
  }
};

interface IntegrationBadgeProps {
  status: IntegrationStatusBadge;
  spec?: string;
  featureName?: string;
  featureId?: string;
  variant?: 'badge' | 'indicator';
  onClick?: () => void;
  className?: string;
}

export const IntegrationBadge: React.FC<IntegrationBadgeProps> = ({
  status,
  spec,
  featureName,
  featureId,
  variant = 'badge',
  onClick,
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      window.dispatchEvent(
        new CustomEvent('open-sih-audit', {
          detail: { featureId }
        })
      );
    }
  };

  const getBadgeStyle = () => {
    switch (status) {
      case 'LIVE':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300/80 hover:bg-emerald-100 hover:border-emerald-400';
      case 'SYNCED':
        return 'bg-sky-50 text-sky-900 border-sky-300/80 hover:bg-sky-100 hover:border-sky-400';
      case 'INTEGRATION-READY':
        return 'bg-purple-50 text-purple-900 border-purple-300/80 hover:bg-purple-100 hover:border-purple-400';
      case 'PROPOSED':
      default:
        return 'bg-amber-50 text-amber-900 border-amber-300/80 hover:bg-amber-100 hover:border-amber-400';
    }
  };

  const getDotColor = () => {
    switch (status) {
      case 'LIVE':
        return 'bg-emerald-600 animate-pulse';
      case 'SYNCED':
        return 'bg-sky-600';
      case 'INTEGRATION-READY':
        return 'bg-purple-600';
      case 'PROPOSED':
      default:
        return 'bg-amber-600';
    }
  };

  const definition = INTEGRATION_DEFINITIONS[status];

  // System State Indicator style (for important screens)
  if (variant === 'indicator') {
    return (
      <div className="relative inline-block">
        <button
          type="button"
          onClick={handleClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono tracking-tight transition-all active:scale-95 shadow-2xs cursor-pointer ${getBadgeStyle()} ${className}`}
        >
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getDotColor()}`} />
          {featureName && <span className="font-sans font-semibold text-slate-900">{featureName} ·</span>}
          <span className="font-bold uppercase tracking-wider">{status}</span>
          {spec && (
            <>
              <span className="opacity-40">·</span>
              <span className="font-medium text-slate-700">{spec}</span>
            </>
          )}
          <Info className="w-3 h-3 opacity-60 ml-0.5" />
        </button>

        {showTooltip && (
          <div className="absolute z-50 bottom-full mb-1.5 left-1/2 -translate-x-1/2 w-64 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-left border border-slate-700 pointer-events-none text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-mono font-bold text-[10px] uppercase mb-1">
              <span>{definition.title} DEFINITION</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-snug">{definition.desc}</p>
            <div className="mt-1.5 pt-1.5 border-t border-slate-700 text-[10px] text-emerald-400 font-mono">
              Click to view complete 8-point SIH tech audit
            </div>
          </div>
        )}
      </div>
    );
  }

  // Compact badge style
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold tracking-tight transition-all active:scale-95 shadow-2xs cursor-pointer ${getBadgeStyle()} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getDotColor()}`} />
        <span>{status}</span>
        {spec && (
          <span className="opacity-80 font-normal border-l border-current/20 pl-1 hidden sm:inline text-slate-700">
            {spec}
          </span>
        )}
      </button>

      {showTooltip && (
        <div className="absolute z-50 bottom-full mb-1.5 left-1/2 -translate-x-1/2 w-64 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-left border border-slate-700 pointer-events-none text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-mono font-bold text-[10px] uppercase mb-1">
            <span>{definition.title} DEFINITION</span>
          </div>
          <p className="text-[11px] text-slate-200 leading-snug">{definition.desc}</p>
          <div className="mt-1.5 pt-1.5 border-t border-slate-700 text-[10px] text-emerald-400 font-mono">
            Click to inspect integration dossier
          </div>
        </div>
      )}
    </div>
  );
};

