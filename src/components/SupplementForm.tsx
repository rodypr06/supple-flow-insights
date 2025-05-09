
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SupplementFormProps {
  onComplete: () => void;
}

export const SupplementForm = ({ onComplete }: SupplementFormProps) => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This will be replaced with actual Supabase integration
    setTimeout(() => {
      toast({
        title: "Supplement added",
        description: "Your new supplement has been added successfully."
      });
      onComplete();
    }, 500);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Supplement Name</Label>
        <Input id="name" placeholder="e.g., Vitamin D3" className="bg-gray-800 border-gray-700" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" type="url" placeholder="https://example.com/image.jpg" className="bg-gray-800 border-gray-700" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="max-dosage">Maximum Daily Dosage</Label>
        <Input id="max-dosage" type="number" min="1" defaultValue="1" className="bg-gray-800 border-gray-700" />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">Save Supplement</Button>
      </div>
    </form>
  );
};
