
import React, { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { DosageTracker } from "@/components/DosageTracker";
import { SupplementsWidget } from "@/components/SupplementsWidget";
import { FactWidget } from "@/components/FactWidget";
import { CalendarLog } from "@/components/CalendarLog";
import { SupplementForm } from "@/components/SupplementForm";
import { IntakeForm } from "@/components/IntakeForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [activeDialog, setActiveDialog] = useState<"supplement" | "intake" | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">SuppleTrack</h1>
          <p className="text-gray-400 mt-2">Track your supplements, optimize your health</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dosage Tracker Widget */}
          <div className="p-6 rounded-2xl bg-gray-900/70 backdrop-blur-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="bg-blue-500/20 p-2 rounded-lg mr-3">
                <CalendarIcon className="h-5 w-5 text-blue-400" />
              </span>
              Today's Dosage
            </h2>
            <DosageTracker />
          </div>

          {/* Supplements Widget */}
          <div className="p-6 rounded-2xl bg-gray-900/70 backdrop-blur-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">My Supplements</h2>
            <SupplementsWidget />
            <Button 
              onClick={() => setActiveDialog("supplement")} 
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Add New Supplement
            </Button>
          </div>

          {/* Fact Widget */}
          <div className="p-6 rounded-2xl bg-gray-900/70 backdrop-blur-lg border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Did You Know?</h2>
            <FactWidget />
          </div>

          {/* Calendar Log - Full Width */}
          <div className="p-6 rounded-2xl bg-gray-900/70 backdrop-blur-lg border border-gray-800 md:col-span-2 lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Intake Calendar</h2>
            <CalendarLog />
            <Button 
              onClick={() => setActiveDialog("intake")} 
              className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Log New Intake
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs for adding supplements and intakes */}
      <Dialog open={activeDialog === "supplement"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="bg-gray-900 border border-gray-800">
          <DialogHeader>
            <DialogTitle>Add New Supplement</DialogTitle>
          </DialogHeader>
          <SupplementForm onComplete={() => setActiveDialog(null)} />
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "intake"} onOpenChange={() => setActiveDialog(null)}>
        <DialogContent className="bg-gray-900 border border-gray-800">
          <DialogHeader>
            <DialogTitle>Log Supplement Intake</DialogTitle>
          </DialogHeader>
          <IntakeForm onComplete={() => setActiveDialog(null)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
