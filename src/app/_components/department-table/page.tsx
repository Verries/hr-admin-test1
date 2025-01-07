import { PrismaClient, type Department } from "@prisma/client";
import { ClientDataTable } from "./client";
import { getServerAuthSession } from "~/server/auth";

const prisma = new PrismaClient();

async function getData(): Promise<Department[]> {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc"}
    });
    return departments;
  } catch (error) {
    console.error(error);
    return []; // Return an empty array in case of an error
  }
}

export default async function DepartmentTable() {
  const session = await getServerAuthSession();
  const data = await getData();
  const userType = session?.user.type ?? "";

  return (
    <div className="container mx-auto">
      <ClientDataTable data={data} userType={userType} />
    </div>
  );
}
