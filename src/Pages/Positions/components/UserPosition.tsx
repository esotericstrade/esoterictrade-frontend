import { formatCurrency, formatNumber } from "@/utils";
import { adminService } from "@/utils/api/admin/service";
import { userAdminBrokerService } from "@/utils/api/broker/service";
import { useQuery } from "@tanstack/react-query";
import { Popover, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import clsx from "clsx";
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
      render: (text, record) => (
        <span className="font-medium">
          {text}
          <span className="text-gray-400 font-normal text-xs ms-0.5">
            {record.exchange}
          </span>
        </span>
      ),
    },

    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product) => (
        <Tag
          className={clsx("font-medium", {
            "bg-blue-100 text-blue-600 border border-blue-700":
              product === "NRML",
            "bg-orange-100 text-orange-600 border border-orange-700":
              product === "OT",
          })}
        >
          {product}
        </Tag>
      ),
    },
    {
      title: "Order Details",
      key: "order_details",
      dataIndex: "net_quantity",
      align: "end",
      render: (net_quantity, record) => {
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
            <span
              className={clsx(
                "tabular-nums",
                "hover:underline cursor-pointer",
                {
                  "text-orange-600": net_quantity < 0,
                  "text-blue-600": net_quantity > 0,
                }
              )}
            >
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
        <span className="tabular-nums text-end">{formatCurrency(price)}</span>
      ),
    },
    {
      title: "Last Price",
      dataIndex: "last_price",
      key: "last_price",
      align: "end",
      render: (price) => (
        <span className="tabular-nums text-end">{formatCurrency(price)}</span>
      ),
    },
    {
      title: "Realized PnL",
      dataIndex: "realised",
      key: "realized_pnl",
      align: "end",
      render: (realised) => (
        <span
          className={clsx("tabular-nums", {
            "text-gray-400": realised === 0,
            "text-emerald-600": realised > 0,
            "text-rose-600": realised < 0,
          })}
        >
          {formatCurrency(realised)}
        </span>
      ),
    },
    {
      title: "Unrealized PnL",
      dataIndex: "unrealised",
      key: "unrealized_pnl",
      align: "end",
      render: (unrealised) => (
        <span
          className={clsx("tabular-nums", {
            "text-gray-400": unrealised === 0,
            "text-emerald-600": unrealised > 0,
            "text-rose-600": unrealised < 0,
          })}
        >
          {formatCurrency(unrealised)}
        </span>
      ),
    },
    {
      title: "Total P&L",
      dataIndex: "pnl",
      key: "total_pnl",
      align: "end",
      render: (total_pnl) => (
        <span
          className={clsx("tabular-nums font-medium", {
            "text-gray-400": total_pnl === 0,
            "text-emerald-600": total_pnl > 0,
            "text-rose-600": total_pnl < 0,
          })}
        >
          {formatCurrency(total_pnl)}
        </span>
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
