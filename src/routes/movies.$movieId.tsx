import { createFileRoute } from "@tanstack/react-router";
import { MovieDetail } from "@/components/MovieDetail";

export const Route = createFileRoute("/movies/$movieId")({
  component: MovieDetailPage,
});

function MovieDetailPage() {
  const { movieId } = Route.useParams();

  return <MovieDetail movieId={movieId} />;
}
