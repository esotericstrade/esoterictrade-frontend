// src/Pages/Users/index.tsx
import { reportService } from "@/utils/api/report/service";
import { useQuery } from "@tanstack/react-query";
import { Input, Popover, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";

const PAGE_LIMIT = 20;

const TradeReportTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounceValue(search, 500);

  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(
    undefined
  );

  const { data, isFetching } = useQuery({
    queryKey: ["tradeReports", currentPage, debouncedSearch],
    queryFn: () =>
      reportService.getTradeReport({
        page: currentPage,
        size: PAGE_LIMIT,
        symbol: debouncedSearch,
      }),
    initialData: {
      data: [],
      pagination: {
        total: 0,
        page: currentPage,
        limit: PAGE_LIMIT,
        pages: 0,
      },
    },
  });

  const onRow = (record: TradeReport) => {
    return {
      onClick: () => {
        // Handle row click
        console.log("Row clicked:", record);
      },
    };
  };

  const columns: ColumnsType<TradeReport> = [
    {
      title: "Endpoint",
      dataIndex: "endpoint",
      key: "endpoint",
      render: (endpoint) => <span>{endpoint.split("/api/").pop()}</span>,
    },
    {
      title: "Request",
      dataIndex: "request_data",
      key: "request_data",
      render: ({ requestBody }: TradeReport["request_data"]) => {
        if (!requestBody || !requestBody.symbol) {
          return <span className="text-gray-300">---</span>;
        }
        return (
          <Popover
            trigger={"hover"}
            placement="left"
            content={
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(requestBody).map(([key, value]) => (
                  <>
                    <span className="font-regular text-gray-500">{key}:</span>
                    <span className="whitespace-nowrap text-gray-600">
                      {value}
                    </span>
                  </>
                ))}
              </div>
            }
          >
            <span className="text-blue-600 hover:underline">
              {requestBody.symbol}
            </span>
          </Popover>
        );
      },
    },
    {
      title: "Trigger Time",
      dataIndex: "request_data",
      key: "trigger_time",
      render: ({ requestBody }: TradeReport["request_data"]) => {
        const triggerTime = requestBody?.trigger_time;
        if (!triggerTime) {
          return <span className="text-gray-300">---</span>;
        }
        const dateObject = dayjs(triggerTime, "YYYY-MM-DD hh:mm");
        if (!dateObject.isValid()) {
          return <span className="text-gray-300">---</span>;
        }
        return (
          <span className="text-gray-600">
            {dayjs(dateObject).format("DD MMM YYYY ")}
            <span className="text-gray-400">
              {dayjs(dateObject).format("hh:mm A")}
            </span>
          </span>
        );
      },
    },
    {
      title: "Response",
      dataIndex: "response",
      render: (response: TradeReport["response"]) => {
        if (!response || !response.body || !response.body.results) {
          return <span className="text-gray-300">---</span>;
        }
        const successResponses = response.body.results.filter(
          (result) => result.success
        );
        const failedResponses = response.body.results.filter(
          (result) => !result.success
        );
        return (
          <span className="flex items-center">
            {!!successResponses.length && (
              <Popover
                trigger={"hover"}
                placement="left"
                content={
                  <div className="grid gap-1">
                    <p className="text-gray-700 font-semibold border-b pb-1 border-b-gray-200 uppercase tracking-wider text-xs">
                      Users ({successResponses.length})
                    </p>

                    {successResponses.map((result, index) => (
                      <span key={index} className="text-gray-600">
                        {result.username}
                      </span>
                    ))}
                  </div>
                }
              >
                <Tag color="green" className="">
                  {successResponses.length} Success
                </Tag>
              </Popover>
            )}
            {!!failedResponses.length && (
              <Popover
                trigger={"hover"}
                placement="right"
                content={
                  <div className="grid gap-1">
                    <p className="text-gray-700 font-semibold border-b pb-1 border-b-gray-200 uppercase tracking-wider text-xs">
                      Users ({failedResponses.length})
                    </p>
                    {failedResponses.map((result, index) => (
                      <span key={index} className="text-gray-600">
                        {result.username}
                      </span>
                    ))}
                  </div>
                }
              >
                <Tag color="red" className="">
                  {failedResponses.length} Failed
                </Tag>
              </Popover>
            )}
          </span>
        );
      },
    },

    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
      sortOrder:
        sortField === "created_at"
          ? sortOrder === "asc"
            ? "ascend"
            : "descend"
          : undefined,
      render: (date) => (
        <span className="text-gray-600">
          {dayjs(date).format("DD MMM YYYY ")}
          <span className="text-gray-400">{dayjs(date).format("hh:mm A")}</span>
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold font-poppins">Trade Reports</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search Instrument Name"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-full w-64"
            allowClear
          />
        </div>
      </div>

      <Table<TradeReport>
        loading={isFetching}
        columns={columns}
        dataSource={data?.data ?? []}
        rowKey="id"
        onRow={onRow}
        rowClassName={"cursor-pointer"}
        pagination={{
          onChange: (page) => {
            setCurrentPage(page);
          },
          total: data?.pagination?.total,
          pageSize: PAGE_LIMIT,
          current: currentPage,
          showSizeChanger: false,
          showTotal(total, range) {
            return `Showing ${range[0]}-${range[1]} of ${total} reports`;
          },
        }}
        onChange={(_pagination, _filters, sorter) => {
          if (Array.isArray(sorter)) return;
          if (sorter && sorter.order) {
            setSortField(sorter.field as string);
            setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
          } else {
            setSortField(undefined);
            setSortOrder(undefined);
          }
        }}
      />
    </div>
  );
};

export default TradeReportTable;
