
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Toggle } from "@/components/ui/toggle";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Toggle
        variant="theme"
        aria-label="Toggle theme"
        pressed={theme === "light"}
        onPressedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className={`h-5 w-5 ${theme === "light" ? "text-blue-400" : "text-gray-400"}`} />
      </Toggle>
      <Toggle 
        variant="theme"
        aria-label="Toggle theme"
        pressed={theme === "dark"}
        onPressedChange={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Moon className={`h-5 w-5 ${theme === "dark" ? "text-blue-400" : "text-gray-400"}`} />
      </Toggle>
    </div>
  );
};
