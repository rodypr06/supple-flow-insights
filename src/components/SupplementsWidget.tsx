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
import { useSupplements } from "@/hooks/use-supplements";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase, type Supplement } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Pencil } from "lucide-react";
import { useUserProfile } from "@/App";
import { useUpdateSupplement } from "@/hooks/use-supplements";

interface EditSupplementFormProps {
  supplement: {
    id: string;
    name: string;
    max_dosage: number;
    capsule_mg?: number;
    image_url?: string;
  };
  onClose: () => void;
}

const EditSupplementForm = ({ supplement, onClose }: EditSupplementFormProps) => {
  const { toast } = useToast();
  const { user } = useUserProfile();
  const updateSupplement = useUpdateSupplement(user);
  const [name, setName] = useState(supplement.name);
  const [maxDosage, setMaxDosage] = useState(supplement.max_dosage);
  const [capsuleMg, setCapsuleMg] = useState(supplement.capsule_mg || 0);
  const [imageUrl, setImageUrl] = useState(supplement.image_url || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSupplement.mutateAsync({
        id: supplement.id,
        name,
        max_dosage: maxDosage,
        capsule_mg: capsuleMg,
        image_url: imageUrl || null
      });
      toast("Success: Supplement updated successfully.");
      onClose();
    } catch (error) {
      console.error('Error updating supplement:', error);
      toast("Error: Failed to update supplement. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-800 border-gray-700"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="maxDosage">Max Daily Dosage</Label>
        <Input
          id="maxDosage"
          type="number"
          min="1"
          value={maxDosage}
          onChange={(e) => setMaxDosage(Number(e.target.value))}
          className="bg-gray-800 border-gray-700"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="capsuleMg">Capsule Mg</Label>
        <Input
          id="capsuleMg"
          type="number"
          min="0"
          value={capsuleMg}
          onChange={(e) => setCapsuleMg(Number(e.target.value))}
          className="bg-gray-800 border-gray-700"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="bg-gray-800 border-gray-700"
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

export function SupplementsWidget() {
  const { user } = useUserProfile();
  const { data: supplements, isLoading } = useSupplements(user);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [editSupplement, setEditSupplement] = useState<Supplement | null>(null);

  const handleDelete = async (supplementId: string) => {
    if (!confirm('Are you sure you want to delete this supplement?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('supplements')
        .delete()
        .eq('id', supplementId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['supplements'] });
      toast("Supplement deleted successfully");
    } catch (error) {
      console.error('Error deleting supplement:', error);
      toast("Failed to delete supplement");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Max Daily Dosage</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supplements?.map((supplement) => (
            <TableRow key={supplement.id}>
              <TableCell>{supplement.name}</TableCell>
              <TableCell>{supplement.max_dosage} units</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditSupplement(supplement)}
                  >
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(supplement.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editSupplement && (
        <Dialog open={!!editSupplement} onOpenChange={() => setEditSupplement(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Supplement</DialogTitle>
            </DialogHeader>
            <EditSupplementForm supplement={editSupplement} onClose={() => setEditSupplement(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
