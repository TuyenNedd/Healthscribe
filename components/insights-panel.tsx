"use client";

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SummaryPoint } from '@/types';

interface InsightsPanelProps {
  summary: SummaryPoint[];
  onSummaryPointClick: (summaryPoint: SummaryPoint) => void;
  activePointId?: string;
}

export function InsightsPanel({
  summary,
  onSummaryPointClick,
  activePointId
}: InsightsPanelProps) {
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
      <h2 className="text-2xl font-bold mb-4">Insights</h2>
      
      <Tabs defaultValue="summarizations" className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="summarizations">Summarizations</TabsTrigger>
          {/* Additional tabs can be added here for future features */}
        </TabsList>
        
        <TabsContent value="summarizations" className="flex-1 mt-4">
          <ScrollArea className="h-full">
            <div className="space-y-6 pr-4">
              {Object.entries(summaryByCategory).map(([category, points]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800">{category}</h3>
                  <div className="space-y-2">
                    {points.map(point => (
                      <div 
                        key={point.id}
                        className={`
                          p-2 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer
                          ${activePointId === point.id ? 'bg-blue-50 border-blue-200' : ''}
                        `}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}