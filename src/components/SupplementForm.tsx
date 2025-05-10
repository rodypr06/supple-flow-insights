import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAddSupplement } from "@/hooks/use-supplements";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

interface SupplementFormProps {
  onComplete: () => void;
}

export const SupplementForm = ({ onComplete }: SupplementFormProps) => {
  const { toast } = useToast();
  const addSupplement = useAddSupplement();
  const queryClient = useQueryClient();
  
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [maxDosage, setMaxDosage] = useState("");
  const [capsuleMg, setCapsuleMg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name) {
      toast("Error", {
        description: "Please enter a supplement name"
      });
      return;
    }

    try {
      const { error } = await supabase.from("supplements").insert({
        name,
        image_url: imageUrl || null,
        max_dosage: parseInt(maxDosage),
        capsule_mg: parseInt(capsuleMg) || null,
      });

      if (error) throw error;

      toast("Success", {
        description: "Your new supplement has been added successfully."
      });

      // Reset form
      setName("");
      setImageUrl("");
      setMaxDosage("");
      setCapsuleMg("");

      // Refresh supplements list
      await queryClient.invalidateQueries({ queryKey: ["supplements"] });

      onComplete();
    } catch (error) {
      console.error("Error adding supplement:", error);
      toast("Error", {
        description: "Failed to add supplement. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Supplement Name</Label>
        <Input 
          id="name" 
          placeholder="e.g., Vitamin D3" 
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input 
          id="image" 
          type="url" 
          placeholder="https://example.com/image.jpg" 
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="max-dosage">Maximum Daily Dosage</Label>
        <Input 
          id="max-dosage" 
          type="number" 
          min="1" 
          value={maxDosage}
          onChange={(e) => setMaxDosage(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white" 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="capsule-mg">Capsule Milligrams</Label>
        <Input 
          id="capsule-mg" 
          type="number" 
          min="1" 
          value={capsuleMg}
          onChange={(e) => setCapsuleMg(e.target.value)}
          placeholder="e.g., 700 for kratom"
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white" 
          required
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Supplement"}
        </Button>
      </div>
    </form>
  );
};
