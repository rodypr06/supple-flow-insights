
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const DosageTracker = () => {
  // This is a placeholder for data that will come from Supabase
  const dosageData = [
    {
      id: "1",
      name: "Vitamin D",
      remaining: 3, 
      max: 4,
      lastTaken: "9:00 AM"
    },
    {
      id: "2",
      name: "Omega-3",
      remaining: 2, 
      max: 2,
      lastTaken: "7:30 AM"
    },
    {
      id: "3",
      name: "Magnesium",
      remaining: 0, 
      max: 2,
      lastTaken: "10:15 PM"
    }
  ];

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-muted-foreground">Supplement</TableHead>
            <TableHead className="text-muted-foreground text-right">Remaining/Max</TableHead>
            <TableHead className="text-muted-foreground text-right">Last Taken</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dosageData.map((item) => (
            <TableRow key={item.id} className="hover:bg-accent/50 border-border">
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-right">
                <span className={`px-2 py-1 rounded text-xs ${item.remaining === 0 ? 'bg-red-500/20 text-red-500 dark:text-red-300' : 'bg-blue-500/20 text-blue-500 dark:text-blue-300'}`}>
                  {item.remaining}/{item.max}
                </span>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">{item.lastTaken}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
        <p className="text-sm text-purple-700 dark:text-purple-300">
          <span className="font-semibold">AI Insight:</span> Your daily vitamin intake has been consistent this week. Consider taking Magnesium earlier in the day for improved sleep quality.
        </p>
      </div>
    </div>
  );
};
