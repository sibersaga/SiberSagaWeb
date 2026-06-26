import React, { useState, useEffect } from "react";
import { Check, X, ChevronDown, Bell } from "lucide-react";
import { DropZone } from "@puckeditor/core";

export const PricingTableBlockConfig = {
  fields: {
    title: { type: "text" as const },
    price: { type: "text" as const },
    period: { type: "text" as const },
    features: {
      type: "array" as const,
      arrayFields: {
        text: { type: "text" as const },
        included: { type: "radio" as const, options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }] },
      },
    },
    buttonText: { type: "text" as const },
    isHighlighted: { type: "radio" as const, options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }] },
  },
  defaultProps: {
    title: "Pro Plan",
    price: "$29",
    period: "/month",
    features: [
      { text: "5 Projects", included: "true" },
      { text: "Priority Support", included: "true" },
      { text: "Custom Domain", included: "false" },
    ],
    buttonText: "Get Started",
    isHighlighted: "false",
  },
  render: ({ title, price, period, features, buttonText, isHighlighted }: any) => {
    const highlight = isHighlighted === "true";
    return (
      <div style={{
        border: highlight ? "2px solid #2563eb" : "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "white",
        boxShadow: highlight ? "0 10px 15px -3px rgba(37, 99, 235, 0.1)" : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        position: "relative",
        width: "100%",
        maxWidth: "350px",
        margin: "0 auto",
      }}>
        {highlight && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "#2563eb", color: "white", padding: "0.25rem 1rem", borderRadius: "999px", fontSize: "0.875rem", fontWeight: "bold" }}>MOST POPULAR</div>}
        <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>{title}</h3>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", marginBottom: "2rem" }}>
          <span style={{ fontSize: "3rem", fontWeight: "800" }}>{price}</span>
          <span style={{ color: "#6b7280", marginLeft: "0.25rem" }}>{period}</span>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", textAlign: "left" }}>
          {features.map((f: any, i: number) => (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: f.included === "true" ? "#374151" : "#9ca3af" }}>
              {f.included === "true" ? <Check size={18} color="#10b981" /> : <X size={18} color="#9ca3af" />}
              <span style={{ textDecoration: f.included === "true" ? "none" : "line-through" }}>{f.text}</span>
            </li>
          ))}
        </ul>
        <button style={{ width: "100%", padding: "0.75rem", borderRadius: "0.375rem", backgroundColor: highlight ? "#2563eb" : "#f3f4f6", color: highlight ? "white" : "#374151", fontWeight: "bold", border: "none", cursor: "pointer", transition: "background-color 0.2s" }}>
          {buttonText}
        </button>
      </div>
    );
  }
};

export const PricingListBlockConfig = {
  fields: {
    items: {
      type: "array" as const,
      arrayFields: {
        title: { type: "text" as const },
        description: { type: "text" as const },
        price: { type: "text" as const },
      },
    },
  },
  defaultProps: {
    items: [
      { title: "Basic Maintenance", description: "Monthly software updates and backups", price: "$49" },
      { title: "Pro Maintenance", description: "Weekly updates, backups, and priority support", price: "$99" },
    ],
  },
  render: ({ items }: any) => {
    return (
      <div style={{ width: "100%" }}>
        {items.map((item: any, i: number) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px dashed #d1d5db", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
            <div>
              <h4 style={{ margin: "0 0 0.25rem 0", fontWeight: 600 }}>{item.title}</h4>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>{item.description}</p>
            </div>
            <div style={{ fontWeight: "bold", fontSize: "1.125rem", paddingLeft: "1rem" }}>{item.price}</div>
          </div>
        ))}
      </div>
    );
  }
};

