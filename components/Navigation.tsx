import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { SterlingLogo } from "./SterlingLogo";

interface NavigationProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Navigation({ darkMode, onToggleDarkMode }: NavigationProps) {

  return (
    <nav className="border-b border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <SterlingLogo size="md" className="drop-shadow-sm" />
            <span className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100 tracking-wide">
              <span className="hidden sm:inline">STERLING & ASSOCIATES</span>
              <span className="sm:hidden">STERLING</span>
            </span>
          </div>

          {/* Right side controls */}
          <div className="flex items-center">
            {/* Dark mode toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleDarkMode}
              className="h-8 w-8 p-0 border-amber-300 dark:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}