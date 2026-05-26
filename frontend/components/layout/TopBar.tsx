import { Bell } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, breadcrumb, actions }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface sticky top-0 z-10">
      <div>
        {breadcrumb && (
          <p className="text-xs text-text-muted mb-1">{breadcrumb}</p>
        )}
        <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
        {subtitle && (
          <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        {actions}
        <button
          type="button"
          className="relative p-2 text-text-secondary hover:text-text-primary"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cta flex items-center justify-center text-white text-sm font-bold">
            J
          </div>
          <span className="text-sm font-medium text-text-primary hidden lg:block">
            John Doe
          </span>
        </div>
      </div>
    </div>
  );
}
