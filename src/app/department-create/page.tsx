import Header from "../_components/header";
import { CreateForm } from "../_components/department-create-form";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function DepartmentCreate() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  if (session?.user.type === "admin") {
    return (
      <div className="flex flex-col items-center">
        <Header />
        <div className="flex w-2/3 flex-col">
          <h1 className="py-4 text-2xl">Create Department</h1>
          <CreateForm />
        </div>
      </div>
    );
  }

  // handle any unexpected user types or scenarios
  return null;
}
