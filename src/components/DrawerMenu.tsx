import { Link } from "@tanstack/react-router";
import { useDrawerNavigation } from "@/hooks/useDrawerNavigation";

interface Props {
  onClose: () => void;
}

export function DrawerMenu({ onClose }: Props) {
  const { drawerMenuItems, expanded, toggleExpanded } = useDrawerNavigation();

  return (
    <nav className="space-y-1">
      {drawerMenuItems.map((item) => (
        <div key={item.id}>
          {item.href ? (
            <Link
              to={item.href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 hover:text-blue-200"
              activeProps={{ className: "bg-blue-600/20 text-blue-300" }}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ) : (
            <>
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 hover:text-blue-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span
                  className={`transition-transform ${
                    expanded.includes(item.id) ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Submenu */}
              {expanded.includes(item.id) && item.children && (
                <div className="ml-4 space-y-1 border-l border-white/10 pl-4 py-2">
                  {item.children.map((child) => (
                    <a
                      key={child.id}
                      href={child.href || "#"}
                      onClick={(e) => {
                        if (child.href?.startsWith("/")) {
                          e.preventDefault();
                        }
                        onClose();
                      }}
                      target={child.href?.startsWith("http") ? "_blank" : undefined}
                      rel={child.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-900 hover:text-white"
                    >
                      <span>{child.icon}</span>
                      <span>{child.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}

      <div className="border-t border-white/5 my-4" />

      {/* App Info */}
      <div className="px-4 py-3">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-3">
          App Info
        </p>
        <div className="space-y-2 text-xs text-slate-400">
          <p>Version: 1.0.0</p>
          <p>✅ PWA Enabled</p>
          <p>📱 Offline Ready</p>
        </div>
      </div>
    </nav>
  );
}
