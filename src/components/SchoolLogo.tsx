/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

const SCHOOL_LOGO_URL =
  "https://qgskdqciztiutibzmhqf.supabase.co/storage/v1/object/public/SiberSagaWeb/Logo%20SDN%203%20Purwosari.png";

interface SchoolLogoProps {
  className?: string;
  size?: number;
}

export default function SchoolLogo({ className = "", size = 48 }: SchoolLogoProps) {
  return (
    <img
      src={SCHOOL_LOGO_URL}
      alt="Logo SDN 3 Purwosari"
      width={size}
      height={size}
      className={`select-none object-contain ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}
