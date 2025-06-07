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
import { useSupplements, useUpdateSupplement, useDeleteSupplement } from "@/hooks/use-supplements";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase, type Supplement } from "@/lib/supabase";
import { Trash2, Pencil } from "lucide-react";
import { useUserProfile } from "@/App";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const { mutateAsync: updateSupplement } = useUpdateSupplement(user);
  const [name, setName] = useState(supplement.name);
  const [maxDosage, setMaxDosage] = useState(supplement.max_dosage);
  const [capsuleMg, setCapsuleMg] = useState(supplement.capsule_mg || 0);
  const [imageUrl, setImageUrl] = useState(supplement.image_url || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSupplement({
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
  const { supplements, isLoading } = useSupplements(user);
  const { mutateAsync: updateSupplement } = useUpdateSupplement(user);
  const { mutateAsync: deleteSupplement, isPending: isDeleting } = useDeleteSupplement(user);
  const { toast } = useToast();
  const [editSupplement, setEditSupplement] = useState<Supplement | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDosage, setEditDosage] = useState("");
  const [editUnit, setEditUnit] = useState("mg");

  const handleDelete = async (supplementId: string) => {
    if (!confirm('Are you sure you want to delete this supplement?')) {
      return;
    }

    try {
      await deleteSupplement(supplementId);
      toast("Supplement deleted successfully");
    } catch (error) {
      console.error('Error deleting supplement:', error);
      toast("Failed to delete supplement");
    }
  };

  const handleEdit = (supplement: Supplement) => {
    setEditingId(supplement.id);
    setEditName(supplement.name);
    setEditDosage(supplement.max_dosage.toString());
    setEditUnit("mg");
  };

  const handleSave = async (id: string) => {
    try {
      await updateSupplement({
        id,
        name: editName,
        max_dosage: parseFloat(editDosage),
      });
      setEditingId(null);
      toast("Success", {
        description: "Supplement updated successfully"
      });
    } catch (error) {
      toast("Error", {
        description: "Failed to update supplement"
      });
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
              {editingId === supplement.id ? (
                <TableCell>
                  <div className="flex gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-32"
                    />
                    <Input
                      type="number"
                      value={editDosage}
                      onChange={(e) => setEditDosage(e.target.value)}
                      className="w-24"
                    />
                    <Button onClick={() => handleSave(supplement.id)}>Save</Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </TableCell>
              ) : (
                <TableCell>{supplement.name} - {supplement.max_dosage} mg</TableCell>
              )}
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(supplement)}
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
