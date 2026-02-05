
import React from 'react';

export const COLORS = {
  sakura: '#f3a6b1',
  mimosa: '#fce8a4',
  cream: '#fffcf9',
  brown: '#5d4037',
  earth: '#8b735b',
  sage: '#f3a6b1',
  beige: '#fce8a4'
};

export const WaveDivider = ({ flip = false, color = COLORS.cream }: { flip?: boolean, color?: string }) => (
  <div className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''}`} style={{ backgroundColor: 'transparent' }}>
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]">
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill={color}></path>
    </svg>
  </div>
);

export const HandDoodle = {
  Tree: () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke={COLORS.sakura} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
      <path d="M20 35V15" />
      <path d="M20 15C20 15 10 12 10 8C10 4 15 4 20 8C25 4 30 4 30 8C30 12 20 15 20 15Z" />
      <path d="M12 22C12 22 5 20 5 17C5 14 8 14 12 17" />
      <path d="M28 22C28 22 35 20 35 17C35 14 32 14 28 17" />
    </svg>
  ),
  Paw: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={COLORS.sakura} className="opacity-20">
      <circle cx="8" cy="10" r="2.5" />
      <circle cx="12" cy="7" r="2.5" />
      <circle cx="16" cy="10" r="2.5" />
      <path d="M12 20c-3 0-5-2-5-5 0-2.5 2.5-4 5-4s5 1.5 5 4c0 3-2 5-5 5z" />
    </svg>
  )
};
