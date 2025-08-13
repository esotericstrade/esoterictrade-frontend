import { formatCurrency } from "@/utils";
import { userAdminBrokerService } from "@/utils/api/broker/service";
import { useAuthContext } from "@/Pages/Auth/context";
import { Warning } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Table, Tooltip } from "antd";
import clsx from "clsx";
import { useState } from "react";
import UserPositionTable from "./PositionTable";

const PAGE_LIMIT = 100;

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
  const { user } = useAuthContext();
  const isAdmin = user?.role === "admin";

  // Admin query for bulk positions
  const adminQuery = useQuery({
    queryKey: [
      "admin-positions",
      {
        current: current,
        pageLimit: PAGE_LIMIT,
      },
    ],
    queryFn: () => {
      return userAdminBrokerService.getBulkUserPositions(current, PAGE_LIMIT);
    },
    enabled: isAdmin,
    refetchOnWindowFocus: false,
  });

  // User query for their own positions
  const userQuery = useQuery({
    queryKey: ["user-positions"],
    queryFn: async () => {
      try {
        const positions = await userAdminBrokerService.getCurrentUserPositions();
        
        // Debug log to check the response
        console.log("User positions response:", positions);
        
        // Ensure positions is an array
        const positionsArray = Array.isArray(positions) ? positions : [];
        
        // Calculate PnL summary for user's positions
        const pnlSummary = positionsArray.reduce(
        (acc, position) => {
          const realizedPnl = position.realised || 0;
          const unrealizedPnl = position.unrealised || 0;
          const totalPnl = realizedPnl + unrealizedPnl;
          
          return {
            position_count: acc.position_count + 1,
            losing_positions: totalPnl < 0 ? acc.losing_positions + 1 : acc.losing_positions,
            realised_pnl: acc.realised_pnl + realizedPnl,
            unrealised_pnl: acc.unrealised_pnl + unrealizedPnl,
            total_pnl: acc.total_pnl + totalPnl,
            profitable_positions: totalPnl > 0 ? acc.profitable_positions + 1 : acc.profitable_positions,
            max_position_profit: Math.max(acc.max_position_profit, totalPnl > 0 ? totalPnl : 0),
            max_position_loss: Math.min(acc.max_position_loss, totalPnl < 0 ? totalPnl : 0),
          };
        },
        {
          position_count: 0,
          losing_positions: 0,
          realised_pnl: 0,
          unrealised_pnl: 0,
          total_pnl: 0,
          profitable_positions: 0,
          max_position_profit: 0,
          max_position_loss: 0,
        }
      );

      // Transform to match admin structure for consistent UI
      return {
        data: [{
          user_id: user?.id || 0,
          username: `${user?.first_name} ${user?.last_name}`,
          positions: positionsArray,
          pnl_summary: pnlSummary,
        }],
        pagination: {
          page: 1,
          size: 1,
          total: 1,
          pages: 1,
        },
      };
    } catch (error) {
      console.error("Error fetching user positions:", error);
      throw error;
    }
    },
    enabled: !isAdmin,
    refetchOnWindowFocus: false,
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  // Select the appropriate query based on role
  const { data, isFetching } = isAdmin ? adminQuery : userQuery;

  // For regular users, show a simplified view
  if (!isAdmin && data?.data?.[0]) {
    const userPositions = data.data[0].positions || [];
    return (
      <section>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold font-poppins">My Positions</h2>
          </div>
        </div>
        
        {/* Summary Card for User */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Positions</p>
              <p className="text-2xl font-semibold">
                {data.data[0].pnl_summary.position_count}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Realized P&L</p>
              <p className={clsx("text-2xl font-semibold", {
                "text-gray-400": data.data[0].pnl_summary.realised_pnl === 0,
                "text-emerald-700": data.data[0].pnl_summary.realised_pnl > 0,
                "text-rose-600": data.data[0].pnl_summary.realised_pnl < 0,
              })}>
                {formatCurrency(data.data[0].pnl_summary.realised_pnl)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Unrealized P&L</p>
              <p className={clsx("text-2xl font-semibold", {
                "text-gray-400": data.data[0].pnl_summary.unrealised_pnl === 0,
                "text-emerald-700": data.data[0].pnl_summary.unrealised_pnl > 0,
                "text-rose-600": data.data[0].pnl_summary.unrealised_pnl < 0,
              })}>
                {formatCurrency(data.data[0].pnl_summary.unrealised_pnl)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total P&L</p>
              <p className={clsx("text-2xl font-semibold", {
                "text-gray-400": data.data[0].pnl_summary.total_pnl === 0,
                "text-emerald-700": data.data[0].pnl_summary.total_pnl > 0,
                "text-rose-600": data.data[0].pnl_summary.total_pnl < 0,
              })}>
                {formatCurrency(data.data[0].pnl_summary.total_pnl)}
              </p>
            </div>
          </div>
        </div>

        {/* Positions Table */}
        <UserPositionTable
          positions={userPositions}
          loading={isFetching}
          pagination={false}
        />
      </section>
    );
  }

  // Admin view - bulk positions
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold font-poppins">All User Positions</h2>
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