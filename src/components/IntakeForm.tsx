import React, { useState } from "react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface IntakeFormProps {
  onComplete: () => void;
}

export const IntakeForm = ({ onComplete }: IntakeFormProps) => {
  const { toast } = useToast();
  
  // Default to current time for new intakes
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  
  // This is placeholder data that will come from Supabase
  const supplements = [
    { id: "1", name: "Vitamin D" },
    { id: "2", name: "Omega-3" },
    { id: "3", name: "Magnesium" }
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This will be replaced with actual Supabase integration
    // Logic will include checks to prevent exceeding max dosage
    setTimeout(() => {
      toast("Intake logged", {
        description: "Your supplement intake has been recorded."
      });
      onComplete();
    }, 500);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="supplement">Supplement</Label>
        <select 
          id="supplement" 
          className="w-full bg-gray-800 border border-gray-700 rounded-md h-10 px-3 py-2 text-sm"
        >
          <option value="">Select a supplement</option>
          {supplements.map(supplement => (
            <option key={supplement.id} value={supplement.id}>
              {supplement.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input 
          id="quantity" 
          type="number" 
          min="1" 
          defaultValue="1" 
          className="bg-gray-800 border-gray-700" 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Input 
          id="time" 
          type="time" 
          value={time} 
          onChange={(e) => setTime(e.target.value)}
          className="bg-gray-800 border-gray-700" 
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">Log Intake</Button>
      </div>
    </form>
  );
};
