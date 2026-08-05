import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeOption = "light" | "dark" | "system";

export function ThemeToggle(): React.JSX.Element | null {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleThemeChange = (newTheme: ThemeOption): void => {
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    document.startViewTransition(() => {
      setTheme(newTheme);
    });
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 p-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-lg transition-colors">
      <button
        type="button"
        onClick={() => handleThemeChange("light")}
        className={`p-2 rounded-full transition-all ${
          theme === "light"
            ? "bg-zinc-200 dark:bg-zinc-700 text-amber-500 shadow-sm"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        aria-label="Set light theme"
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => handleThemeChange("dark")}
        className={`p-2 rounded-full transition-all ${
          theme === "dark"
            ? "bg-zinc-200 dark:bg-zinc-700 text-blue-400 shadow-sm"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        aria-label="Set dark theme"
      >
        <Moon className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => handleThemeChange("system")}
        className={`p-2 rounded-full transition-all ${
          theme === "system"
            ? "bg-zinc-200 dark:bg-zinc-700 text-emerald-500 shadow-sm"
            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
        aria-label="Set system theme"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}
