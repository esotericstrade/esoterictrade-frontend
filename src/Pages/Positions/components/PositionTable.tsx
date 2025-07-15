// src/Pages/Positions/components/UserPositionTable.tsx

import { formatCurrency, formatNumber } from "@/utils";
import { Popover, Table, Tag } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import clsx from "clsx";

type UserPositionTableProps = {
  positions: Position[];
};

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
                  <span className="text-emerald-700 font-semibold uppercase tracking-wider text-xs col-span-2 relative before:absolute before:bottom-0 before:inset-x-0 before:h-px before:bg-emerald-500">
                    Buy Order Details
                  </span>
                  <span className="text-gray-500">Buy Price:</span>
                  <span className="font-medium text-end">
                    {formatCurrency(record.buy_price)}
                  </span>
                  <span className="text-gray-500">Buy Quantity:</span>
                  <span className="font-medium text-end">
                    {formatNumber(record.buy_quantity)}
                  </span>
                  <span className="text-gray-500">Buy Value:</span>
                  <span className="font-medium text-end">
                    {formatCurrency(record.buy_value)}
                  </span>
                  <span className="text-gray-500">Buy M2M:</span>
                  <span className="font-medium text-end">
                    {formatCurrency(record.buym2m)}
                  </span>
                </div>
              )}
              {isSell && (
                <div className="grid grid-cols-[auto_1fr] gap-1 text-gray-600">
                  <span className="text-rose-600 font-semibold uppercase tracking-wider text-xs col-span-2 relative before:absolute before:bottom-0 before:inset-x-0 before:h-px before:bg-rose-500">
                    Sell Order Details
                  </span>
                  <span className="text-gray-500">Sell Price:</span>
                  <span className="font-medium text-end">
                    {formatCurrency(record.sell_price)}
                  </span>
                  <span className="text-gray-500">Sell Quantity:</span>
                  <span className="font-medium text-end">
                    {formatNumber(record.sell_quantity)}
                  </span>
                  <span className="text-gray-500">Sell Value:</span>
                  <span className="font-medium text-end">
                    {formatCurrency(record.sell_value)}
                  </span>
                  <span className="text-gray-500">Sell M2M:</span>
                  <span className="font-medium text-end">
                    {formatCurrency(record.sellm2m)}
                  </span>
                </div>
              )}
            </div>
          }
        >
          <span
            className={clsx("tabular-nums hover:underline cursor-pointer", {
              "text-orange-600": net_quantity < 0,
              "text-blue-600": net_quantity > 0,
            })}
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
    title: "Realized P&L",
    dataIndex: "realised",
    key: "realized_pnl",
    align: "end",
    render: (realised) => (
      <span
        className={clsx("tabular-nums", {
          "text-gray-400": realised === 0,
          "text-emerald-700": realised > 0,
          "text-rose-600": realised < 0,
        })}
      >
        {formatCurrency(realised)}
      </span>
    ),
  },
  {
    title: "Unrealized P&L",
    dataIndex: "unrealised",
    key: "unrealized_pnl",
    align: "end",
    render: (unrealised) => (
      <span
        className={clsx("tabular-nums", {
          "text-gray-400": unrealised === 0,
          "text-emerald-700": unrealised > 0,
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
          "text-emerald-700": total_pnl > 0,
          "text-rose-600": total_pnl < 0,
        })}
      >
        {formatCurrency(total_pnl)}
      </span>
    ),
  },
];

const UserPositionTable = ({
  positions,
  ...props
}: UserPositionTableProps & TableProps<Position>) => {
  return (
    <Table
      dataSource={positions}
      columns={columns}
      rowKey="trading_symbol"
      {...props}
    />
  );
};

export default UserPositionTable;
