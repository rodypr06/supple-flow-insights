import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Dashboard } from "@/pages/Dashboard";
import NotFound from "./pages/NotFound";
import { createContext, useContext, useState, ReactNode } from 'react';

// User profile context for local user selection
interface UserProfileContextType {
  user: string;
  setUser: (name: string) => void;
}
const UserProfileContext = createContext<UserProfileContextType>({ user: '', setUser: () => {} });

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState(() => localStorage.getItem('user_profile') || '');
  const setUser = (name: string) => {
    setUserState(name);
    localStorage.setItem('user_profile', name);
  };
  return (
    <UserProfileContext.Provider value={{ user, setUser }}>
      {children}
    </UserProfileContext.Provider>
  );
}
export function useUserProfile() {
  return useContext(UserProfileContext);
}

function UserProfileSelector() {
  const { user, setUser } = useUserProfile();
  const [input, setInput] = useState('');
  const [profiles, setProfiles] = useState(() => {
    const p = localStorage.getItem('user_profiles');
    return p ? JSON.parse(p) : [];
  });

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser(e.target.value);
  };
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newProfiles = [...new Set([...profiles, input.trim()])];
    setProfiles(newProfiles);
    setUser(input.trim());
    localStorage.setItem('user_profiles', JSON.stringify(newProfiles));
    setInput('');
  };

  return (
    <div className="flex flex-col items-center mt-8 mb-8">
      <div className="mb-2">Select or create a user profile:</div>
      <select value={user} onChange={handleSelect} className="mb-2 p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white">
        <option value="">-- Select User --</option>
        {profiles.map((p: string) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter new user name"
        />
        <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">Create</button>
      </form>
    </div>
  );
}

function AppContent() {
  const { user } = useUserProfile();
  if (!user) return <UserProfileSelector />;
  return <Dashboard />;
}

const queryClient = new QueryClient();

const App = () => (
  <UserProfileProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppContent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </UserProfileProvider>
);

export default App;
