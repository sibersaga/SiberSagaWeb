/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { UserPlus, Trash2, Edit2, Settings, Check, X, ShieldAlert, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

interface Teacher {
  id: string;
  name: string;
  role: string;
  image: string;
}

export default function Teachers() {
  const { teachers, setTeachers, isAdminMode } = useAdmin();
  const [activeTab, setActiveTab] = useState<"card" | "grid">("card");

  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formImage, setFormImage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formRole) return;

    const imgUrl = formImage.trim() || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150";
    
    if (editingId) {
      const updated = teachers.map((t) =>
        t.id === editingId ? { ...t, name: formName, role: formRole, image: imgUrl } : t
      );
      setTeachers(updated);
      setEditingId(null);
    } else {
      const newTeacher: Teacher = {
        id: "t_" + Date.now(),
        name: formName,
        role: formRole,
        image: imgUrl,
      };
      setTeachers([...teachers, newTeacher]);
    }

    setFormName("");
    setFormRole("");
    setFormImage("");
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingId(teacher.id);
    setFormName(teacher.name);
    setFormRole(teacher.role);
    setFormImage(teacher.image);
    document.getElementById("admin-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data guru ini?")) {
      setTeachers(teachers.filter((t) => t.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormName("");
        setFormRole("");
        setFormImage("");
      }
    }
  };

  const handleReset = () => {
    if (confirm("Reset seluruh data guru kembali ke bawaan sistem (12 orang)?")) {
      setTeachers([
        { id: "t1", name: "Kiswanto, S.Pd., M.Pd.", role: "Kepala Sekolah", image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300" },
        { id: "t2", name: "Endang Lestari, S.Pd.", role: "Guru Kelas 1", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300" },
        { id: "t3", name: "Sri Mulyani, S.Pd.", role: "Guru Kelas 2", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300" },
        { id: "t4", name: "Bambang Wijaya, S.Pd.", role: "Guru Kelas 3", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" },
        { id: "t5", name: "Siti Aminah, S.Pd.SD", role: "Guru Kelas 4", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300" },
        { id: "t6", name: "Heri Susanto, S.Pd.", role: "Guru Kelas 5", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300" },
        { id: "t7", name: "Joko Wahyono, S.Pd.", role: "Guru Kelas 6", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300" },
        { id: "t8", name: "Ahmad Fauzi, S.Pd.I", role: "Guru Pendidikan Agama Islam", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300" },
        { id: "t9", name: "Triyono, S.Pd.", role: "Guru PJOK (Penjasorkes)", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300" },
        { id: "t10", name: "Rina Astuti, S.Sn.", role: "Guru Seni Budaya", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300" },
        { id: "t11", name: "Dwi Kartika, A.Ma.Pust.", role: "Kepala Perpustakaan", image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300" },
        { id: "t12", name: "Slamet Riyadi", role: "Staff Administrasi & TU", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300" }
      ]);
      setEditingId(null);
      setFormName("");
      setFormRole("");
      setFormImage("");
    }
  };

  return (
    <section id="section-guru" className="py-10 md:py-12 bg-white text-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="inline-flex items-center gap-1.5 bg-[#2563EB]/10 text-[#2563EB] px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Akademisi Berdedikasi
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-[#1E293B] mt-4 tracking-tight">
            Guru & Tenaga Kependidikan
          </h2>
          <p className="text-[#64748B] font-normal mt-2 text-xs md:text-sm leading-relaxed">
            Mengenal lebih dekat para pendidik religius dan profesional yang tulus membimbing generasi penerus bangsa di SDN 3 Purwosari Wonogiri.
          </p>
          <div className="w-12 h-1 bg-[#2563EB] mx-auto mt-3 rounded-full" />
        </div>

        {/* Action Controls Tabs & Admin Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-2.5 rounded-[22px] border border-slate-200/50 mb-10 gap-3">
          <div className="flex items-center gap-1.5 bg-slate-200/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("card")}
              className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "card"
                  ? "bg-white text-[#2563EB] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Mode Swiper Dek
            </button>
            <button
              onClick={() => setActiveTab("grid")}
              className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-[#2563EB] cursor-pointer ${
                activeTab === "grid"
                  ? "bg-white text-[#2563EB] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Mode Grid Directory ({teachers.length})
            </button>
          </div>

          <button
            onClick={() => {}}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isAdminMode
                ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-350 hover:bg-slate-50"
            }`}
          >
            <Settings size={14} className={isAdminMode ? "animate-spin" : ""} />
            {isAdminMode ? "Keluar Mode Admin" : "Kelola Guru (Admin)"}
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col gap-10">
          
          {/* 1. SWIPER MODE VIEW */}
          {activeTab === "card" && (
            <div className="flex flex-col items-center justify-center py-6 min-h-[500px]">
              {teachers.length === 0 ? (
                <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl max-w-sm">
                  <ShieldAlert className="mx-auto text-slate-400 mb-2" size={32} />
                  <p className="text-slate-500 text-sm">Tidak ada data guru yang terdaftar. Masuk Mode Admin untuk menambah.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <p className="text-xs text-[#64748B] font-medium tracking-wide bg-slate-100 px-3.5 py-1.5 rounded-full select-none flex items-center gap-2">
                    <span>Swipe / Geser kartu ke samping kiri/kanan untuk melihat guru berikutnya</span>
                  </p>
                  
                  {/* Image Swiper Core */}
                  <ImageSwiperDeck teachers={teachers} />
                </div>
              )}
            </div>
          )}

          {/* 2. GRID LIST MODE VIEW */}
          {activeTab === "grid" && (
            <div>
              {teachers.length === 0 ? (
                <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl max-w-md mx-auto">
                  <ShieldAlert className="mx-auto text-slate-400 mb-2" size={38} />
                  <p className="text-slate-500 text-sm font-semibold">Belum ada tenaga kependidikan</p>
                  <p className="text-slate-400 text-xs mt-1">Anda dapat menambahkannya kembali dengan menekan tombol Kelola Guru.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {teachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="group relative bg-[#F8FAFC] border border-slate-100 rounded-[24px] p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-150">
                          <img
                            src={teacher.image}
                            alt={teacher.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <h4 className="font-heading font-extrabold text-slate-800 text-sm md:text-base leading-tight">
                          {teacher.name}
                        </h4>
                        <span className="text-xs text-[#2563EB] font-bold mt-1 bg-blue-50/75 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {teacher.role}
                        </span>
                      </div>

                      {isAdminMode && (
                        <div className="flex items-center gap-1.5 justify-center mt-4 pt-4 border-t border-slate-200/50">
                          <button
                            onClick={() => handleEdit(teacher)}
                            className="p-1 px-3 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 size={11} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(teacher.id)}
                            className="p-1 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 size={11} /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. DYNAMIC ADMIN PANEL DRAWER */}
          {isAdminMode && (
            <div id="admin-form" className="bg-[#F8FAFC] border border-slate-200 p-6 md:p-8 rounded-[28px] shadow-sm max-w-4xl mx-auto w-full transition-all duration-300">
              <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-slate-800">
                    {editingId ? "Edit Data Guru" : "Tambah Guru & Tenaga Kependidikan"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">Data disimpan otomatis ke local storage untuk visualisasi interaktif instan.</p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Reset Bawaan Sistem
                </button>
              </div>

              <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Nama Lengkap & Gelar</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Endang Lestari, S.Pd."
                    className="p-3 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Jabatan / Guru Kelas</label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="Contoh: Guru Kelas 1, Guru PAI"
                    className="p-3 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
                  />
                </div>

                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">URL Foto Guru (Unsplash / Bebas)</label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-... (atau kosongkan untuk avatar bawaan)"
                    className="p-3 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 font-mono text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 mt-2 md:col-span-2">
                  <button
                    type="submit"
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {editingId ? <Check size={16} /> : <UserPlus size={16} />}
                    {editingId ? "Simpan Perubahan" : "Tambahkan Guru"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setFormName("");
                        setFormRole("");
                        setFormImage("");
                      }}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

/* 
 * Customized swipeable deck component implementing the exact requested swipe mechanics
 */
interface ImageSwiperDeckProps {
  teachers: Teacher[];
}

export const ImageSwiperDeck: React.FC<ImageSwiperDeckProps> = ({ teachers }) => {
  const cardStackRef = useRef<HTMLDivElement>(null);
  const isSwiping = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  const cardWidth = 260;
  const cardHeight = 352;

  // React state of teachers mapping
  const [cardOrder, setCardOrder] = useState<number[]>([]);

  useEffect(() => {
    // Reset order whenever list edits occur
    setCardOrder(Array.from({ length: teachers.length }, (_, i) => i));
  }, [teachers]);

  const getDurationFromCSS = useCallback((
    variableName: string,
    element?: HTMLElement | null
  ): number => {
    const targetElement = element || document.documentElement;
    const value = getComputedStyle(targetElement)
      ?.getPropertyValue(variableName)
      ?.trim();
    if (!value) return 0;
    if (value.endsWith("ms")) return parseFloat(value);
    if (value.endsWith("s")) return parseFloat(value) * 1000;
    return parseFloat(value) || 0;
  }, []);

  const getCards = useCallback((): HTMLElement[] => {
    if (!cardStackRef.current) return [];
    return [...cardStackRef.current.querySelectorAll('.image-card')] as HTMLElement[];
  }, []);

  const getActiveCard = useCallback((): HTMLElement | null => {
    const cards = getCards();
    return cards[0] || null;
  }, [getCards]);

  const updatePositions = useCallback(() => {
    const cards = getCards();
    cards.forEach((card, i) => {
      card.style.setProperty('--i', (i + 1).toString());
      card.style.setProperty('--swipe-x', '0px');
      card.style.setProperty('--swipe-rotate', '0deg');
      card.style.opacity = '1';
    });
  }, [getCards]);

  const applySwipeStyles = useCallback((deltaX: number) => {
    const card = getActiveCard();
    if (!card) return;
    card.style.setProperty('--swipe-x', `${deltaX}px`);
    card.style.setProperty('--swipe-rotate', `${deltaX * 0.18}deg`);
    card.style.opacity = (1 - Math.min(Math.abs(deltaX) / 100, 1) * 0.7).toString();
  }, [getActiveCard]);

  const handleStart = useCallback((clientX: number) => {
    if (isSwiping.current) return;
    isSwiping.current = true;
    startX.current = clientX;
    currentX.current = clientX;
    const card = getActiveCard();
    if (card) card.style.transition = 'none';
  }, [getActiveCard]);

  const handleEnd = useCallback(() => {
    if (!isSwiping.current) return;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    const deltaX = currentX.current - startX.current;
    const threshold = 60;
    const duration = getDurationFromCSS('--card-swap-duration', cardStackRef.current) || 300;
    const card = getActiveCard();

    if (card) {
      card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

      if (Math.abs(deltaX) > threshold) {
        const direction = Math.sign(deltaX);
        card.style.setProperty('--swipe-x', `${direction * 350}px`);
        card.style.setProperty('--swipe-rotate', `${direction * 25}deg`);

        setTimeout(() => {
          if (getActiveCard() === card) {
            card.style.setProperty('--swipe-rotate', `${-direction * 25}deg`);
          }
        }, duration * 0.5);

        setTimeout(() => {
          setCardOrder(prev => {
            if (prev.length === 0) return [];
            return [...prev.slice(1), prev[0]];
          });
        }, duration);
      } else {
        applySwipeStyles(0);
      }
    }

    isSwiping.current = false;
    startX.current = 0;
    currentX.current = 0;
  }, [getDurationFromCSS, getActiveCard, applySwipeStyles]);

  const handleMove = useCallback((clientX: number) => {
    if (!isSwiping.current) return;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = requestAnimationFrame(() => {
      currentX.current = clientX;
      const deltaX = currentX.current - startX.current;
      applySwipeStyles(deltaX);

      if (Math.abs(deltaX) > 80) {
        handleEnd();
      }
    });
  }, [applySwipeStyles, handleEnd]);

  useEffect(() => {
    const cardStackElement = cardStackRef.current;
    if (!cardStackElement) return;

    const handlePointerDown = (e: PointerEvent) => {
      handleStart(e.clientX);
    };
    const handlePointerMove = (e: PointerEvent) => {
      handleMove(e.clientX);
    };
    const handlePointerUp = () => {
      handleEnd();
    };

    cardStackElement.addEventListener('pointerdown', handlePointerDown);
    cardStackElement.addEventListener('pointermove', handlePointerMove);
    cardStackElement.addEventListener('pointerup', handlePointerUp);

    return () => {
      cardStackElement.removeEventListener('pointerdown', handlePointerDown);
      cardStackElement.removeEventListener('pointermove', handlePointerMove);
      cardStackElement.removeEventListener('pointerup', handlePointerUp);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleStart, handleMove, handleEnd]);

  useEffect(() => {
    updatePositions();
  }, [cardOrder, updatePositions]);

  const handleNext = () => {
    const card = getActiveCard();
    if (card) {
      card.style.transition = `transform 300ms ease, opacity 300ms ease`;
      card.style.setProperty('--swipe-x', `350px`);
      card.style.setProperty('--swipe-rotate', `25deg`);
      setTimeout(() => {
        setCardOrder(prev => [...prev.slice(1), prev[0]]);
      }, 300);
    }
  };

  const handlePrev = () => {
    setCardOrder(prev => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
  };

  if (cardOrder.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className="relative grid place-content-center select-none"
        ref={cardStackRef}
        style={{
          width: cardWidth + 40,
          height: cardHeight + 40,
          touchAction: 'none',
          transformStyle: 'preserve-3d',
          '--card-perspective': '700px',
          '--card-z-offset': '11px',
          '--card-y-offset': '8px',
          '--card-max-z-index': teachers.length.toString(),
          '--card-swap-duration': '0.3s',
        } as React.CSSProperties}
      >
        {cardOrder.map((originalIndex, displayIndex) => {
          const teacher = teachers[originalIndex];
          if (!teacher) return null;
          return (
            <article
              key={`${teacher.id}-${originalIndex}`}
              className="image-card absolute cursor-grab active:cursor-grabbing
                         place-self-center border border-slate-300 rounded-2xl
                         shadow-md overflow-hidden will-change-transform bg-white select-none pointer-events-none"
              style={{
                '--i': (displayIndex + 1).toString(),
                zIndex: teachers.length - displayIndex,
                width: cardWidth,
                height: cardHeight,
                transform: `perspective(var(--card-perspective))
                           translateZ(calc(-1 * var(--card-z-offset) * var(--i)))
                           translateY(calc(var(--card-y-offset) * var(--i)))
                           translateX(var(--swipe-x, 0px))
                           rotateY(var(--swipe-rotate, 0deg))`
              } as React.CSSProperties}
            >
              <div className="relative w-full h-full">
                {/* Photo */}
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Details Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent p-4 pt-12 text-white flex flex-col justify-end select-none">
                  <span className="text-[10px] uppercase font-bold text-[#FBBF24] tracking-widest leading-none bg-[#FBBF24]/10 border border-[#FBBF24]/20 px-2 py-0.5 rounded self-start mb-2">
                    {teacher.role}
                  </span>
                  <h3 className="font-heading font-extrabold text-[#F8FAFC] text-sm md:text-base leading-tight">
                    {teacher.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-300">
                    <span>Geser untuk guru berikutnya</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Slide Navigation Buttons */}
      <div className="flex items-center gap-3 select-none">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-sm cursor-pointer hover:border-slate-300 transition"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-xs font-extrabold text-slate-500 uppercase tracking-widest select-none">
          {teachers.length} Guru & Staf
        </div>
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-sm cursor-pointer hover:border-slate-300 transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
