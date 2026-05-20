import { UserWithRelations } from "@/db/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCurrentUser, logoutUser } from "./fetchers";
import { queryClient } from "./queryClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCurrentUser() {
  return useQuery<UserWithRelations | null>({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
    staleTime: 1000 * 60 * 60, // cache for 1 hour
    retry: false, // don’t spam retries if unauthenticated
  });
}

export function useLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: logoutUser,
    onMutate: async (_, context) => {
      await context.client.cancelQueries({ queryKey: ["currentUser"] });
      const prevUser = context.client.getQueryData(["currentUser"]);
      context.client.setQueryData(["currentUser"], null);
      return { prevUser };
    },
    onSuccess: () => {
      toast("Logged out successfully", {
        description: "You have been signed out.",
      });
      router.push("/");
    },
    onError: (_err, _, context) => {
      if (context?.prevUser) {
        queryClient.setQueryData(["currentUser"], context.prevUser);
      }
      toast.error("Logout failed", {
        description: "An error occurred while logging out. Please try again.",
      });
    },
  });
}
