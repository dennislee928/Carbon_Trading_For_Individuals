"use client";
import { useState } from "react";
import TravelForm from "@/app/components/Calculator/TravelForm";
import ProcurementForm from "@/app/components/Calculator/ProcurementForm";
import FreightForm from "@/app/components/Calculator/FreightForm";
import EnergyForm from "@/app/components/Calculator/EnergyForm";
import Results from "@/app/components/Calculator/Results";
import { EmissionResult } from "../services/types";
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

export default function UnifiedCalculatorPage() {
  const [results, setResults] = useState<EmissionResult | null>(null);

  const handleResult = (data: EmissionResult) => {
    setResults(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-green-700">
          碳排放計算器
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-green-700">
                  選擇計算類型
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="travel" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
                    <TabsTrigger value="travel" className="text-sm">
                      旅行
                    </TabsTrigger>
                    <TabsTrigger value="procurement" className="text-sm">
                      採購
                    </TabsTrigger>
                    <TabsTrigger value="freight" className="text-sm">
                      運輸
                    </TabsTrigger>
                    <TabsTrigger value="energy" className="text-sm">
                      能源
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="travel" className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="text-lg font-semibold text-green-800 mb-3">
                        旅行碳排放計算
                      </h3>
                      <p className="text-sm text-green-700 mb-4">
                        計算您的旅行活動產生的碳排放量，包括汽車、火車、飛機等不同交通方式。
                      </p>
                      <TravelForm onResult={handleResult} />
                    </div>
                  </TabsContent>

                  <TabsContent value="procurement" className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3">
                        採購碳排放計算
                      </h3>
                      <p className="text-sm text-blue-700 mb-4">
                        計算採購活動的碳排放量，包括商品和服務的碳足跡。
                      </p>
                      <ProcurementForm onResult={handleResult} />
                    </div>
                  </TabsContent>

                  <TabsContent value="freight" className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h3 className="text-lg font-semibold text-orange-800 mb-3">
                        運輸碳排放計算
                      </h3>
                      <p className="text-sm text-orange-700 mb-4">
                        計算貨物運輸的碳排放量，包括海運、空運、陸運等不同運輸方式。
                      </p>
                      <FreightForm onResult={handleResult} />
                    </div>
                  </TabsContent>

                  <TabsContent value="energy" className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h3 className="text-lg font-semibold text-purple-800 mb-3">
                        能源碳排放計算
                      </h3>
                      <p className="text-sm text-purple-700 mb-4">
                        計算能源消耗的碳排放量，包括電力、天然氣、石油等能源類型。
                      </p>
                      <EnergyForm onResult={handleResult} />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-green-700">
                  計算結果
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results ? (
                  <Results data={results} />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-lg">請選擇計算類型並填寫資料</p>
                    <p className="text-sm mt-2">結果將在此處顯示</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
