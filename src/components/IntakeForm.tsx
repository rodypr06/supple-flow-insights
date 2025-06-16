import React, { useState } from "react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSupplements } from "../hooks/use-supplements";
import { useIntakes } from '../hooks/use-intakes';
import { useUserProfile } from "@/App";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Intake } from '@/lib/local-storage-db';

export interface IntakeFormProps {
  onComplete: () => void;
  onError: (error: Error) => void;
}

export const IntakeForm = ({ onComplete, onError }: IntakeFormProps) => {
  const { toast } = useToast();
  const { user } = useUserProfile();
  const { supplements, isLoading: isLoadingSupplements } = useSupplements(user);
  const { createIntake, isCreating } = useIntakes();
  
  // Default to current time for new intakes
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [supplementId, setSupplementId] = useState("");
  const [dosage, setDosage] = useState('');
  const [notes, setNotes] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supplementId || !user) {
      toast("Error", {
        description: "Please select a supplement and ensure you are logged in"
      });
      return;
    }

    try {
      // Parse the time and create a new date for today
      const takenAt = new Date();
      const [hours, minutes] = time.split(":").map(Number);
      takenAt.setHours(hours, minutes, 0, 0);

      const newIntake: Omit<Intake, 'id' | 'created_at'> = {
        supplement_id: supplementId,
        user_id: user,
        dosage: parseFloat(dosage),
        taken_at: takenAt.toISOString(),
        notes
      };

      await createIntake(newIntake);

      toast("Success", {
        description: "Your supplement intake has been recorded."
      });
      onComplete();
    } catch (error) {
      console.error('Error adding intake:', error);
      onError(error as Error);
    }
  };
  
  if (isLoadingSupplements) {
    return <div>Loading...</div>;
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="supplement">Supplement</Label>
        <Select value={supplementId} onValueChange={setSupplementId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a supplement" />
          </SelectTrigger>
          <SelectContent>
            {supplements?.map((supplement) => (
              <SelectItem key={supplement.id} value={supplement.id}>
                {supplement.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      
      <div className="space-y-2">
        <Label htmlFor="dosage">Dosage</Label>
        <Input
          id="dosage"
          type="number"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="Enter dosage"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this intake"
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating || isLoadingSupplements}>
          {isCreating ? 'Logging...' : 'Log Intake'}
        </Button>
      </div>
    </form>
  );
};
