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

  console.log("data", data?.data);

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
            title: "Positions Count",
            dataIndex: "positions",
            key: "positions_count",
            align: "end",
            render: (positions) => positions.length,
          },
          {
            title: "Total P&L",
            dataIndex: "positions",
            key: "total_pnl",
            align: "end",
            render: (positions) => {
              const totalPnl = positions.reduce(
                (acc: number, position: Position) => acc + position.pnl,
                0
              );
              return (
                <Tag color={totalPnl >= 0 ? "green" : "red"}>
                  {formatCurrency(totalPnl)}
                </Tag>
              );
            },
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
