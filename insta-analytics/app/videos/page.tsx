import { TopBar } from "@/components/layout/TopBar";
import { Card, CardContent } from "@/components/ui/card";

export default function VideosPage() {
  return (
    <>
      <TopBar title="Vidéos" subtitle="Toutes les publications" />
      <main className="p-6">
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            Page vidéos — arrive à l&apos;étape suivante (tableau triable
            multi-colonnes, détail vidéo avec courbes d&apos;évolution,
            comparaison vidéo par vidéo).
          </CardContent>
        </Card>
      </main>
    </>
  );
}
