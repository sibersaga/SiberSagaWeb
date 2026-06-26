import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Share2, Heart } from "lucide-react";

export const SocialIconsBlockConfig = {
  fields: {
    facebook: { type: "text" as const },
    twitter: { type: "text" as const },
    instagram: { type: "text" as const },
    linkedin: { type: "text" as const },
    youtube: { type: "text" as const },
    iconSize: { type: "number" as const },
    iconColor: { type: "text" as const },
    gap: { type: "text" as const },
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
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedin: "",
    youtube: "",
    iconSize: 24,
    iconColor: "#4b5563",
    gap: "1rem",
    alignment: "center",
  },
  render: ({ facebook, twitter, instagram, linkedin, youtube, iconSize, iconColor, gap, alignment }: any) => {
    const justify = alignment === "left" ? "flex-start" : alignment === "right" ? "flex-end" : "center";
    
    return (
      <div style={{ display: "flex", gap: gap || "1rem", justifyContent: justify, width: "100%" }}>
        {facebook && <a href={facebook} target="_blank" rel="noreferrer"><Facebook size={iconSize} color={iconColor} className="hover:opacity-80 transition-opacity" /></a>}
        {twitter && <a href={twitter} target="_blank" rel="noreferrer"><Twitter size={iconSize} color={iconColor} className="hover:opacity-80 transition-opacity" /></a>}
        {instagram && <a href={instagram} target="_blank" rel="noreferrer"><Instagram size={iconSize} color={iconColor} className="hover:opacity-80 transition-opacity" /></a>}
        {linkedin && <a href={linkedin} target="_blank" rel="noreferrer"><Linkedin size={iconSize} color={iconColor} className="hover:opacity-80 transition-opacity" /></a>}
        {youtube && <a href={youtube} target="_blank" rel="noreferrer"><Youtube size={iconSize} color={iconColor} className="hover:opacity-80 transition-opacity" /></a>}
      </div>
    );
  },
};

export const ShareButtonBlockConfig = {
  fields: {
    label: { type: "text" as const },
    variant: {
      type: "select" as const,
      options: [
        { label: "Solid", value: "solid" },
        { label: "Outline", value: "outline" },
      ],
    },
    urlToShare: { type: "text" as const }, // leave empty to share current page
  },
  defaultProps: {
    label: "Share this page",
    variant: "solid",
    urlToShare: "",
  },
  render: ({ label, variant, urlToShare }: any) => {
    const handleShare = () => {
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: urlToShare || window.location.href,
        }).catch(console.error);
      } else {
        alert(`Sharing: ${urlToShare || window.location.href}`);
      }
    };

    let baseClass = "inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-md transition-all cursor-pointer ";
    if (variant === "solid") baseClass += "bg-blue-600 text-white hover:bg-blue-700";
    if (variant === "outline") baseClass += "border-2 border-blue-600 text-blue-600 hover:bg-blue-50";

    return (
      <button onClick={handleShare} className={baseClass}>
        <Share2 size={18} />
        {label}
      </button>
    );
  },
};

export const FollowButtonBlockConfig = {
  fields: {
    label: { type: "text" as const },
    url: { type: "text" as const },
    backgroundColor: { type: "text" as const },
    textColor: { type: "text" as const },
  },
  defaultProps: {
    label: "Follow Us",
    url: "https://instagram.com",
    backgroundColor: "#ec4899", // pink-500
    textColor: "#ffffff",
  },
  render: ({ label, url, backgroundColor, textColor }: any) => {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full hover:opacity-90 transition-opacity shadow-sm hover:shadow-md"
        style={{ backgroundColor, color: textColor }}
      >
        <Heart size={20} fill="currentColor" />
        {label}
      </a>
    );
  },
};
