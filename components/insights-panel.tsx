"use client";

import React, { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SummaryPoint } from "@/types";
import { cn } from "@/lib/utils";

interface InsightsPanelProps {
  summary: SummaryPoint[];
  onSummaryPointClick: (summaryPoint: SummaryPoint) => void;
  activePointId?: string;
}

export function InsightsPanel({
  summary,
  onSummaryPointClick,
  activePointId,
}: InsightsPanelProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Group summary points by category
  const summaryByCategory = summary.reduce<Record<string, SummaryPoint[]>>(
    (acc, point) => {
      if (!acc[point.category]) {
        acc[point.category] = [];
      }
      acc[point.category].push(point);
      return acc;
    },
    {}
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Summarizations</h2>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="space-y-6 pr-4">
          {Object.entries(summaryByCategory).map(([category, points]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
                {category}
              </h3>
              <div className="space-y-2">
                {points.map((point) => (
                  <div
                    key={point.id}
                    className={cn(
                      "p-3 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all duration-200",
                      activePointId === point.id && "bg-blue-50 border-blue-200"
                    )}
                    onClick={() => onSummaryPointClick(point)}
                  >
                    <p className="text-gray-700">{point.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
