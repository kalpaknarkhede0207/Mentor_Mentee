'use client';

import React from 'react';
import { RagStatus } from '@/types/mentorship';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RagBadgeProps {
  status: RagStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  labelOverride?: string;
}

export function RagBadge({ status, showIcon = true, size = 'md', labelOverride }: RagBadgeProps) {
  const configs = {
    GREEN: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      label: 'Compliant / Stable',
      icon: ShieldCheck,
      ring: 'ring-emerald-500/20'
    },
    AMBER: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Attention Required',
      icon: AlertTriangle,
      ring: 'ring-amber-500/20'
    },
    RED: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500 animate-pulse',
      label: 'Red Alert Triage',
      icon: ShieldAlert,
      ring: 'ring-rose-500/30'
    }
  };

  const current = configs[status] || configs.GREEN;
  const Icon = current.icon;

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm transition-all ${current.bg} ${sizeStyles[size]} ${current.ring} ring-1`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{labelOverride || current.label}</span>
    </span>
  );
}
