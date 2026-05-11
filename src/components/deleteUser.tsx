"use client";

import { type victim } from "@/db/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { LoaderIcon } from "lucide-react";

export default function DeleteUser({ detail }: { detail: victim }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteDetail(id: number) {
    try {
      setLoading(true);
      const res = await fetch("/api/cl", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast("Details deleted successfully");
        console.log({ data });
        router.refresh();
      } else {
        setLoading(false);
        toast.error("Delete failed", {
          description: "Something went wrong",
        });
        console.log("not deleted", { data });
      }
    } catch (err) {
      setLoading(false);
      toast.error("Delete failed", {
        description: "Something went wrong",
      });
      console.log({ err });
    }
  }
  return (
    <Button
      className="bg-destructive hover:bg-destructive/80"
      onClick={() => deleteDetail(detail.id)}
      disabled={loading}
    >
      {loading && <LoaderIcon />}
      Delete
    </Button>
  );
}
