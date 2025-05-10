import React, { useState } from "react";
import { format, parse } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSupplements } from "@/hooks/use-supplements";
import { useAddIntake } from "@/hooks/use-intakes";

interface IntakeFormProps {
  onComplete: () => void;
}

export const IntakeForm = ({ onComplete }: IntakeFormProps) => {
  const { toast } = useToast();
  const { data: supplements, isLoading: isLoadingSupplements } = useSupplements();
  const addIntake = useAddIntake();
  
  // Default to current time for new intakes
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [supplementId, setSupplementId] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supplementId) {
      toast("Error", {
        description: "Please select a supplement"
      });
      return;
    }

    try {
      // Parse the time and create a new date for today
      const takenAt = new Date();
      const [hours, minutes] = time.split(":").map(Number);
      takenAt.setHours(hours, minutes, 0, 0);

      await addIntake.mutateAsync({
        supplement_id: supplementId,
        quantity,
        taken_at: takenAt.toISOString()
      });

      toast("Success", {
        description: "Your supplement intake has been recorded."
      });
      onComplete();
    } catch (error) {
      console.error('Error adding intake:', error);
      toast("Error", {
        description: "Failed to record intake. Please try again."
      });
    }
  };
  
  if (isLoadingSupplements) {
    return <div>Loading...</div>;
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="supplement">Supplement</Label>
        <select 
          id="supplement" 
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md h-10 px-3 py-2 text-sm"
          value={supplementId}
          onChange={(e) => setSupplementId(e.target.value)}
        >
          <option value="">Select a supplement</option>
          {supplements?.map(supplement => (
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
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white" 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Input 
          id="time" 
          type="time" 
          value={time} 
          onChange={(e) => setTime(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white" 
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit" disabled={addIntake.isPending}>
          {addIntake.isPending ? "Logging..." : "Log Intake"}
        </Button>
      </div>
    </form>
  );
};
