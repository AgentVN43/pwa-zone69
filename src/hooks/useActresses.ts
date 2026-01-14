import { useQuery } from "@tanstack/react-query";
import { getActresses } from "@/services/api";

export function useActresses() {
  return useQuery({
    queryKey: ["actresses"],
    queryFn: getActresses,
  });
}
