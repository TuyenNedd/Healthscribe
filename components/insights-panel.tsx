"use client";

import React, { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SummaryPoint } from "@/types";
import { EditorDialog } from "@/components/ui/editor-dialog";
import { cn } from "@/lib/utils";

interface InsightsPanelProps {
  summary: SummaryPoint[];
  onSummaryPointClick: (summaryPoint: SummaryPoint) => void;
  onSummaryEdit?: (pointId: string, newContent: string) => void;
  activePointId?: string;
}

export function InsightsPanel({
  summary,
  onSummaryPointClick,
  onSummaryEdit,
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
                      "p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-all duration-200 group relative",
                      activePointId === point.id && "bg-blue-50 border-blue-200"
                    )}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => onSummaryPointClick(point)}
                    >
                      <div
                        className="text-gray-700 pr-12 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: point.text }}
                      />
                      {point.versions && point.versions.length > 1 && (
                        <div className="mt-2 text-xs text-gray-500">
                          Version {point.versions.length} • Edited
                        </div>
                      )}
                    </div>
                    {onSummaryEdit && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EditorDialog
                          content={point.text}
                          onSave={(newContent) =>
                            onSummaryEdit(point.id, newContent)
                          }
                          title={`Edit ${point.category}`}
                          description="Edit this summary point. Your changes will create a new version while preserving the original."
                          triggerVariant="ghost"
                          triggerSize="sm"
                        />
                      </div>
                    )}
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
