import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAddSupplement } from "@/hooks/use-supplements";
import { useUserProfile } from "@/App";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SupplementFormProps {
  onComplete: () => void;
}

export const SupplementForm = ({ onComplete }: SupplementFormProps) => {
  const { toast } = useToast();
  const { user } = useUserProfile();
  const addSupplement = useAddSupplement(user);
  const queryClient = useQueryClient();
  
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [dosage, setDosage] = useState("");
  const [unit, setUnit] = useState("mg");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name || !dosage) {
      toast("Error", {
        description: "Please enter a supplement name and dosage"
      });
      return;
    }

    try {
      await addSupplement.mutateAsync({
        name,
        image_url: imageUrl || null,
        max_dosage: parseFloat(dosage),
      });

      toast("Success", {
        description: "Supplement added successfully"
      });

      // Reset form
      setName("");
      setImageUrl("");
      setDosage("");
      setUnit("mg");

      // Refresh supplements list
      queryClient.invalidateQueries({ queryKey: ['supplements'] });
      onComplete();
    } catch (error) {
      toast("Error", {
        description: "Failed to add supplement"
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
          required
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
        <Label htmlFor="dosage">Dosage</Label>
        <Input 
          id="dosage" 
          type="number" 
          min="1" 
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white" 
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="unit">Unit</Label>
        <Select value={unit} onValueChange={setUnit}>
          <SelectTrigger>
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mg">mg</SelectItem>
            <SelectItem value="g">g</SelectItem>
            <SelectItem value="mcg">mcg</SelectItem>
            <SelectItem value="IU">IU</SelectItem>
            <SelectItem value="ml">ml</SelectItem>
            <SelectItem value="oz">oz</SelectItem>
          </SelectContent>
        </Select>
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
