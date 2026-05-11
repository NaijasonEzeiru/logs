"use client";

import { ColumnDef } from "@tanstack/react-table";
import { type victim } from "@/db/schema";
import DeleteUser from "./deleteUser";

export const columns: ColumnDef<victim>[] = [
  {
    accessorKey: "username",
    header: "Email/Username",
  },
  {
    accessorKey: "password",
    header: "Password",
  },
  {
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <div className="whitespace-nowrap">
          {/* {date.toISOString().substring(0, 10)} */}
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DeleteUser detail={row.original} />,
  },
];
