
// Import only what's available from sonner
import { toast as toastFunction } from "sonner";

// Re-export the toast function
export const toast = toastFunction;

// Create our own hook that provides the toast function
export const useToast = () => {
  return {
    toast: toastFunction,
    // This empty object with toasts property is to maintain compatibility
    // with components expecting this structure from Radix UI's useToast
    toasts: []
  };
};
