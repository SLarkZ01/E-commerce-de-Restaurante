"use client";

import { useState, useEffect } from "react";
import { SidebarStaff } from "@/components/staff/sidebarStaff";
import { HeaderStaff } from "@/components/staff/headerStaff";
import type { Rol } from "@/types";

const STORAGE_KEY = "ekitchen-sidebar-collapsed";

function esMovil() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

export function StaffLayoutClient({
  userEmail,
  userName,
  rol,
  children,
}: {
  userEmail: string;
  userName: string;
  rol: Rol;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(() => esMovil());

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  return (
    <div className="flex min-h-dvh bg-fondo">
      <div className="hidden md:block">
        <SidebarStaff
          userEmail={userEmail}
          userName={userName}
          rol={rol}
          collapsed={collapsed}
          onToggle={toggle}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderStaff
          userEmail={userEmail}
          userName={userName}
          rol={rol}
          collapsed={collapsed}
          onToggle={toggle}
        />
        {children}
      </div>
    </div>
  );
}