export const CallToActionBlockConfig = {
  fields: {
    title: { type: "text" as const },
    subtitle: { type: "text" as const },
    buttonText: { type: "text" as const },
    buttonLink: { type: "text" as const },
    backgroundColor: { type: "text" as const },
    textColor: { type: "text" as const },
    alignment: { type: "radio" as const, options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }] },
  },
  defaultProps: {
    title: "Ready to take your business to the next level?",
    subtitle: "Join thousands of satisfied customers using our platform.",
    buttonText: "Start Free Trial",
    buttonLink: "#",
    backgroundColor: "#1e40af",
    textColor: "#ffffff",
    alignment: "center",
  },
  render: ({ title, subtitle, buttonText, buttonLink, backgroundColor, textColor, alignment }: any) => {
    return (
      <div style={{ backgroundColor, color: textColor, padding: "4rem 2rem", borderRadius: "0.5rem", textAlign: alignment as any, width: "100%" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", margin: "0 0 1rem 0" }}>{title}</h2>
        <p style={{ fontSize: "1.125rem", opacity: 0.9, margin: "0 0 2rem 0" }}>{subtitle}</p>
        <a href={buttonLink} style={{ display: "inline-block", backgroundColor: "white", color: backgroundColor, padding: "0.75rem 2rem", borderRadius: "0.375rem", fontWeight: "bold", textDecoration: "none" }}>
          {buttonText}
        </a>
      </div>
    );
  }
};

export const AccordionBlockConfig = {
  fields: {
    items: {
      type: "array" as const,
      arrayFields: {
        title: { type: "text" as const },
        content: { type: "textarea" as const },
      },
    },
  },
  defaultProps: {
    items: [
      { title: "What is your return policy?", content: "You can return any item within 30 days of purchase." },
      { title: "Do you offer technical support?", content: "Yes, we offer 24/7 technical support via email and chat." },
    ],
  },
  render: ({ items }: any) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.map((item: any, i: number) => (
          <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: "0.375rem", overflow: "hidden" }}>
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", backgroundColor: "#f9fafb", border: "none", cursor: "pointer", fontWeight: 600, textAlign: "left" }}
            >
              {item.title}
              <ChevronDown size={20} style={{ transform: openIndex === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </button>
            {openIndex === i && (
              <div style={{ padding: "1rem", backgroundColor: "white", borderTop: "1px solid #e5e7eb" }}>
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
};

export const CountdownTimerBlockConfig = {
  fields: {
    targetDate: { type: "text" as const }, // ISO string like 2026-12-31T23:59:59
    color: { type: "text" as const },
  },
  defaultProps: {
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    color: "#2563eb",
  },
  render: ({ targetDate, color }: any) => {
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
      const target = new Date(targetDate).getTime();
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = target - now;

        if (distance < 0) {
          clearInterval(interval);
          return;
        }

        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [targetDate]);

    const TimeUnit = ({ value, label }: { value: number, label: string }) => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: color, color: "white", padding: "1rem", borderRadius: "0.5rem", minWidth: "80px" }}>
        <span style={{ fontSize: "2rem", fontWeight: "bold", lineHeight: 1 }}>{value < 10 ? `0${value}` : value}</span>
        <span style={{ fontSize: "0.75rem", textTransform: "uppercase", marginTop: "0.25rem", opacity: 0.8 }}>{label}</span>
      </div>
    );

    return (
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", width: "100%" }}>
        <TimeUnit value={timeLeft.d} label="Days" />
        <TimeUnit value={timeLeft.h} label="Hours" />
        <TimeUnit value={timeLeft.m} label="Minutes" />
        <TimeUnit value={timeLeft.s} label="Seconds" />
      </div>
    );
  }
};

export const AlertBoxBlockConfig = {
  fields: {
    type: { type: "select" as const, options: [{ label: "Info", value: "info" }, { label: "Warning", value: "warning" }, { label: "Success", value: "success" }, { label: "Error", value: "error" }] },
    title: { type: "text" as const },
    message: { type: "text" as const },
    dismissible: { type: "radio" as const, options: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }] },
  },
  defaultProps: {
    type: "info",
    title: "Notice",
    message: "This is an important piece of information.",
    dismissible: "true",
  },
  render: ({ type, title, message, dismissible }: any) => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    let bg = "#eff6ff"; let border = "#bfdbfe"; let text = "#1e3a8b";
    if (type === "warning") { bg = "#fffbeb"; border = "#fde68a"; text = "#92400e"; }
    if (type === "success") { bg = "#f0fdf4"; border = "#bbf7d0"; text = "#166534"; }
    if (type === "error") { bg = "#fef2f2"; border = "#fecaca"; text = "#991b1b"; }

    return (
      <div style={{ width: "100%", backgroundColor: bg, border: `1px solid ${border}`, color: text, padding: "1rem", borderRadius: "0.375rem", display: "flex", alignItems: "flex-start", gap: "0.75rem", position: "relative" }}>
        <Bell size={20} style={{ flexShrink: 0, marginTop: "0.125rem" }} />
        <div>
          <h4 style={{ margin: "0 0 0.25rem 0", fontWeight: "bold" }}>{title}</h4>
          <p style={{ margin: 0, opacity: 0.9 }}>{message}</p>
        </div>
        {dismissible === "true" && (
          <button onClick={() => setVisible(false)} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", color: text, cursor: "pointer", opacity: 0.5 }}>
            <X size={16} />
          </button>
        )}
      </div>
    );
  }
};

export const TabsBlockConfig = {
  fields: {
    tabs: {
      type: "array" as const,
      arrayFields: {
        label: { type: "text" as const },
      },
    },
  },
  defaultProps: {
    tabs: [
      { label: "Tab 1" },
      { label: "Tab 2" },
    ]
  },
  render: ({ tabs, puck }: any) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
      <div style={{ width: "100%", border: "1px solid #e5e7eb", borderRadius: "0.5rem", overflow: "hidden" }}>
        <div style={{ display: "flex", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
          {tabs.map((tab: any, i: number) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                padding: "1rem 1.5rem",
                fontWeight: 600,
                border: "none",
                backgroundColor: activeTab === i ? "white" : "transparent",
                color: activeTab === i ? "#2563eb" : "#6b7280",
                borderBottom: activeTab === i ? "2px solid #2563eb" : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ padding: "1.5rem", backgroundColor: "white" }}>
          {/* Note: In a real editor we need independent DropZones per tab. For simplicity we use a unified array of Dropzones, but Puck v2 Handles this with dynamic zones. */}
          <DropZone zone={`tab-${activeTab}`} />
        </div>
      </div>
    );
  }
};
