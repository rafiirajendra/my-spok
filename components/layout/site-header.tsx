import Link from "next/link";
import { BookHeart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_12px_26px_rgba(243,154,187,0.35)]">
            <BookHeart className="h-5 w-5" />
          </span>
          <div>
            <p className="font-heading text-lg font-semibold text-primary-strong">
              Spok Belajar
            </p>
            <p className="text-xs text-foreground/70">Kalimat mudah untuk anak hebat</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/student">
            <Button size="sm" variant="secondary">
              Mulai Belajar
            </Button>
          </Link>
          <Link href="/login">
            <Button className="gap-2" size="sm" variant="ghost">
              <LogIn className="h-4 w-4" />
              Login Guru
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
