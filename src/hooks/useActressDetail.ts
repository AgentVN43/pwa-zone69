import { useQuery } from "@tanstack/react-query";
import { getActressById } from "@/services/api";
import type { Actress } from "@/types";

export const useActressDetail = (actressId: string) => {
  return useQuery<Actress>({
    queryKey: ["actress", actressId],
    queryFn: () => getActressById(actressId),
    enabled: !!actressId, // tránh gọi khi id rỗng
    staleTime: 10 * 60 * 1000,
  });
};
