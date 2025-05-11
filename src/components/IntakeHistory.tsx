import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useTodayIntakes } from "@/hooks/use-intakes";
import { useSupplements } from "@/hooks/use-supplements";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trash2, Pencil } from "lucide-react";
import { format } from "date-fns";
import { useUserProfile } from "@/App";

interface EditIntakeFormProps {
  intake: {
    id: string;
    supplement_id: string;
    quantity: number;
    taken_at: string;
  };
  supplements: Array<{ id: string; name: string }>;
  onClose: () => void;
}

const EditIntakeForm = ({ intake, supplements, onClose }: EditIntakeFormProps) => {
  const { toast } = useToast();
  const [supplementId, setSupplementId] = useState(intake.supplement_id);
  const [quantity, setQuantity] = useState(intake.quantity);
  const [time, setTime] = useState(format(new Date(intake.taken_at), "HH:mm"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const takenAt = new Date(intake.taken_at);
      const [hours, minutes] = time.split(":").map(Number);
      takenAt.setHours(hours, minutes, 0, 0);

      const { error } = await supabase
        .from('intake_logs')
        .update({
          supplement_id: supplementId,
          quantity,
          taken_at: takenAt.toISOString()
        })
        .eq('id', intake.id);

      if (error) throw error;

      toast("Intake updated successfully.");
      onClose();
    } catch (error) {
      console.error('Error updating intake:', error);
      toast("Failed to update intake. Please try again.");
    }
  };

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
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export function IntakeHistory() {
  const { user } = useUserProfile();
  const { data: intakes, isLoading } = useTodayIntakes(user);
  const { data: supplements } = useSupplements(user);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (intakeId: string) => {
    if (!confirm('Are you sure you want to delete this intake?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('intakes')
        .delete()
        .eq('id', intakeId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['intakes'] });
      toast("Intake deleted successfully");
    } catch (error) {
      console.error('Error deleting intake:', error);
      toast("Failed to delete intake");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Today's Intakes</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplement</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Time Taken</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {intakes?.map((intake) => {
            const supplement = supplements?.find(s => s.id === intake.supplement_id);
            return (
              <TableRow key={intake.id}>
                <TableCell>{supplement?.name}</TableCell>
                <TableCell>{intake.quantity} units</TableCell>
                <TableCell>{new Date(intake.taken_at).toLocaleTimeString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(intake.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
} 