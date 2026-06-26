/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import Program from "./pages/Program";
import Berita from "./pages/Berita";
import Galeri from "./pages/Galeri";
import Layanan from "./components/Layanan";
import Pendaftaran from "./pages/Pendaftaran";
import Download from "./pages/Download";
import Tim from "./pages/Tim";
import Fasilitas from "./pages/Fasilitas";
import PageBuilder from "./pages/admin/PageBuilder";
import DynamicPage from "./pages/DynamicPage";

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/builder" element={<PageBuilder />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={
          <Layout>
            <Routes>
              <Route path="/program" element={<Program />} />
              <Route path="/berita" element={<Berita />} />
              <Route path="/berita/:slug" element={<Berita />} />
              <Route path="/galeri" element={<Galeri />} />
              <Route path="/layanan" element={<Layanan />} />
              <Route path="/pendaftaran" element={<Pendaftaran />} />
              <Route path="/download" element={<Download />} />
              <Route path="/tim" element={<Tim />} />
              <Route path="/fasilitas" element={<Fasilitas />} />

            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}
