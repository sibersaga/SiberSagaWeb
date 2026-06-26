import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

export const CounterBlockConfig = {
  fields: {
    targetNumber: { type: "number" as const },
    prefix: { type: "text" as const },
    suffix: { type: "text" as const },
    duration: { type: "number" as const }, // seconds
    color: { type: "text" as const },
    fontSize: { type: "text" as const },
  },
  defaultProps: {
    targetNumber: 1000,
    prefix: "",
    suffix: "+",
    duration: 2,
    color: "#2563eb",
    fontSize: "3rem",
  },
  render: ({ targetNumber, prefix, suffix, duration, color, fontSize }: any) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * targetNumber));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }, [targetNumber, duration]);

    return (
      <div style={{ textAlign: "center", width: "100%" }}>
        <div style={{ fontSize, color, fontWeight: "bold", lineHeight: 1 }}>
          {prefix}{count}{suffix}
        </div>
      </div>
    );
  },
};

export const ProgressBarBlockConfig = {
  fields: {
    title: { type: "text" as const },
    percentage: { type: "number" as const },
    barColor: { type: "text" as const },
    bgColor: { type: "text" as const },
    height: { type: "text" as const },
  },
  defaultProps: {
    title: "Web Development",
    percentage: 85,
    barColor: "#2563eb",
    bgColor: "#e2e8f0",
    height: "12px",
  },
  render: ({ title, percentage, barColor, bgColor, height }: any) => {
    return (
      <div style={{ width: "100%", marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontWeight: 600 }}>{title}</span>
          <span>{percentage}%</span>
        </div>
        <div style={{ width: "100%", backgroundColor: bgColor, height, borderRadius: "999px", overflow: "hidden" }}>
          <div
            style={{
              width: `${percentage}%`,
              backgroundColor: barColor,
              height: "100%",
              transition: "width 1s ease-in-out",
            }}
          />
        </div>
      </div>
    );
  },
};

export const StarRatingBlockConfig = {
  fields: {
    rating: { type: "number" as const }, // 0 to 5
    maxRating: { type: "number" as const },
    size: { type: "number" as const },
    activeColor: { type: "text" as const },
    inactiveColor: { type: "text" as const },
    alignment: {
      type: "radio" as const,
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  },
  defaultProps: {
    rating: 4.5,
    maxRating: 5,
    size: 24,
    activeColor: "#fbbf24", // amber-400
    inactiveColor: "#e5e7eb", // gray-200
    alignment: "left",
  },
  render: ({ rating, maxRating, size, activeColor, inactiveColor, alignment }: any) => {
    const justify = alignment === "left" ? "flex-start" : alignment === "right" ? "flex-end" : "center";
    
    return (
      <div style={{ display: "flex", gap: "4px", justifyContent: justify, width: "100%" }}>
        {Array.from({ length: maxRating }).map((_, i) => {
          const fillPercentage = Math.max(0, Math.min(1, rating - i)) * 100;
          return (
            <div key={i} style={{ position: "relative", width: size, height: size }}>
              {/* Inactive Star */}
              <Star size={size} color={inactiveColor} fill={inactiveColor} className="absolute inset-0" />
              {/* Active Star Overlay (Clip Path for partial stars) */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", width: `${fillPercentage}%` }}>
                <Star size={size} color={activeColor} fill={activeColor} />
              </div>
            </div>
          );
        })}
      </div>
    );
  },
};

export const TestimonialBlockConfig = {
  fields: {
    quote: { type: "textarea" as const },
    authorName: { type: "text" as const },
    authorTitle: { type: "text" as const },
    avatarUrl: { type: "text" as const },
    alignment: {
      type: "radio" as const,
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
      ],
    },
  },
  defaultProps: {
    quote: "Layanan yang diberikan sangat luar biasa dan profesional.",
    authorName: "Budi Santoso",
    authorTitle: "CEO PT Maju Bersama",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    alignment: "center",
  },
  render: ({ quote, authorName, authorTitle, avatarUrl, alignment }: any) => {
    return (
      <div style={{ textAlign: alignment, display: "flex", flexDirection: "column", alignItems: alignment === "center" ? "center" : "flex-start", gap: "1rem" }}>
        <p style={{ fontSize: "1.125rem", fontStyle: "italic", color: "#4b5563" }}>"{quote}"</p>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src={avatarUrl} alt={authorName} style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }} />
          <div style={{ textAlign: "left" }}>
            <h4 style={{ margin: 0, fontWeight: "bold" }}>{authorName}</h4>
            <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>{authorTitle}</span>
          </div>
        </div>
      </div>
    );
  },
};

export const ReviewBlockConfig = {
  fields: {
    ...TestimonialBlockConfig.fields,
    rating: { type: "number" as const },
  },
  defaultProps: {
    ...TestimonialBlockConfig.defaultProps,
    rating: 5,
  },
  render: (props: any) => {
    return (
      <div style={{ textAlign: props.alignment, display: "flex", flexDirection: "column", alignItems: props.alignment === "center" ? "center" : "flex-start", gap: "1rem" }}>
        <StarRatingBlockConfig.render rating={props.rating} maxRating={5} size={20} activeColor="#fbbf24" inactiveColor="#e5e7eb" alignment={props.alignment} />
        <TestimonialBlockConfig.render {...props} />
      </div>
    );
  }
};
