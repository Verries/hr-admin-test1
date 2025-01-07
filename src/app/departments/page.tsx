import DepartmentTable from "../_components/department-table/page";
import Header from "../_components/header";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function DepartmentList() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  if (session?.user.type === "admin") {
    return (
      <div className="flex h-screen w-full flex-col items-center">
        <Header />
        <div className="md:w-2/3">
          <h1 className="py-4 text-2xl">Departments</h1>
          <DepartmentTable />
        </div>
      </div>
    );
  }

  // handle any unexpected user types or scenarios
  return null;
}
