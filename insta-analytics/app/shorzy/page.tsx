import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent } from "@/components/ui/card";

export default function ShorzyPage() {
  return (
    <>
      <TopBar
        title="Acquisition Shorzy"
        subtitle="Quelles vidéos Instagram convertissent en signups shorzy.app"
      />
      <main className="p-6">
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            Section Shorzy — arrive bientôt (formulaire de saisie manuelle
            des conversions, table des conversions par vidéo, graphique
            de corrélation contenu → acquisition, KPIs top vidéos).
          </CardContent>
        </Card>
      </main>
    </>
  );
}
