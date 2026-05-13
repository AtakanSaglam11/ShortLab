import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent } from "@/components/ui/card";

export default function InsightsPage() {
  return (
    <>
      <TopBar title="Insights" subtitle="Patterns et rapport honnête" />
      <main className="p-6">
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            Page insights — arrive bientôt (meilleurs jours/heures de post,
            heatmap de performance, formats qui marchent vs flopent,
            rapport honnête détaillé).
          </CardContent>
        </Card>
      </main>
    </>
  );
}
