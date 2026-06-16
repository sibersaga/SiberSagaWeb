/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface SchoolLogoProps {
  className?: string;
  size?: number;
}

export default function SchoolLogo({ className = "", size = 48 }: SchoolLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        {/* Clip path to clip the red and white sections into the gunungan shape */}
        <clipPath id="gunungan-clip">
          <path d="M 150,15 L 255,170 C 275,190 285,210 270,240 C 255,270 220,290 190,290 C 170,290 130,290 110,290 C 80,290 45,270 30,240 C 15,210 25,190 45,170 Z" />
        </clipPath>
      </defs>

      {/* 1. Background Fill and Colors clipped to Gunungan shape */}
      {/* Upper Red Section */}
      <rect
        x="0"
        y="0"
        width="300"
        height="172"
        fill="#DC2626"
        clipPath="url(#gunungan-clip)"
      />
      {/* Lower White Section */}
      <rect
        x="0"
        y="172"
        width="300"
        height="150"
        fill="#FFFFFF"
        clipPath="url(#gunungan-clip)"
      />

      {/* 2. Gunungan Outer Border */}
      <path
        d="M 150,15 L 255,170 C 275,190 285,210 270,240 C 255,270 220,290 190,290 C 170,290 130,290 110,290 C 80,290 45,270 30,240 C 15,210 25,190 45,170 Z"
        fill="none"
        stroke="#1E293B"
        strokeWidth="6"
        strokeLinejoin="round"
      />

      {/* 3. Tut Wuri Handayani Center Emblem (Yellow Winged Logo) */}
      {/* Main wing shell */}
      <path
        d="M 150,70 L 162,88 C 164,87 167,86 170,86 L 176,104 C 182,102 188,100 194,100 L 190,118 C 192,125 193,130 191,136 C 188,144 175,152 165,154 C 158,155 154,160 150,166 C 146,160 142,155 135,154 C 125,152 112,144 109,136 C 107,130 108,125 110,118 L 106,100 C 112,100 118,102 124,104 L 130,86 C 133,86 136,87 138,88 Z"
        fill="#FFE600"
        stroke="#1E293B"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Right Wing feathers internal detail */}
      <path
        d="M 158,118 C 172,112 188,118 190,126"
        fill="none"
        stroke="#1E293B"
        strokeWidth="2.5"
      />
      <path
        d="M 158,126 C 170,121 184,127 186,133"
        fill="none"
        stroke="#1E293B"
        strokeWidth="2.5"
      />

      {/* Left Wing feathers internal detail */}
      <path
        d="M 142,118 C 128,112 112,118 110,126"
        fill="none"
        stroke="#1E293B"
        strokeWidth="2.5"
      />
      <path
        d="M 142,126 C 130,121 116,127 114,133"
        fill="none"
        stroke="#1E293B"
        strokeWidth="2.5"
      />

      {/* Central Flame / Torch */}
      <path
        d="M 150,92 C 144,110 144,136 150,146 C 156,136 156,110 150,92 Z"
        fill="#FFE600"
        stroke="#1E293B"
        strokeWidth="3"
      />
      <path
        d="M 150,106 C 147,118 147,130 150,136 C 153,130 153,118 150,106 Z"
        fill="#FFFFFF"
        stroke="#1E293B"
        strokeWidth="1.5"
      />

      {/* Open book at emblem bottom */}
      <path
        d="M 132,154 Q 150,148 168,154 L 168,161 Q 150,155 132,161 Z"
        fill="#FFFFFF"
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <line x1="150" y1="151" x2="150" y2="158" stroke="#1E293B" strokeWidth="2" />


      {/* 4. Book Pages at the bottom (White/Red boundary) */}
      {/* Thick book bases */}
      <path
        d="M 150,215 C 120,215 85,210 65,172"
        fill="none"
        stroke="#1E293B"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M 150,215 C 180,215 215,210 235,172"
        fill="none"
        stroke="#1E293B"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Left side book pages (Blue, Green, Red) */}
      <path
        d="M 150,210 C 135,200 110,195 95,172"
        fill="none"
        stroke="#2563EB"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M 150,210 C 130,205 100,200 83,172"
        fill="none"
        stroke="#16A34A"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M 150,210 C 125,210 90,205 71,172"
        fill="none"
        stroke="#DC2626"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Right side book pages (Green, Blue, Red) */}
      <path
        d="M 150,210 C 165,200 190,195 205,172"
        fill="none"
        stroke="#16A34A"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M 150,210 C 170,205 200,200 217,172"
        fill="none"
        stroke="#2563EB"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M 150,210 C 175,210 210,205 229,172"
        fill="none"
        stroke="#DC2626"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Orange Rising Sun arc at the bottom center of book */}
      <path
        d="M 138,210 A 12,12 0 0,1 162,210"
        fill="none"
        stroke="#F97316"
        strokeWidth="5"
        strokeLinecap="round"
      />


      {/* 5. School Text in the bottom white bulge */}
      <text
        x="150"
        y="246"
        textAnchor="middle"
        fill="#1E293B"
        fontSize="16.5"
        fontWeight="800"
        fontFamily="Georgia, 'Times New Roman', serif"
        letterSpacing="-0.2"
      >
        sd n 3 purwosari
      </text>
      
      {/* Text underline */}
      <line
        x1="70"
        y1="252"
        x2="230"
        y2="252"
        stroke="#1E293B"
        strokeWidth="2.5"
      />

      <text
        x="150"
        y="272"
        textAnchor="middle"
        fill="#1E293B"
        fontSize="12.5"
        fontWeight="800"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="0.8"
      >
        KABUPATEN WONOGIRI
      </text>

      {/* Double underline at the bottom */}
      <line
        x1="70"
        y1="278"
        x2="230"
        y2="278"
        stroke="#1E293B"
        strokeWidth="1.5"
      />
      <line
        x1="70"
        y1="281"
        x2="230"
        y2="281"
        stroke="#1E293B"
        strokeWidth="1.5"
      />
    </svg>
  );
}
