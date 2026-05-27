"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { VedaLogo } from "./VedaLogo";
import Image from "next/image";

export function MobileHeader() {
  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-border sticky top-0 z-30">
      <Link href="/assignments">
        <VedaLogo />
      </Link>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="relative p-2 text-text-secondary"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full border border-border overflow-hidden shrink-0 shadow-sm relative bg-white">
          <Image
            src="/monkey-avatar.png"
            alt="User Avatar"
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
        <button
          type="button"
          className="p-2 text-text-primary"
          aria-label="Menu"
        >
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
}
