"use client";

import { Button } from "@/components/ui/button";
import { useCurrentUser, useLogout } from "@/react-query/hooks";

export default function Logout() {
  const { mutate, isPending } = useLogout();
  const { isLoading } = useCurrentUser();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => mutate()}
      disabled={isLoading || isPending}
    >
      Sign out
    </Button>
  );
}
