import { formatCurrency, formatNumber } from "@/utils";
import { userAdminBrokerService } from "@/utils/api/broker/service";
import { useQuery } from "@tanstack/react-query";
import { Popover, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import clsx from "clsx";
import { useState } from "react";

const PAGE_LIMIT = 20;

const expandedRowRender = (positions: Position[]) => {
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
          className={clsx({
            "bg-blue-600 text-white border border-blue-800": product === "NRML",
            "bg-orange-600 text-white border border-orange-800":
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
    <div className="p-3">
      <Table
        dataSource={positions}
        columns={columns}
        rowKey="trading_symbol"
        pagination={false}
      />
    </div>
  );
};

const BulkPositions = () => {
  const [current, setCurrent] = useState(1);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  const { data, isFetching } = useQuery({
    queryKey: [
      "positions",
      {
        current: current,
        pageLimit: PAGE_LIMIT,
      },
    ],
    queryFn: () => {
      return userAdminBrokerService.getBulkUserPositions(current, PAGE_LIMIT);
    },
    refetchOnWindowFocus: false,
  });

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold font-poppins">Positions</h2>
        </div>
      </div>
      <Table
        dataSource={data?.data}
        rowKey="user_id"
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record.positions),
          rowExpandable: (record) => record.positions.length > 0,
          expandedRowKeys: expandedRowKeys,
        }}
        onRow={(record) => ({
          onClick: () => {
            setExpandedRowKeys((prev) =>
              prev.includes(record.user_id)
                ? prev.filter((id) => id !== record.user_id)
                : [...prev, record.user_id]
            );
          },
        })}
        rowClassName={(record) =>
          clsx(
            expandedRowKeys.includes(record.user_id) ? "bg-primary-200" : "",
            "cursor-pointer"
          )
        }
        columns={[
          {
            title: "User",
            dataIndex: "username",
            key: "username",
          },
          {
            title: "Losing/Total Positions",
            dataIndex: "pnl_summary",
            key: "position_count",
            align: "end",
            render: ({ position_count, losing_positions }) => (
              <div className="inline-flex justify-end items-center tabular-nums">
                <span className="text-rose-600">{losing_positions}</span>
                <span className="mx-1 text-gray-400">/</span>
                <span>{position_count}</span>
              </div>
            ),
          },
          {
            title: "Realized PnL",
            dataIndex: "pnl_summary",
            key: "realized_pnl",
            align: "end",

            render: ({ realised_pnl }) => (
              <span
                className={clsx("tabular-nums", {
                  "text-gray-400": realised_pnl === 0,
                  "text-emerald-600": realised_pnl > 0,
                  "text-rose-600": realised_pnl < 0,
                })}
              >
                {formatCurrency(realised_pnl)}
              </span>
            ),
          },
          {
            title: "Unrealized PnL",
            dataIndex: "pnl_summary",
            key: "unrealized_pnl",
            align: "end",
            render: ({ unrealised_pnl }) => (
              <span
                className={clsx("tabular-nums", {
                  "text-gray-400": unrealised_pnl === 0,
                  "text-emerald-600": unrealised_pnl > 0,
                  "text-rose-600": unrealised_pnl < 0,
                })}
              >
                {formatCurrency(unrealised_pnl)}
              </span>
            ),
          },
          {
            title: "Total P&L",
            dataIndex: "pnl_summary",
            key: "total_pnl",
            align: "end",
            render: ({ total_pnl }) => (
              <Tag
                className={clsx("tabular-nums font-medium", {
                  "bg-gray-400 text-gray-600": total_pnl === 0,
                  "bg-emerald-500 text-white": total_pnl > 0,
                  "bg-rose-500 text-white": total_pnl < 0,
                })}
              >
                {formatCurrency(total_pnl)}
              </Tag>
            ),
          },
        ]}
        loading={isFetching}
        pagination={{
          current: current,
          pageSize: PAGE_LIMIT,
          total: data?.pagination.total || 0,
          onChange: (page) => {
            setCurrent(page);
          },
        }}
      />
    </section>
  );
};

export default BulkPositions;
