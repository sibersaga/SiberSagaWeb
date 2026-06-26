/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MapPin, Clock } from "lucide-react";

interface VideoMapProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  mapUrl?: string;
}

export default function VideoMap(props: VideoMapProps) {
  return (
    <section id="section-kontak" className="py-12 md:py-16 bg-[#F8FAFC] text-slate-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 bg-[#2563EB]/10 text-[#2563EB] px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            {props.badge || "Detil Hubung & Lokasi"}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#1E293B] mt-4 tracking-tight">
            {props.title || "Peta Lokasi & Kontak"}
          </h2>
          <p className="text-[#64748B] font-normal mt-3 text-sm md:text-base leading-relaxed">
            {props.subtitle || "Temukan koordinat peta presisi Google Maps beserta jam pelayanan administrasi wali murid SDN 3 Purwosari Wonogiri secara lengkap."}
          </p>
          <div className="w-12 h-1.5 bg-[#2563EB] mx-auto mt-4 rounded-full" />
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Google Maps Location Frame */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-slate-100 text-[#2563EB] flex items-center justify-center shadow-sm">
                <MapPin size={14} />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#1E293B]">
                Koordinat Google Maps Presisi
              </h3>
            </div>

            {/* Google maps embedded iframe widget */}
            <div className="relative h-[380px] lg:h-[450px] w-full rounded-[24px] overflow-hidden shadow-xl border border-slate-100 bg-slate-200">
              <iframe
                title="Peta Lokasi SDN 3 Purwosari Wonogiri"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15802.775836371728!2d110.8752458!3d-7.9270054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a3036fe5a5fbf%3A0xe543ea89098acbcd!2sPurwosari%2C%20Wonogiri%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1718456000000!5m2!1sen!2sid"
                className="w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Google Maps Contacts */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-slate-100 text-[#2563EB] flex items-center justify-center shadow-sm">
                <Clock size={16} />
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#1E293B]">
                Informasi Pelayanan
              </h3>
            </div>

            {/* Direct Info List */}
            <div className="flex flex-col gap-4 h-full justify-between">
              <div className="flex items-start gap-4 bg-white p-5 rounded-[22px] border border-slate-100 shadow-md">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-slate-100 text-[#2563EB] flex items-center justify-center shadow-sm shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-[#1E293B] text-xs uppercase tracking-wider">Alamat Sekolah</span>
                  <span className="font-normal text-xs md:text-sm text-[#64748B] leading-relaxed mt-1.5">
                    Dusun Purwosari, Desa Purwosari, Kecamatan Wonogiri, Kabupaten Wonogiri, Provinsi Jawa Tengah, Kode Pos 57615.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-5 rounded-[22px] border border-slate-100 shadow-md">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-slate-100 text-[#2563EB] flex items-center justify-center shadow-sm shrink-0 mt-0.5">
                  <Clock size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-[#1E293B] text-xs uppercase tracking-wider">Jam Pelayanan</span>
                  <span className="font-normal text-xs md:text-sm text-[#64748B] leading-relaxed mt-1.5">
                    <span className="font-bold text-slate-700">Senin - Kamis :</span> 07:00 - 14:00 WIB<br />
                    <span className="font-bold text-slate-700">Jumat :</span> 07:00 - 11:30 WIB<br />
                    <span className="font-bold text-slate-700">Sabtu :</span> 07:00 - 13:00 WIB<br />
                    <span className="font-bold text-slate-700">Ahad / Hari Besar :</span> Libur
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
