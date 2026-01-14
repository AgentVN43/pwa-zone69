import { createFileRoute } from "@tanstack/react-router";
import { ActressDetail } from "@/components/ActressDetail";

export const Route = createFileRoute("/actresses/$actressId")({
  component: ActressDetailPage,
});

function ActressDetailPage() {
  const { actressId } = Route.useParams();
  
  return <ActressDetail actressId={actressId} />;
}
