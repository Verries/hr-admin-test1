import DropDownMenu from "./dropdown-menu";
import { getServerAuthSession } from "~/server/auth";

export default async function Header() {
  const session = await getServerAuthSession();

  return (
    <div className="flex w-full border-b border-black p-6 justify-between items-center">
      <div className="flex">
        <DropDownMenu />
        <h1 className="text-4xl">HR Admin System</h1>
      </div>
    </div>
  );
}
