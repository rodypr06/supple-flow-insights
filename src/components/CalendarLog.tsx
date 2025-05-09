
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const CalendarLog = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // This is placeholder data that will come from Supabase
  const intakeData = [
    { id: "1", supplement: "Vitamin D", quantity: 1, time: "2023-09-01T09:00:00" },
    { id: "2", supplement: "Omega-3", quantity: 2, time: "2023-09-01T07:30:00" },
    { id: "3", supplement: "Magnesium", quantity: 1, time: "2023-09-01T22:15:00" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="bg-gray-800/50 p-4 rounded-xl">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="p-3 pointer-events-auto bg-transparent"
          />
        </div>
      </div>
      
      <div className="md:col-span-2">
        <h3 className="text-lg font-medium mb-4">
          {date ? format(date, "MMMM d, yyyy") : "Select a date"}
        </h3>
        
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-gray-400">Supplement</TableHead>
              <TableHead className="text-gray-400 text-center">Quantity</TableHead>
              <TableHead className="text-gray-400 text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {intakeData.length > 0 ? (
              intakeData.map((intake) => (
                <TableRow key={intake.id} className="hover:bg-gray-800/50 border-gray-800">
                  <TableCell className="font-medium">{intake.supplement}</TableCell>
                  <TableCell className="text-center">{intake.quantity}</TableCell>
                  <TableCell className="text-right">
                    {format(new Date(intake.time), "h:mm a")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                  No intakes recorded for this date
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
