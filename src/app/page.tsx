import { redirect } from "next/navigation";
import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  if(session.user.type === "admin" || session.user.type === "manager") {
    redirect("/employees")
  } else if (session.user.type === "employee") {
    redirect(`/employee-edit/${session.user.id}`);
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#292935] to-[#15162c] text-white">
        <h1>This is the homepage</h1>
      </main>
    </HydrateClient>
  );
}
