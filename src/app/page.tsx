import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getSession();
  if (user) {
    redirect("/logs");
  } else {
    redirect("/login");
  }
}
