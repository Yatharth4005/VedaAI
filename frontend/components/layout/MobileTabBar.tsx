"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, BookOpen, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Assignments", href: "/assignments", icon: ClipboardList },
  { label: "Library", href: "/library", icon: BookOpen },
  { label: "AI Toolkit", href: "/toolkit", icon: Brain },
];

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50">
      <div className="flex bg-cta rounded-2xl shadow-lg px-2 py-2">
        {tabs.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 rounded-xl transition-colors",
                active ? "text-white" : "text-gray-400"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
              {active && (
                <span className="w-1 h-1 rounded-full bg-white mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
