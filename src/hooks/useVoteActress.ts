import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteActress } from "@/services/api";
import type { Actress } from "@/types";

export const useVoteActress = (actressId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => voteActress(actressId),
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["actress", actressId] });

      const previousData = queryClient.getQueryData<Actress>([
        "actress",
        actressId,
      ]);

      if (previousData) {
        queryClient.setQueryData<Actress>(["actress", actressId], {
          ...previousData,
          votes: (previousData.votes ?? 0) + 1,
        });
      }

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ["actress", actressId],
          context.previousData
        );
      }
    },
    onSuccess: () => {
      // Refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ["actress", actressId] });
    },
  });
};
