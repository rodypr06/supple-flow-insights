import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTodayIntakes } from "@/hooks/use-intakes";
import { useSupplements } from "@/hooks/use-supplements";
import { useAIInsights } from "@/hooks/use-ai-insights";
import { format } from "date-fns";
import { supplementGuidelines } from '@/lib/supplement-guidelines';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { KratomGuidelinesTable } from './KratomGuidelinesTable';

export const DosageTracker = () => {
  const { data: intakes, isLoading: isLoadingIntakes } = useTodayIntakes();
  const { data: supplements, isLoading: isLoadingSupplements } = useSupplements();
  const { data: aiInsight, isLoading: isLoadingInsight } = useAIInsights();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  if (isLoadingIntakes || isLoadingSupplements) {
    return <div>Loading...</div>;
  }

  // Calculate remaining dosages for each supplement
  const remainingDosages = supplements?.map(supplement => {
    const todayIntakes = intakes?.filter(
      intake => intake.supplement_id === supplement.id
    ) || [];
    const totalTaken = todayIntakes.reduce(
      (sum, intake) => sum + intake.quantity,
      0
    );
    const lastIntake = todayIntakes.length > 0
      ? new Date(todayIntakes[todayIntakes.length - 1].taken_at)
      : null;
    return {
      ...supplement,
      remaining: supplement.max_dosage - totalTaken,
      lastIntake,
      todayIntakes,
    };
  }) || [];

  // Calculate total kratom intake
  const kratomIntakes = intakes?.filter(intake => {
    const supplement = supplements?.find(s => s.id === intake.supplement_id);
    return supplement?.name.toLowerCase().includes('kratom');
  }) || [];

  const totalKratomGrams = kratomIntakes.reduce((total, intake) => {
    const supplement = supplements?.find(s => s.id === intake.supplement_id);
    return total + (intake.quantity * (supplement?.milligrams || 0) / 1000);
  }, 0);

  const handleDeleteIntake = async (intakeId: string) => {
    if (!confirm('Are you sure you want to delete this intake?')) return;
    try {
      setIsDeleting(intakeId);
      const { error } = await supabase
        .from('intakes')
        .delete()
        .eq('id', intakeId);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ['intakes'] });
      toast({ description: 'Intake deleted successfully' });
    } catch (error) {
      toast({ description: 'Failed to delete intake', variant: 'destructive' });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplement</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Last Taken</TableHead>
                <TableHead>Today's Intakes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {remainingDosages.map((supplement) => (
                <TableRow key={supplement.id}>
                  <TableCell>{supplement.name}</TableCell>
                  <TableCell>{supplement.remaining} units</TableCell>
                  <TableCell>
                    {supplement.lastIntake
                      ? supplement.lastIntake.toLocaleTimeString()
                      : 'Not taken today'}
                  </TableCell>
                  <TableCell>
                    <ul className="space-y-1">
                      {supplement.todayIntakes.length === 0 && <li className="text-xs text-muted-foreground">None</li>}
                      {supplement.todayIntakes.map((intake: any) => (
                        <li key={intake.id} className="flex items-center gap-2 text-xs">
                          <span>{intake.quantity} @ {new Date(intake.taken_at).toLocaleTimeString()}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteIntake(intake.id)}
                            disabled={isDeleting === intake.id}
                            title="Delete intake"
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {kratomIntakes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kratom Intake Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-lg font-medium">
                Total Kratom Today: {totalKratomGrams.toFixed(1)}g
              </div>
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Kratom Guidelines</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4 mt-2">
                    {supplementGuidelines.kratom.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
              <KratomGuidelinesTable />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingInsight ? (
            <div>Generating insights...</div>
          ) : aiInsight ? (
            <p className="text-sm text-muted-foreground">{aiInsight}</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No insights available yet. Log some intakes to get personalized recommendations.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
