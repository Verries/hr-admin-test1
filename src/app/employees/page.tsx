import EmployeeTable from "../_components/employee-table/page";
import Header from "../_components/header";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function EmployeeList() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  // Render for admins and managers
  if (session.user.type === "admin" || session.user.type === "manager") {
    return (
      <div className="flex h-screen w-full flex-col items-center">
        <Header />
        <div className="md:w-2/3">
          <h1 className="text-2xl py-4">Employees</h1>
          <EmployeeTable />
        </div>
      </div>
    );
  }

  // handle any unexpected user types or scenarios
  return null;
}
