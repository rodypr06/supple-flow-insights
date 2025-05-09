
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Switch } from "@/components/ui/switch";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Sun className={`h-5 w-5 ${theme === "light" ? "text-yellow-500" : "text-muted-foreground"}`} />
      <Switch 
        checked={theme === "dark"}
        onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
      />
      <Moon className={`h-5 w-5 ${theme === "dark" ? "text-blue-400" : "text-muted-foreground"}`} />
    </div>
  );
};
