import React from "react";
import { DosageTracker } from "@/components/DosageTracker";
import { SupplementsWidget } from "@/components/SupplementsWidget";
import { IntakeForm } from "@/components/IntakeForm";
import { IntakeHistory } from "@/components/IntakeHistory";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SupplementForm } from "@/components/SupplementForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { KratomGuidelinesTable } from "@/components/KratomGuidelinesTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { supplementGuidelines } from "@/lib/supplement-guidelines";
import { CalendarLog } from "@/components/CalendarLog";
import { useEffect, useState } from 'react';
import { useUserProfile } from "@/App";
import { useAIInsights } from "@/hooks/use-ai-insights";

export const Dashboard = () => {
  const [showIntakeForm, setShowIntakeForm] = React.useState(false);
  const [showSupplementForm, setShowSupplementForm] = React.useState(false);
  const [editMode, setEditMode] = useState(false);
  const { user } = useUserProfile();
  const { data: aiInsight, isLoading: isLoadingInsight } = useAIInsights(user);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <Dialog open={showIntakeForm} onOpenChange={setShowIntakeForm}>
            <DialogTrigger asChild>
              <Button>Log Intake</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Supplement Intake</DialogTitle>
              </DialogHeader>
              <IntakeForm onComplete={() => setShowIntakeForm(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column (spans 2 columns on desktop) */}
        <div className="space-y-6 lg:col-span-2">
          <div className="bg-card/50 p-6 rounded-xl border border-border">
            <h2 className="text-lg font-semibold mb-4">Today's Dosage</h2>
            <DosageTracker />
          </div>
          <div className="bg-card/50 p-6 rounded-xl border border-border">
            <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
            {isLoadingInsight ? (
              <div>Generating insights...</div>
            ) : aiInsight ? (
              <div className="text-sm text-muted-foreground whitespace-pre-line break-words">{aiInsight}</div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No insights available yet. Log some intakes to get personalized recommendations.
              </p>
            )}
          </div>
          <div className="bg-card/50 p-6 rounded-xl border border-border">
            <h2 className="text-lg font-semibold mb-4">Intake Calendar</h2>
            <CalendarLog />
            <Button 
              onClick={() => setShowIntakeForm(true)} 
              className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Log New Intake
            </Button>
          </div>
          <div className="bg-card/50 p-6 rounded-xl border border-border">
            <IntakeHistory />
          </div>
        </div>
        {/* Sidebar column */}
        <div className="space-y-6">
          <div className="bg-card/50 p-6 rounded-xl border border-border">
            <h2 className="text-lg font-semibold mb-4">My Supplements</h2>
            <SupplementsWidget />
            <Dialog open={showSupplementForm} onOpenChange={setShowSupplementForm}>
              <DialogTrigger asChild>
                <Button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Add New Supplement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Supplement</DialogTitle>
                </DialogHeader>
                <SupplementForm onComplete={() => setShowSupplementForm(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}; 