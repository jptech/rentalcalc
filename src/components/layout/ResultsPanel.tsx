import type { CalculationResults } from '../../types/property';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { InsightsTab } from '../insights/InsightsTab';
import { ChartsTab } from '../charts/ChartsTab';
import { DataTable } from '../charts/DataTable';
import { Card } from '../ui/Card';

interface ResultsPanelProps {
  results: CalculationResults;
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <Card className="min-h-[600px]">
      <Tabs defaultValue="insights">
        <TabsList className="px-6 pt-4">
          <TabsTrigger value="insights">📊 Insights</TabsTrigger>
          <TabsTrigger value="charts">📈 Charts</TabsTrigger>
          <TabsTrigger value="data">📋 Data Table</TabsTrigger>
        </TabsList>

        <div className="p-6">
          <TabsContent value="insights">
            <InsightsTab results={results} />
          </TabsContent>

          <TabsContent value="charts">
            <ChartsTab results={results} />
          </TabsContent>

          <TabsContent value="data">
            <DataTable data={results.yearlyData} />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
