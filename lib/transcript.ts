import { YoutubeTranscript } from "youtube-transcript";

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([^&?/\s]{11})/,
    /(?:youtu\.be\/)([^&?/\s]{11})/,
    /(?:youtube\.com\/embed\/)([^&?/\s]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function fetchTranscript(videoId: string): Promise<string> {
  // Si une clé TranscriptAPI est fournie, utiliser l'API REST externe
  if (process.env.TRANSCRIPT_API_KEY) {
    const res = await fetch(
      `https://api.transcriptapi.app/v1/transcript?videoId=${videoId}`,
      {
        headers: { Authorization: `Bearer ${process.env.TRANSCRIPT_API_KEY}` },
        next: { revalidate: 0 },
      }
    );
    if (!res.ok) {
      throw new TranscriptError("Impossible de récupérer le transcript via l'API externe.");
    }
    const data = await res.json();
    const text: string = data.transcript ?? data.text ?? "";
    if (!text.trim()) throw new TranscriptError("Le transcript est vide.");
    return truncateTranscript(text);
  }

  // Extraction directe depuis YouTube (sans clé API)
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId);
    if (!segments || segments.length === 0) {
      throw new TranscriptError("Cette vidéo ne possède pas de sous-titres disponibles.");
    }
    const text = segments.map((s) => s.text).join(" ");
    return truncateTranscript(text);
  } catch (err) {
    if (err instanceof TranscriptError) throw err;
    const message = err instanceof Error ? err.message : "";
    if (message.includes("disabled") || message.includes("unavailable")) {
      throw new TranscriptError("Les sous-titres sont désactivés sur cette vidéo.");
    }
    throw new TranscriptError("Impossible de récupérer le transcript de cette vidéo.");
  }
}

// Limite le transcript à ~8000 tokens (~32 000 caractères)
function truncateTranscript(text: string, maxChars = 32000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "...";
}

export class TranscriptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TranscriptError";
  }
}
