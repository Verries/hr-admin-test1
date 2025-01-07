import { PrismaClient, type Employee } from "@prisma/client";
import { ClientDataTable } from "./client";
import { getServerAuthSession } from "~/server/auth";

const prisma = new PrismaClient();

async function getData(): Promise<Employee[]> {
  const session = await getServerAuthSession();

  try {
    // Admin View
    if (session?.user.type === "admin") {
      const employees = await prisma.employee.findMany({
        orderBy: { firstName: "asc" },
      });
      return employees;

      // Manager View
    } else if (session?.user.type === "manager") {
      const employees = await prisma.employee.findMany({
        where: { manager: session.user.name?.split(" ")[0] },
      });
      return employees;
    }
  } catch (error) {
    console.error(error);
    return []; // Return an empty array in case of an error
  }
  // Return an empty array if no conditions matched
  return [];
}

export default async function EmployeeTable() {
  const session = await getServerAuthSession();
  const data = await getData();
  const userType = session?.user.type ?? "";

  return (
    <div className="container mx-auto">
      <ClientDataTable data={data} userType={userType} />
    </div>
  );
}
