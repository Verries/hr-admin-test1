// src/app/_components/dropdown-menu.tsx

import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { getServerAuthSession } from "~/server/auth";

export default async function DropDownMenu() {
  const session = await getServerAuthSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <svg className="mr-4 w-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <title>menu</title>
          <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{session?.user.type}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session?.user.type === "admin" && (
          <>
            <DropdownMenuItem>
              <Link href={"/employees"}>View Employees</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/employee-create"}>Create Employee</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/departments"}>View Departments</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/department-create"}>Create Department</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/auth\signin/confirm-signout">Sign out</Link> {/* Corrected link to the sign-out confirmation page */}
            </DropdownMenuItem>
          </>
        )}
        {session?.user.type === "manager" && (
          <>
            <DropdownMenuItem>
              <Link href={`/employee-edit/${session.user.id}`}>Edit Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/employees"}>View Employees</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/auth\signin/confirm-signout">Sign out</Link> {/* Corrected link to the sign-out confirmation page */}
            </DropdownMenuItem>
          </>
        )}
        {session?.user.type === "employee" && (
          <>
            <DropdownMenuItem>
              <Link href={`/employee-edit/${session.user.id}`}>Edit Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/auth\signin/confirm-signout">Sign out</Link> {/* Corrected link to the sign-out confirmation page */}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
