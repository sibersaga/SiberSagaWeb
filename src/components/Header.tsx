/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  User,
  GraduationCap,
  Newspaper,
  Award,
  Image as ImageIcon,
  FileText,
  Download,
  MapPin,
  Search,
  Share2,
  Copy,
  Check,
  Send,
  Facebook,
  Twitter,
  MessageCircle,
  Lightbulb,
  Briefcase
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import SchoolLogo from "./SchoolLogo";
import { useAdmin } from "../context/AdminContext";
import EditableText from "./editor/EditableText";

interface HeaderProps {
  activeSection?: string;
  brandTitle?: string;
  tagline?: string;
}

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring" as const, bounce: 0, duration: 0.5 };

export default function Header(props: HeaderProps) {
  const activeSectionProp = props.activeSection;
  const { siteContent, updateSiteContent } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const updateHeader = (key: string, value: string) => {
    updateSiteContent({
      ...siteContent,
      header: { ...siteContent.header, [key]: value }
    });
  };

  const getActiveSection = () => {
    if (location.pathname === "/program") return "program";
    if (location.pathname.startsWith("/berita")) return "berita";
    if (location.pathname === "/galeri") return "galeri";
    if (location.pathname === "/layanan") return "layanan";
    if (location.pathname === "/pendaftaran") return "spmb";
    if (location.pathname === "/download") return "download";
    if (location.pathname === "/tim") return "sambutan";
    if (location.pathname === "/fasilitas") return "sambutan";
    return activeSectionProp || "hero";
  };

  const activeSection = getActiveSection();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfilHovered, setIsProfilHovered] = useState(false);
  const [isMobileProfilOpen, setIsMobileProfilOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const searchItems = siteContent.header.searchItems;

  const filteredSearch = searchItems.filter(item => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsShareOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const menuItems = siteContent.header.menu.map((item) => {
    const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
      hero: Home,
      sambutan: User,
      program: GraduationCap,
      prestasi: Award,
      inovasi: Lightbulb,
      berita: Newspaper,
      galeri: ImageIcon,
      layanan: Briefcase,
      spmb: FileText,
      download: Download,
      kontak: MapPin,
    };

    return {
      id: item.id,
      label: item.label,
      icon: iconMap[item.id] || Home,
    };
  });

  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);

    // Map old section IDs to new routes
    const routeMap: Record<string, string> = {
      hero: "/",
      sambutan: "/",
      guru: "/tim",
      fasilitas: "/fasilitas",
      kondisi: "/",
      program: "/program",
      prestasi: "/",
      inovasi: "/",
      berita: "/berita",
      galeri: "/galeri",
      layanan: "/layanan",
      spmb: "/pendaftaran",
      download: "/download",
      kontak: "/",
    };

    const route = routeMap[id] || "/";

    if (route === "/" && location.pathname !== "/") {
      // Navigating to home, scroll to section
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(`section-${id}`);
        if (element) {
          const topOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - topOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 200);
    } else if (route !== "/" && location.pathname === "/" && id !== "hero") {
      // Navigating to another page
      navigate(route);
    } else if (route === "/" && id !== "hero") {
      // Already on home, just scroll
      const element = document.getElementById(`section-${id}`);
      if (element) {
        const topOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - topOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    } else {
      // Navigate to page
      navigate(route);
    }
  };

  return (
    <header
      id="main-header"
      className={`w-full z-40 transition-all duration-300 ${
        isSticky
          ? "sticky top-0 bg-brand-navy/95 backdrop-blur-md shadow-lg shadow-slate-900/25 text-white border-b border-brand-navy/20 py-2.5"
          : "relative bg-brand-navy text-white border-b border-[#132743]/50 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Beautiful Customized School Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => handleScrollTo("hero")}
        >
          <SchoolLogo size={46} className="transition-transform group-hover:scale-105 duration-300" />
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-white text-sm md:text-base leading-none tracking-tight group-hover:text-brand-sky transition-colors">
              <EditableText value={props.brandTitle ?? siteContent.header.brandTitle} onChange={(v) => updateHeader('brandTitle', v)} />
            </span>
            <span className="text-[9px] uppercase tracking-[0.11em] font-bold text-slate-300 mt-1.5">
              <EditableText value={props.tagline ?? siteContent.header.tagline} onChange={(v) => updateHeader('tagline', v)} />
            </span>
          </div>
        </div>

        {/* Desktop Navigation Menu with Expandable Tabs Style */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/10 border border-white/10 rounded-2xl p-1 shadow-sm">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.id || (item.id === "sambutan" && ["sambutan", "guru", "kondisi", "fasilitas"].includes(activeSection));
            
            if (item.id === "sambutan") {
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setIsProfilHovered(true)}
                  onMouseLeave={() => setIsProfilHovered(false)}
                >
                  <motion.button
                    initial={false}
                    animate={{
                      gap: isSelected ? "0.375rem" : 0,
                      paddingLeft: isSelected ? "0.875rem" : "0.5rem",
                      paddingRight: isSelected ? "0.875rem" : "0.5rem",
                    }}
                    transition={transition}
                    onClick={() => handleScrollTo("sambutan")}
                    className={`relative flex items-center rounded-xl py-1.5 text-xs font-semibold transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "bg-brand-sky text-white shadow-sm border border-white/15"
                        : "text-white/80 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    <Icon size={16} strokeWidth={2.4} />
                    <AnimatePresence initial={false}>
                      {isSelected && (
                        <motion.span
                          variants={spanVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={transition}
                          className="overflow-hidden whitespace-nowrap text-xs font-extrabold leading-none"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isProfilHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-white border border-slate-200/60 rounded-2xl shadow-xl p-2 z-50 flex flex-col gap-1 text-left text-slate-800"
                      >
                        <button
                          onClick={() => {
                            setIsProfilHovered(false);
                            handleScrollTo("sambutan");
                          }}
                          className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex flex-col gap-0.5 cursor-pointer ${
                            activeSection === "sambutan"
                              ? "bg-brand-light text-brand-navy border-l-2 border-brand-sky"
                              : "text-slate-600 hover:bg-brand-light hover:text-brand-navy"
                          }`}
                        >
                          <span className="font-extrabold">Profil Sekolah & Sambutan</span>
                          <span className="text-[10px] text-slate-400 font-normal leading-tight">Sambutan Kepala Sekolah</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setIsProfilHovered(false);
                            handleScrollTo("guru");
                          }}
                          className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex flex-col gap-0.5 cursor-pointer ${
                            activeSection === "guru"
                              ? "bg-brand-light text-brand-navy border-l-2 border-brand-sky"
                              : "text-slate-600 hover:bg-brand-light hover:text-brand-navy"
                          }`}
                        >
                          <span className="font-extrabold">Guru & Tenaga Kependidikan</span>
                          <span className="text-[10px] text-slate-400 font-normal leading-tight font-sans">12 Pendidik & Staf (Swiper / Grid)</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setIsProfilHovered(false);
                            handleScrollTo("kondisi");
                          }}
                          className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex flex-col gap-0.5 cursor-pointer ${
                            activeSection === "kondisi"
                              ? "bg-brand-light text-brand-navy border-l-2 border-brand-sky"
                              : "text-slate-600 hover:bg-brand-light hover:text-brand-navy"
                          }`}
                        >
                          <span className="font-extrabold">Kondisi Siswa & Rombel</span>
                          <span className="text-[10px] text-slate-400 font-normal leading-tight">Persebaran Murid Aktif</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsProfilHovered(false);
                            handleScrollTo("fasilitas");
                          }}
                          className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex flex-col gap-0.5 cursor-pointer ${
                            activeSection === "fasilitas"
                              ? "bg-brand-light text-brand-navy border-l-2 border-brand-sky"
                              : "text-slate-600 hover:bg-brand-light hover:text-brand-navy"
                          }`}
                        >
                          <span className="font-extrabold">Sarana & Prasarana</span>
                          <span className="text-[10px] text-slate-400 font-normal leading-tight">Gedung, Lab, & Fasilitas Penunjang</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <motion.button
                key={item.id}
                initial={false}
                animate={{
                  gap: isSelected ? "0.375rem" : 0,
                  paddingLeft: isSelected ? "0.875rem" : "0.5rem",
                  paddingRight: isSelected ? "0.875rem" : "0.5rem",
                }}
                transition={transition}
                onClick={() => handleScrollTo(item.id)}
                className={`relative flex items-center rounded-xl py-1.5 text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "bg-brand-sky text-white shadow-sm border border-white/15"
                    : "text-white/80 hover:bg-white/15 hover:text-white"
                }`}
              >
                <Icon size={16} strokeWidth={2.4} />
                <AnimatePresence initial={false}>
                  {isSelected && (
                    <motion.span
                      variants={spanVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={transition}
                      className="overflow-hidden whitespace-nowrap text-xs font-extrabold leading-none"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
          <div className="h-5 w-[1px] bg-white/20 mx-1" />
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setSearchQuery("");
                setIsSearchOpen(true);
              }}
              className="p-2 text-white/70 hover:text-brand-sky hover:bg-white/10 rounded-xl transition-all duration-250 cursor-pointer active:scale-95"
              title="Cari Informasi..."
            >
              <Search size={17} strokeWidth={2.4} />
            </button>
            <button
              onClick={() => setIsShareOpen(true)}
              className="p-2 text-white/70 hover:text-brand-sky hover:bg-white/10 rounded-xl transition-all duration-250 cursor-pointer active:scale-95"
              title="Bagikan Halaman"
            >
              <Share2 size={17} strokeWidth={2.4} />
            </button>
          </div>
        </nav>

        {/* Mobile quick actions & Top Right Menu */}
        <div className="lg:hidden flex items-center gap-1">
          <button
            onClick={() => {
              setSearchQuery("");
              setIsSearchOpen(true);
            }}
            className="p-2 text-white/80 hover:text-brand-sky hover:bg-white/10 rounded-xl transition-all duration-250 cursor-pointer"
            aria-label="Cari Informasi"
          >
            <Search size={19} strokeWidth={2.4} />
          </button>
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-2 text-white/80 hover:text-brand-sky hover:bg-white/10 rounded-xl transition-all duration-250 cursor-pointer"
            aria-label="Bagikan Halaman"
          >
            <Share2 size={19} strokeWidth={2.4} />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white/80 hover:text-brand-sky hover:bg-white/10 rounded-xl transition-all duration-250 cursor-pointer"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={19} strokeWidth={2.4} /> : <Menu size={19} strokeWidth={2.4} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown aligned to Top Right */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-6 w-60 bg-white border border-slate-200 shadow-xl rounded-2xl p-2.5 z-50 flex flex-col gap-1 text-left"
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeSection === item.id || (item.id === "sambutan" && ["sambutan", "guru", "kondisi", "fasilitas"].includes(activeSection));
              
              if (item.id === "sambutan") {
                return (
                  <div key={item.id} className="flex flex-col gap-0.5">
                    <button
                      onClick={() => setIsMobileProfilOpen(!isMobileProfilOpen)}
                      className={`flex items-center justify-between w-full p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        ["sambutan", "guru", "kondisi", "fasilitas"].includes(activeSection)
                          ? "bg-brand-light text-brand-navy border-l-2 border-brand-sky"
                          : "text-slate-600 hover:bg-slate-50 hover:text-brand-navy"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={14} />
                        <span>Profil</span>
                      </div>
                      <span className="text-[10px] transform transition-transform duration-200" style={{ transform: isMobileProfilOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                    </button>
                    
                    {isMobileProfilOpen && (
                      <div className="pl-3.5 flex flex-col gap-1 border-l border-slate-200 mt-0.5 mb-1 ml-3.5">
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleScrollTo("sambutan");
                          }}
                          className={`text-left p-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                            activeSection === "sambutan" ? "text-brand-sky bg-brand-light/70" : "text-slate-500 hover:text-brand-navy hover:bg-slate-50"
                          }`}
                        >
                          Profil & Sambutan
                        </button>
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleScrollTo("guru");
                          }}
                          className={`text-left p-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                            activeSection === "guru" ? "text-brand-sky bg-brand-light/70" : "text-slate-500 hover:text-brand-navy hover:bg-slate-50"
                          }`}
                        >
                          Guru & Staf
                        </button>
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleScrollTo("kondisi");
                          }}
                          className={`text-left p-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                            activeSection === "kondisi" ? "text-brand-sky bg-brand-light/70" : "text-slate-500 hover:text-brand-navy hover:bg-slate-50"
                          }`}
                        >
                          Kondisi Siswa
                        </button>
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleScrollTo("fasilitas");
                          }}
                          className={`text-left p-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                            activeSection === "fasilitas" ? "text-brand-sky bg-brand-light/70" : "text-slate-500 hover:text-brand-navy hover:bg-slate-50"
                          }`}
                        >
                          Fasilitas
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleScrollTo(item.id);
                  }}
                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-brand-light text-brand-sky border-l-2 border-brand-sky"
                      : "text-slate-600 hover:bg-slate-50 hover:text-brand-navy"
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.id === "spmb" ? "PPDB" : item.id === "download" ? "Unduhan" : item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2.1 AnimatePresence Search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-start justify-center p-4 md:p-12"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col mt-10 max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Input Area */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <Search size={20} className="text-brand-sky" />
                <input
                  type="text"
                  placeholder={siteContent.header.searchPlaceholder}
                  className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 font-sans text-sm md:text-base font-medium py-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:text-brand-sky hover:border-brand-sky/40 transition cursor-pointer font-sans"
                >
                  ESC
                </button>
              </div>

              {/* Result Area */}
              <div className="overflow-y-auto flex-1 p-3 flex flex-col gap-1 max-h-[50vh]">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-3.5 py-1 mb-1">
                  Hasil Pencarian ({filteredSearch.length})
                </div>

                {filteredSearch.length > 0 ? (
                  filteredSearch.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        handleScrollTo(item.id);
                      }}
                      className="w-full text-left p-3 rounded-2xl hover:bg-brand-light transition border border-transparent hover:border-slate-100 flex gap-4 items-start cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-brand-light text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-sky group-hover:text-white transition-all duration-300">
                        <Search size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-extrabold text-sm text-slate-800">
                            {item.title}
                          </span>
                          <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 truncate leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center flex flex-col items-center justify-center text-slate-400 px-6 font-sans">
                    <Search size={32} className="text-slate-300 mb-2" />
                    <p className="text-sm font-semibold">Tidak ada hasil ditemukan</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                      Coba kata kunci lain atau perbaiki ejaan pencarian Anda.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2.2 AnimatePresence Share overlay */}
      <AnimatePresence>
        {isShareOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 shadow-2xl"
            onClick={() => setIsShareOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md relative overflow-hidden flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <h3 className="text-xl font-heading font-extrabold text-[#1E293B]">
                  Bagikan Halaman Utama
                </h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Sebarkan informasi perkembangan pendidikan SDN 3 Purwosari ke jejaring sosial media Anda.
                </p>
              </div>

              {/* Social Media Circular Buttons Grid */}
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(siteContent.header.shareText + " " + window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 group select-none cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-305 shadow-sm">
                    <MessageCircle size={22} className="opacity-95" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800 font-sans">WhatsApp</span>
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 group select-none cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-305 shadow-sm">
                    <Facebook size={22} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800 font-sans">Facebook</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(siteContent.header.shareText)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 group select-none cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-305 shadow-sm">
                    <Twitter size={22} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800 font-sans">Twitter / X</span>
                </a>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(siteContent.header.shareTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 group select-none cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all duration-305 shadow-sm">
                    <Send size={22} className="mr-0.5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800 font-sans">Telegram</span>
                </a>
              </div>

              {/* Copy URL bar */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                  Salin Tautan Situs
                </span>
                <div className="flex gap-2 items-center bg-slate-50 border border-slate-150 p-1.5 rounded-2xl">
                  <span className="text-xs text-slate-400 select-all truncate pl-2 flex-1 font-mono font-medium">
                    {typeof window !== "undefined" ? window.location.href : "https://sdn3purwosari.sch.id"}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer ${
                      isCopied
                        ? "bg-emerald-500 text-white shadow-emerald-100"
                        : "bg-brand-sky text-white hover:bg-brand-navy shadow-inner"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check size={14} strokeWidth={2.5} />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy size={13} strokeWidth={2.5} />
                        Salin
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsShareOpen(false)}
                className="w-full text-center py-2.5 rounded-2xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer select-none font-sans"
              >
                Tutup Jendela
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
