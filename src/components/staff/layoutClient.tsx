"use client";

import { useState, useEffect } from "react";
import { SidebarStaff } from "@/components/staff/sidebarStaff";
import { HeaderStaff } from "@/components/staff/headerStaff";

const STORAGE_KEY = "ekitchen-sidebar-collapsed";

function esMovil() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

export function StaffLayoutClient({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(() => esMovil());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setCollapsed(saved === "true");
    } else if (esMovil()) {
      setCollapsed(true);
    }
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  if (!mounted) {
    return (
      <div className="flex min-h-dvh bg-fondo">
        <div className="hidden md:block w-[260px] bg-fondo border-r border-borde/60 flex flex-col shrink-0 h-dvh sticky top-0" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 bg-fondo/95 backdrop-blur-sm border-b border-borde/60" />
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-fondo">
      <div className="hidden md:block">
        <SidebarStaff
          userEmail={userEmail}
          collapsed={collapsed}
          onToggle={toggle}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderStaff
          userEmail={userEmail}
          collapsed={collapsed}
          onToggle={toggle}
        />
        {children}
      </div>
    </div>
  );
}
