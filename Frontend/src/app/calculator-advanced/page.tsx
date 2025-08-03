"use client";

import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import AutopilotForm from "@/app/components/Calculator/AutopilotForm";
import CBAMForm from "@/app/components/Calculator/CBAMForm";
import CustomMappingForm from "@/app/components/Calculator/CustomMappingForm";
import Results from "@/app/components/Calculator/Results";
import { EmissionResult } from "../services/types";
import { Car, Building2, Settings } from "lucide-react";

export default function AdvancedCalculatorPage() {
  const [results, setResults] = useState<EmissionResult | null>(null);

  const handleResult = (data: EmissionResult) => {
    setResults(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
            進階碳排放計算器
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            專業的碳排放計算工具，支援多種計算方法和標準
          </p>
        </div>

        <Tabs defaultValue="autopilot" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="autopilot"
              className="flex items-center space-x-2"
            >
              <Car className="h-4 w-4" />
              <span>自動駕駛</span>
            </TabsTrigger>
            <TabsTrigger value="cbam" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>CBAM</span>
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>自訂映射</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="autopilot">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="h-5 w-5" />
                  <span>自動駕駛碳排放估算器</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  計算自動駕駛車輛的碳排放量，包括不同駕駛模式和路況的影響
                </p>
              </CardHeader>
              <CardContent>
                <AutopilotForm onResult={handleResult} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cbam">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>CBAM 碳排放計算器</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  根據歐盟碳邊境調整機制 (CBAM) 標準計算產品碳排放
                </p>
              </CardHeader>
              <CardContent>
                <CBAMForm onResult={handleResult} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>自訂映射計算器</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  使用自訂的排放因子和映射規則進行精確的碳排放計算
                </p>
              </CardHeader>
              <CardContent>
                <CustomMappingForm onResult={handleResult} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {results && (
          <div className="mt-6">
            <Results data={results} />
          </div>
        )}
      </div>
    </div>
  );
}
