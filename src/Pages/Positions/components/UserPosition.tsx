import { formatCurrency, formatNumber } from "@/utils";
import { adminService } from "@/utils/api/admin/service";
import { userAdminBrokerService } from "@/utils/api/broker/service";
import { useQuery } from "@tanstack/react-query";
import { Popover, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useParams } from "react-router-dom";

const UserPosition = () => {
  const { userId, userName } = useParams();

  const { data: user } = useQuery({
    queryKey: ["user", userName],
    queryFn: () => {
      if (!userName) {
        throw new Error("User name is required");
      }
      return adminService.getUserByUsername(userName);
    },
  });

  const { data: positions, isFetching: isPositionsFetching } = useQuery({
    queryKey: ["userPosition", userId],
    enabled: !!userId,
    initialData: [],
    queryFn: () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return userAdminBrokerService.getUserPositionsById(Number(userId));
    },
  });

  const columns: ColumnsType<Position> = [
    {
      title: "Trading Symbol",
      dataIndex: "trading_symbol",
      key: "trading_symbol",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Exchange",
      dataIndex: "exchange",
      key: "exchange",
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Order Details",
      key: "order_details",
      align: "end",
      render: (_, record) => {
        const isBuy = record.buy_quantity > 0;
        const isSell = record.sell_quantity > 0;

        return (
          <Popover
            content={
              <div className="grid gap-3">
                {isBuy && (
                  <div className="grid grid-cols-[auto_1fr] gap-1 text-gray-600">
                    <span className="text-emerald-600 font-semibold uppercase tracking-wider text-xs  col-span-2   before:rounded-sm  relative before:absolute before:bottom-0 before:inset-x-0 before:h-px before:bg-emerald-500">
                      Buy Order Details
                    </span>
                    <>
                      <span className="text-gray-500">Buy Price:</span>
                      <span className="font-medium text-end">
                        {formatCurrency(record.buy_price)}
                      </span>
                    </>
                    <>
                      <span className="text-gray-500">Buy Quantity:</span>
                      <span className="font-medium text-end">
                        {formatNumber(record.buy_quantity)}
                      </span>
                    </>
                    <>
                      <span className="text-gray-500">Buy Value:</span>
                      <span className="font-medium text-end">
                        {formatCurrency(record.buy_value)}
                      </span>
                    </>
                    <>
                      <span className="text-gray-500">Buy M2M:</span>
                      <span className="font-medium text-end">
                        {formatCurrency(record.buym2m)}
                      </span>
                    </>
                  </div>
                )}

                {isSell && (
                  <div className="grid grid-cols-[auto_1fr] gap-1 text-gray-600">
                    <span className="text-rose-600 font-semibold uppercase tracking-wider text-xs  col-span-2   before:rounded-sm  relative before:absolute before:bottom-0 before:inset-x-0 before:h-px before:bg-rose-500">
                      Sell Order Details
                    </span>
                    <>
                      <span className="text-gray-500">Sell Price:</span>
                      <span className="font-medium text-end">
                        {formatCurrency(record.sell_price)}
                      </span>
                    </>
                    <>
                      <span className="text-gray-500">Sell Quantity:</span>
                      <span className="font-medium text-end">
                        {formatNumber(record.sell_quantity)}
                      </span>
                    </>
                    <>
                      <span className="text-gray-500">Sell Value:</span>
                      <span className="font-medium text-end">
                        {formatCurrency(record.sell_value)}
                      </span>
                    </>
                    <>
                      <span className="text-gray-500">Sell M2M:</span>
                      <span className="font-medium text-end">
                        {formatCurrency(record.sellm2m)}
                      </span>
                    </>
                  </div>
                )}
              </div>
            }
          >
            <span className="text-blue-600 underline cursor-pointer font-medium">
              {formatNumber(record.net_quantity)}
            </span>
          </Popover>
        );
      },
    },

    {
      title: "Average Price",
      dataIndex: "average_price",
      key: "average_price",
      align: "end",
      render: (price) => (
        <span className="font-medium text-end">{formatCurrency(price)}</span>
      ),
    },
    {
      title: "Last Price",
      dataIndex: "last_price",
      key: "last_price",
      align: "end",
      render: (price) => (
        <span className="font-medium text-end">{formatCurrency(price)}</span>
      ),
    },

    {
      title: "Unrealised P&L",
      dataIndex: "unrealised",
      key: "unrealised",
      align: "end",
      render: (unrealised) => formatCurrency(unrealised),
    },
    {
      title: "P&L",
      dataIndex: "pnl",
      key: "pnl",
      align: "end",
      render: (pnl) => (
        <Tag color={pnl >= 0 ? "green" : "red"}>{formatCurrency(pnl)}</Tag>
      ),
    },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold font-poppins">
            Positions
            {user ? ` of ${user.first_name} ${user.last_name}` : ""}
          </h2>

          <div className="flex items-center gap-2">
            <Tag color="green">
              {positions ? positions.length : 0} Positions
            </Tag>
          </div>
        </div>
      </div>

      <Table
        dataSource={positions}
        columns={columns}
        rowKey="trading_symbol"
        loading={isPositionsFetching}
        pagination={false}
      />
    </section>
  );
};

export default UserPosition;
