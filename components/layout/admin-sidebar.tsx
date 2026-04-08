"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers2,
  ListChecks,
  NotebookText,
  Sparkles,
  Type,
  User,
} from "lucide-react";
import { dashboardLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap = {
  Ringkasan: LayoutDashboard,
  Profil: User,
  Kategori: Layers2,
  Level: Sparkles,
  Kata: Type,
  Latihan: NotebookText,
  "Hasil Belajar": ListChecks,
} as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="card-shadow rounded-[32px] border border-white/70 bg-white/85 p-5 backdrop-blur-xl">
      <div className="mb-6 rounded-[24px] bg-linear-to-br from-primary/20 via-white to-sky/45 p-5">
        <p className="text-sm font-bold text-primary-strong">Dashboard Guru</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold">
          Kelola materi dan pantau hasil belajar.
        </h2>
      </div>

      <nav className="space-y-2">
        {dashboardLinks.map((item) => {
          const Icon = iconMap[item.label];
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                active
                  ? "bg-primary text-white shadow-[0_12px_26px_rgba(243,154,187,0.28)]"
                  : "text-foreground/80 hover:bg-surface-soft",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
