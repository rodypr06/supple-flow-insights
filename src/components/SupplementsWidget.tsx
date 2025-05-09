
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const SupplementsWidget = () => {
  // This is a placeholder for data that will come from Supabase
  const supplements = [
    {
      id: "1",
      name: "Vitamin D",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
      maxDosage: 4
    },
    {
      id: "2",
      name: "Omega-3",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
      maxDosage: 2
    },
    {
      id: "3",
      name: "Magnesium",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
      maxDosage: 2
    }
  ];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-muted-foreground">Supplement</TableHead>
            <TableHead className="text-muted-foreground text-right">Max Daily</TableHead>
            <TableHead className="text-muted-foreground text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supplements.map((supplement) => (
            <TableRow key={supplement.id} className="hover:bg-accent/50 border-border">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-muted overflow-hidden">
                    <img 
                      src={supplement.image} 
                      alt={supplement.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-medium">{supplement.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">{supplement.maxDosage}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Edit</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
