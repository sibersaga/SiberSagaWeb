import sys

path = r'D:\Digital Creator\Antigravity\SiberSagaWeb\src\components\AdminPanel.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find current user login hook
marker = '  const handleNewsDelete = (id: string, title: string) => {'
if marker not in content:
    print('Marker not found')
    sys.exit(1)

# Remove old imports and extend
old_imports = '''import React, { useState, useEffect, useRef, useCallback } from "react";
import FullPageHtmlEditor from "./FullPageHtmlEditor";
import { useAdmin } from "../context/AdminContext";
import {
  Shield,
  Unlock,
  Mail,
  KeyRound,
  User,
  Plus,
  Trash2,
  Edit2,
  Shield: ShieldIcon,
  X,
  LogOut,
  Layers,
  Award,
  Calendar,
  Newspaper,
  Users,
  Check,
  AlertCircle,
  FolderOpen,
  Code
} from "lucide-react";
import { Program, Achievement, AgendaEvent, NewsItem } from "../types";
import { deleteRegistration, isSupabaseConfigured, listRegistrations } from "../supabase";'''

new_imports = '''import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import FullPageHtmlEditor from "./FullPageHtmlEditor";
import { useAdmin } from "../context/AdminContext";
import {
  Shield,
  Lock,
  Mail,
  KeyRound,
  User,
  Plus,
  Trash2,
  Edit2,
  X,
  LogOut,
  Layers,
  Award,
  Calendar,
  Newspaper,
  Users,
  Check,
  AlertCircle,
  Code,
  Globe,
  Menu,
  Star,
  BookOpen,
  Building2,
  UserCheck,
  BookMarked,
  Puzzle,
  Trophy,
  Sparkles,
  Lightbulb,
  Image,
  MessageSquare,
  Download,
  MapPin,
  LayoutTemplate,
  Type,
} from "lucide-react";
import { Program, Achievement, AgendaEvent, NewsItem } from "../types";
import { deleteRegistration, isSupabaseConfigured, listRegistrations } from "../supabase";'''

content = content.replace(old_imports, new_imports)
print('Replaced imports')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
