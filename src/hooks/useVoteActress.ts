import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteActress } from "@/services/api";

export const useVoteActress = (actressId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => voteActress(actressId),
    onSuccess: () => {
      // Optional: invalidate hoặc update cache
      queryClient.invalidateQueries({ queryKey: ["actress", actressId] });
    },
  });
};
