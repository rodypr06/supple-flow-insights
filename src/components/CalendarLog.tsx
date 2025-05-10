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
import { useIntakesByDate } from '@/hooks/use-intakes';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { addMonths, startOfMonth, endOfMonth, format as formatDate, isSameDay, isToday, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';

export const CalendarLog = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(startOfMonth(new Date()));

  // Fetch all intakes for the visible month
  const { data: monthIntakes, isLoading: isMonthLoading } = useQuery({
    queryKey: ['intakes-month', month.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('intake_logs')
        .select('id, taken_at, quantity, supplements (name)')
        .gte('taken_at', startOfMonth(month).toISOString())
        .lte('taken_at', endOfMonth(month).toISOString());
      if (error) throw error;
      return data || [];
    },
  });

  // Map: YYYY-MM-DD => count
  const intakeMap: Record<string, number> = {};
  (monthIntakes || []).forEach((intake) => {
    const d = formatDate(new Date(intake.taken_at), 'yyyy-MM-dd');
    intakeMap[d] = (intakeMap[d] || 0) + 1;
  });

  // For quick jump
  const allDays = Object.keys(intakeMap).sort();
  const latestIntakeDay = allDays.length > 0 ? parseISO(allDays[allDays.length - 1]) : undefined;

  // Fetch intakes for selected day
  const { data: intakes, isLoading } = useIntakesByDate(date || new Date());

  // Custom day render for react-day-picker
  function renderDay(props: any) {
    const day = props.date;
    const key = formatDate(day, 'yyyy-MM-dd');
    const hasIntake = intakeMap[key];
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="relative flex items-center justify-center w-full h-full">
            <span>{day.getDate()}</span>
            {hasIntake && (
              <span className="absolute bottom-1 right-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {intakeMap[key]}
              </span>
            )}
            {hasIntake && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setDate(day)}>
            View Intakes
          </ContextMenuItem>
          <ContextMenuItem onClick={() => {/* trigger add intake for this day */}}>
            Add Intake
          </ContextMenuItem>
          {/* Optionally, add edit/delete actions here */}
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="bg-card/50 p-4 rounded-xl border border-border">
          <div className="flex gap-2 mb-2">
            <Button size="sm" onClick={() => setDate(new Date())}>Today</Button>
            {latestIntakeDay && (
              <Button size="sm" variant="outline" onClick={() => setDate(latestIntakeDay)}>
                Latest Intake
              </Button>
            )}
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={month}
            onMonthChange={setMonth}
            className="p-3 pointer-events-auto bg-transparent"
            components={{ Day: renderDay }}
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
              <TableHead className="text-muted-foreground">Supplement</TableHead>
              <TableHead className="text-muted-foreground text-center">Quantity</TableHead>
              <TableHead className="text-muted-foreground text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : intakes && intakes.length > 0 ? (
              intakes.map((intake) => (
                <TableRow key={intake.id} className="hover:bg-accent/50 border-border">
                  <TableCell className="font-medium">{intake.supplements?.name || 'Unknown'}</TableCell>
                  <TableCell className="text-center">{intake.quantity}</TableCell>
                  <TableCell className="text-right">
                    {format(new Date(intake.taken_at), "h:mm a")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
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
