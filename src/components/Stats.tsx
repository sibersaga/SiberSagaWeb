/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Users, GraduationCap, School, Trophy } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

// Helper map to dynamically resolve Lucide Icons
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Users: Users,
  GraduationCap: GraduationCap,
  School: School,
  Trophy: Trophy,
};

function StatCard({ id, count, suffix, label, iconName }: { key?: string; id: string; count: number; suffix?: string; label: string; iconName: string }) {
  const [currentCount, setCurrentCount] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const IconComponent = iconMap[iconName] || Users;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isIntersecting) return;

    let startTime: number | null = null;
    const durationCount = 1600; // Duration of animation in milliseconds

    let animationFrameId: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / durationCount, 1);
      
      // Smooth easeOutQuad easing function
      const easeOutQuad = percentage * (2 - percentage);
      const current = Math.floor(easeOutQuad * count);
      
      setCurrentCount(current);

      if (progress < durationCount) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setCurrentCount(count);
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isIntersecting, count]);

  let cardStyle = "bg-white text-brand-navy border border-slate-150 shadow-md";
  let badgeStyle = "bg-brand-sky/10 text-brand-sky";
  let countStyle = "text-brand-navy";
  let labelStyle = "text-[#64748B]";
  let suffixStyle = "text-brand-sky";

  if (id === "students") {
    cardStyle = "bg-brand-sky text-white shadow-xl shadow-brand-sky/20";
    badgeStyle = "bg-white/20 text-white";
    countStyle = "text-white";
    labelStyle = "text-white/80";
    suffixStyle = "text-[#FBBF24]";
  } else if (id === "teachers") {
    cardStyle = "bg-brand-navy text-white shadow-lg";
    badgeStyle = "bg-white/10 text-white";
    countStyle = "text-white";
    labelStyle = "text-white/80";
    suffixStyle = "text-[#FBBF24]";
  } else if (id === "classrooms") {
    cardStyle = "bg-[#FBBF24] text-brand-navy shadow-lg shadow-yellow-101/40";
    badgeStyle = "bg-white/40 text-brand-navy";
    countStyle = "text-brand-navy";
    labelStyle = "text-brand-navy/80 font-bold";
    suffixStyle = "text-brand-sky";
  }

  return (
    <div ref={cardRef} className={`relative overflow-hidden p-6 md:p-8 rounded-[32px] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-5 ${cardStyle}`}>
      {/* Decorative background element */}
      <div className="absolute -right-3 -bottom-3 opacity-10">
        <IconComponent size={96} strokeWidth={1} />
      </div>

      {/* Brand Icon Badge */}
      <div className={`p-4 rounded-2xl flex items-center justify-center relative z-10 ${badgeStyle}`}>
        <IconComponent size={24} strokeWidth={2} />
      </div>

      {/* Texts and counter */}
      <div className="flex flex-col relative z-20">
        <span className={`text-3xl md:text-4xl font-heading font-extrabold tracking-tight ${countStyle}`}>
          {currentCount}
          <span className={`font-bold ml-0.5 ${suffixStyle}`}>{suffix}</span>
        </span>
        <span className={`text-xs md:text-sm font-bold uppercase tracking-wider mt-1 leading-tight ${labelStyle}`}>
          {label}
        </span>
      </div>
    </div>
  );
}

export default function Stats() {
  const { stats } = useAdmin();
  return (
    <section className="py-12 bg-brand-light">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              id={stat.id}
              count={stat.count}
              suffix={stat.suffix}
              label={stat.label}
              iconName={stat.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
