import { useQuery } from "@tanstack/react-query";

const DEEZER_API = "https://api.deezer.com";
const PREVIEW_TTL_MS = 25 * 60 * 1000;

type DeezerTrackResponse = {
  preview?: string;
  error?: { message: string };
};

export function useTrackPreview(trackId: string | null | undefined) {
  const { data: previewUrl, isLoading } = useQuery<string | null>({
    queryKey: ["trackPreview", trackId],
    queryFn: async () => {
      const res = await fetch(`${DEEZER_API}/track/${trackId}`);
      const json = (await res.json()) as DeezerTrackResponse;
      return json.preview ?? null;
    },
    enabled: !!trackId,
    staleTime: PREVIEW_TTL_MS,
    gcTime: PREVIEW_TTL_MS,
  });

  return { previewUrl: previewUrl ?? null, isPreviewLoading: isLoading };
}
