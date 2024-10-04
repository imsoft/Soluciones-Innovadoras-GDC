import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getUsers } from "@/actions";

const UsersPage = async () => {
  const users = await getUsers();

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Usuarios
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Listado de usuarios registrados.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href="/usuarios/agregar-usuario"
              className="block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Agregar usuario
            </Link>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <DataTable columns={columns} data={users} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersPage;