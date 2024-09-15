import Link from "next/link";
import { columns, Orders } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Orders[]> {
  return [
    {
      id: "1d9dacb7-1081-4ddc-b26a-8b215929da2d",
      dateOrder: "2024-07-27",
      customer: {
        name: "Timothy Duarte",
        email: "johnsonjohn@moore-mckinney.biz",
        address: "PSC 2339, Box 9418, APO AP 76797",
      },
      products: [
        { name: "write", quantity: 2, price: 86.2 },
        { name: "picture", quantity: 3, price: 15.46 },
        { name: "throughout", quantity: 1, price: 7.92 },
        { name: "prevent", quantity: 2, price: 62.37 },
      ],
      total: 351.44,
    },
    {
      id: "95b767ae-b555-491c-b13b-78058b54c7c0",
      dateOrder: "2024-07-11",
      customer: {
        name: "Dr. Christopher Higgins PhD",
        email: "nicole34@gmail.com",
        address: "PSC 8996, Box 8940, APO AA 18553",
      },
      products: [
        { name: "with", quantity: 1, price: 26.33 },
        { name: "recently", quantity: 2, price: 76.41 },
        { name: "impact", quantity: 2, price: 30.37 },
        { name: "event", quantity: 3, price: 18.2 },
      ],
      total: 294.49,
    },
    {
      id: "20d6163e-1134-4189-82ed-35f7d6dc7eb1",
      dateOrder: "2024-07-24",
      customer: {
        name: "Karen White",
        email: "hardingjennifer@yahoo.com",
        address: "3525 Hart Terrace Apt. 975, Barkerton, OR 12062",
      },
      products: [
        { name: "deal", quantity: 2, price: 28.41 },
        { name: "safe", quantity: 1, price: 48.39 },
      ],
      total: 105.21,
    },
    {
      id: "a5a2d950-b5fe-440d-9336-450610c4ec8e",
      dateOrder: "2024-07-10",
      customer: {
        name: "Andrew Tyler",
        email: "hornwesley@yahoo.com",
        address: "12587 Lewis Plaza Apt. 051, New Susan, NH 84035",
      },
      products: [
        { name: "kitchen", quantity: 3, price: 8.5 },
        { name: "control", quantity: 3, price: 86.99 },
        { name: "fly", quantity: 1, price: 68.0 },
        { name: "big", quantity: 3, price: 75.93 },
      ],
      total: 582.26,
    },
    {
      id: "09ed0d0a-e7a7-40bf-9b5a-8616dcb370a7",
      dateOrder: "2024-07-12",
      customer: {
        name: "Robin Carter",
        email: "whitedustin@smith.com",
        address: "79394 Molly Groves, Matthewville, NV 12354",
      },
      products: [{ name: "simply", quantity: 1, price: 84.75 }],
      total: 84.75,
    },
  ];
}

const OrdersPage = async () => {
  const data = await getData();

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Pedidos realizados
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Listado de pedidos realizados por los clientes.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href="/pedidos/agregar-pedido"
              className="block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Nuevo pedido
            </Link>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
