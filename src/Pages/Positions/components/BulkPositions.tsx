import { formatCurrency } from "@/utils";
import { userAdminBrokerService } from "@/utils/api/broker/service";
import { Warning } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Table, Tooltip } from "antd";
import clsx from "clsx";
import { useState } from "react";
import UserPositionTable from "./PositionTable";

const PAGE_LIMIT = 20;

const expandedRowRender = (positions: Position[]) => {
  return (
    <div className="p-3">
      <UserPositionTable
        positions={positions}
        loading={false}
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
          expandedRowRender: (record) =>
            expandedRowRender(record.positions || []),
          rowExpandable: (record) => (record.positions || []).length > 0,
          expandedRowKeys: expandedRowKeys,
        }}
        onRow={(record) => ({
          onClick: () => {
            if (!record.positions || record.positions.length === 0) return;
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
            render: (username, record) => (
              <div className="flex items-center gap-2">
                {username}
                {record.error_message && (
                  <Tooltip title={record.error_message}>
                    <Warning
                      className="text-rose-600"
                      weight="bold"
                      size={16}
                    />
                  </Tooltip>
                )}
              </div>
            ),
          },
          {
            title: "Losing/Total Positions",
            dataIndex: "pnl_summary",
            key: "position_count",
            align: "end",
            render: ({ position_count, losing_positions }) =>
              losing_positions > 0 ? (
                <div className="inline-flex justify-end items-center tabular-nums">
                  <span className="text-rose-700">
                    {losing_positions} losing&nbsp;
                  </span>
                  / {position_count}
                </div>
              ) : (
                <div className="inline-flex justify-end items-center tabular-nums">
                  {position_count > 0 ? (
                    <span className="text-emerald-700">{position_count}</span>
                  ) : (
                    <span className="text-gray-400">---</span>
                  )}
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
                  "text-emerald-700": realised_pnl > 0,
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
                  "text-emerald-700": unrealised_pnl > 0,
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
