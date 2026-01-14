import { useQuery } from "@tanstack/react-query";
import { getMoviesById } from "@/services/api";

export function useMovieDetail(movieId: string) {
  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMoviesById(movieId),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000,
  });
}
