import React from 'react';

/**
 * APMC Mandi Procurement Yard & Grain Truck Illustration
 * Faithfully matches the hero visual in the design reference
 */
export const MandiProcurementYardIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => {
  return (
    <svg 
      viewBox="0 0 420 220" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="APMC Smart Mandi Procurement Yard Illustration"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E6F4ED" />
          <stop offset="100%" stopColor="#CBE9DA" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0B5D3B" />
          <stop offset="100%" stopColor="#168A5B" />
        </linearGradient>
        <linearGradient id="truckBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0D633D" />
          <stop offset="100%" stopColor="#1F9464" />
        </linearGradient>
        <linearGradient id="wheatSack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2B771" />
          <stop offset="100%" stopColor="#C89647" />
        </linearGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Background Soft Sky & Landscape Hills */}
      <rect x="0" y="0" width="420" height="220" rx="20" fill="url(#skyGrad)" />
      
      {/* Sun & Cloud Accent */}
      <circle cx="370" cy="45" r="22" fill="#FBBF24" opacity="0.85" />
      <path d="M40 38 Q55 24 75 32 Q95 24 110 38 Q125 45 118 56 Q110 65 95 62 Q80 66 65 62 Q50 65 42 56 Q35 48 40 38 Z" fill="#FFFFFF" opacity="0.7" />

      {/* Gentle Distant Green Hills */}
      <path d="M0 160 Q110 130 230 150 Q330 135 420 165 L420 220 L0 220 Z" fill="#A7D7C1" />
      <path d="M0 175 Q140 155 260 170 Q360 155 420 180 L420 220 L0 220 Z" fill="#8AC8AE" />

      {/* Ground Mandi Yard Tarmac */}
      <path d="M0 190 L420 190 L420 220 L0 220 Z" fill="#4B6559" />
      <line x1="20" y1="205" x2="70" y2="205" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="10 8" opacity="0.6" />
      <line x1="120" y1="205" x2="200" y2="205" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="10 8" opacity="0.6" />
      <line x1="250" y1="205" x2="400" y2="205" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="10 8" opacity="0.6" />

      {/* APMC Mandi Procurement Building (Back Left) */}
      <g filter="url(#softShadow)">
        {/* Main Mandi Shed Pillars */}
        <rect x="25" y="80" width="130" height="95" rx="4" fill="#FFFFFF" />
        {/* Slanted Green Industrial Shed Roof */}
        <polygon points="15,80 90,45 165,80" fill="url(#roofGrad)" />
        {/* Mandi Signboard */}
        <rect x="35" y="88" width="110" height="20" rx="3" fill="#063B2A" />
        <text x="90" y="102" fill="#FBBF24" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          APMC SMART MANDI
        </text>
        {/* Rolling Shutter Gate */}
        <rect x="45" y="118" width="40" height="57" rx="2" fill="#E2ECE7" stroke="#A7C7B8" strokeWidth="1.5" />
        <line x1="45" y1="128" x2="85" y2="128" stroke="#A7C7B8" strokeWidth="1" />
        <line x1="45" y1="138" x2="85" y2="138" stroke="#A7C7B8" strokeWidth="1" />
        <line x1="45" y1="148" x2="85" y2="148" stroke="#A7C7B8" strokeWidth="1" />
        <line x1="45" y1="158" x2="85" y2="158" stroke="#A7C7B8" strokeWidth="1" />

        {/* Weighbridge Digital Display Board */}
        <rect x="98" y="122" width="42" height="26" rx="3" fill="#0D2E21" />
        <rect x="103" y="126" width="32" height="12" rx="2" fill="#061A12" />
        <text x="119" y="135" fill="#34D399" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          82.40 Q
        </text>
        <rect x="117" y="148" width="4" height="27" fill="#8DAEA1" />
      </g>

      {/* Stack of Jute Grain Sacks (Next to shed) */}
      <g filter="url(#softShadow)">
        <ellipse cx="175" cy="180" rx="16" ry="7" fill="url(#wheatSack)" />
        <ellipse cx="195" cy="180" rx="16" ry="7" fill="url(#wheatSack)" />
        <ellipse cx="185" cy="172" rx="15" ry="6" fill="url(#wheatSack)" />
        <ellipse cx="205" cy="173" rx="14" ry="6" fill="url(#wheatSack)" />
        <ellipse cx="195" cy="164" rx="13" ry="5" fill="url(#wheatSack)" />
      </g>

      {/* Modern Agricultural Grain Truck (Loaded with Golden Wheat Sacks) */}
      <g filter="url(#softShadow)">
        {/* Truck Cargo Bed */}
        <rect x="235" y="120" width="135" height="52" rx="4" fill="url(#truckBody)" />
        {/* Cargo Side Railing Accents */}
        <line x1="235" y1="135" x2="370" y2="135" stroke="#E7F7EF" strokeWidth="1.5" opacity="0.8" />
        <line x1="235" y1="150" x2="370" y2="150" stroke="#E7F7EF" strokeWidth="1.5" opacity="0.8" />

        {/* Stacked Grain Sacks Inside Truck */}
        <ellipse cx="258" cy="116" rx="14" ry="7" fill="url(#wheatSack)" />
        <ellipse cx="282" cy="115" rx="14" ry="7" fill="url(#wheatSack)" />
        <ellipse cx="306" cy="115" rx="14" ry="7" fill="url(#wheatSack)" />
        <ellipse cx="330" cy="116" rx="14" ry="7" fill="url(#wheatSack)" />
        <ellipse cx="270" cy="107" rx="13" ry="6" fill="url(#wheatSack)" />
        <ellipse cx="294" cy="106" rx="13" ry="6" fill="url(#wheatSack)" />
        <ellipse cx="318" cy="107" rx="13" ry="6" fill="url(#wheatSack)" />

        {/* Truck Cabin (Front) */}
        <path d="M370 125 L395 125 L405 145 L405 172 L370 172 Z" fill="#0D5A38" />
        {/* Windshield */}
        <polygon points="375,130 392,130 398,145 375,145" fill="#CBE9DA" opacity="0.9" />
        {/* Headlight */}
        <circle cx="403" cy="160" r="3" fill="#FBBF24" />

        {/* Truck Wheels */}
        {/* Back Wheel 1 */}
        <circle cx="260" cy="177" r="14" fill="#1F2937" />
        <circle cx="260" cy="177" r="7" fill="#9CA3AF" />
        {/* Back Wheel 2 */}
        <circle cx="295" cy="177" r="14" fill="#1F2937" />
        <circle cx="295" cy="177" r="7" fill="#9CA3AF" />
        {/* Front Wheel */}
        <circle cx="385" cy="177" r="14" fill="#1F2937" />
        <circle cx="385" cy="177" r="7" fill="#9CA3AF" />
      </g>

      {/* Floating Badge Motto: "किसान की सुविधा हमारी प्राथमिकता" */}
      <g filter="url(#softShadow)">
        <rect x="200" y="24" width="205" height="34" rx="17" fill="#FFFFFF" stroke="#E2ECE7" strokeWidth="1.5" />
        {/* Green Leaf Circle */}
        <circle cx="218" cy="41" r="11" fill="#168A5B" />
        <path d="M214 43 Q218 36 223 38 Q222 44 214 43 Z" fill="#FBBF24" />
        {/* Slogan Text */}
        <text x="236" y="45" fill="#063B2A" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">
          "किसान की सुविधा हमारी प्राथमिकता"
        </text>
      </g>
    </svg>
  );
};

