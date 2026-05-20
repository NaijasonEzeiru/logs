import { getVictims } from "@/actions/victims";
import { columns } from "@/components/columns";
import { DataTable } from "@/components/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserForm } from "@/components/user-form";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import Logout from "./logout";

export default async function page() {
  const user = await getSession();
  // const data = [];

  if (!user) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <p className="text-center text-red-500">
            You must be logged in to view this page.
          </p>
          <Link
            href="/login"
            className="text-blue-500 hover:underline text-center mt-4 block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const data = await getVictims({ ownerId: user.userId });

  return (
    <>
      <div className="my-6 flex w-full items-center justify-center">
        <h1 className="text-lg font-medium mb-4 text-center">Details</h1>
        <div className="flex items-center gap-4 ml-4">
          <Logout />
          {user.username === "admin" && (
            <Dialog>
              <DialogTrigger className="border border-primary rounded-md px-2 py-1">
                Add User
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a new user</DialogTitle>
                  <UserForm />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      {/* <div className="container mx-auto py-10 overflow-auto "> */}
      <DataTable columns={columns} data={data} />
    </>
  );
}
