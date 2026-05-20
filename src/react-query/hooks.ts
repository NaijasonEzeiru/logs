import { UserWithRelations } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "./fetchers";

export function useCurrentUser() {
  return useQuery<UserWithRelations | null>({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
    staleTime: 1000 * 60 * 60, // cache for 1 hour
    retry: false, // don’t spam retries if unauthenticated
  });
}