/**
 * Sidebar Farmer Graphic: Indian farmer in turban holding smartphone over green fields
 * Matches bottom of sidebar in the design reference
 */
export const SidebarFarmerGraphic: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => {
  return (
    <svg 
      viewBox="0 0 240 140" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="Smart Farmer Digital Agri Graphic"
    >
      <defs>
        <linearGradient id="farmSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#124A35" />
          <stop offset="100%" stopColor="#0B3726" />
        </linearGradient>
        <linearGradient id="fieldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E8256" />
          <stop offset="100%" stopColor="#0F5435" />
        </linearGradient>
      </defs>

      {/* Card Background */}
      <rect width="240" height="140" rx="16" fill="url(#farmSky)" />

      {/* Gentle Sunlight Rays */}
      <circle cx="190" cy="30" r="30" fill="#F59E0B" opacity="0.35" />
      <circle cx="190" cy="30" r="16" fill="#FBBF24" opacity="0.8" />

      {/* Lush Green Crop Rows */}
      <path d="M0 80 Q100 65 240 75 L240 140 L0 140 Z" fill="url(#fieldGrad)" />
      <path d="M0 98 Q110 85 240 95 L240 140 L0 140 Z" fill="#0A4229" />

      {/* Crop details (Wheat stalks) */}
      <line x1="20" y1="95" x2="20" y2="78" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="76" r="3" fill="#FBBF24" />
      <line x1="45" y1="102" x2="45" y2="85" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <circle cx="45" cy="83" r="3" fill="#FBBF24" />
      <line x1="170" y1="96" x2="170" y2="80" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <circle cx="170" cy="78" r="3" fill="#FBBF24" />
      <line x1="210" y1="105" x2="210" y2="88" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      <circle cx="210" cy="86" r="3" fill="#FBBF24" />

      {/* Farmer Figure (Indian Farmer in Saffron/Orange Turban with Smartphone) */}
      <g>
        {/* Body / Kurta */}
        <path d="M75 140 L85 105 L125 105 L135 140 Z" fill="#FFFFFF" opacity="0.95" />
        {/* Neckerchief / Angavastram (Green) */}
        <path d="M92 105 L96 135 L106 135 L102 105 Z" fill="#168A5B" />

        {/* Head & Neck */}
        <rect x="98" y="88" width="14" height="16" rx="4" fill="#C68642" />
        <ellipse cx="105" cy="80" rx="13" ry="14" fill="#D99B56" />

        {/* Saffron / Orange Turban (Pagdi) */}
        <ellipse cx="105" cy="68" rx="16" ry="10" fill="#EA580C" />
        <ellipse cx="105" cy="64" rx="14" ry="8" fill="#F97316" />
        <path d="M92 70 Q105 60 118 70 Q105 78 92 70 Z" fill="#FB923C" />

        {/* Right Arm holding Smartphone */}
        <path d="M125 108 L138 98 L134 86" stroke="#D99B56" strokeWidth="6" strokeLinecap="round" />
        {/* Smartphone */}
        <rect x="127" y="78" width="12" height="19" rx="2.5" fill="#1E293B" />
        <rect x="129" y="80" width="8" height="13" rx="1" fill="#38BDF8" />
      </g>

      {/* Bottom Text Pill: "🌱 स्मार्ट किसान सशक्त किसान >" */}
      <rect x="14" y="106" width="212" height="26" rx="13" fill="#062B1E" stroke="#168A5B" strokeWidth="1" />
      <text x="120" y="123" fill="#FBBF24" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        🌱 स्मार्ट किसान सशक्त किसान ❯
      </text>
    </svg>
  );
};
