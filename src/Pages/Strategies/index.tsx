// src/Pages/Users/index.tsx
import { strategyService } from "@/utils/api/strategy/service";
import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";

const PAGE_LIMIT = 20;

const Strategies = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isFetching } = useQuery({
    queryKey: ["strategies", currentPage],
    queryFn: () => strategyService.getAllStrategies(currentPage, PAGE_LIMIT),
    initialData: {
      pagination: {
        pages: 0,
        total: 0,
        page: 1,
        limit: PAGE_LIMIT,
      },
      data: [],
    },
  });

  const onRow = (record: Strategy) => {
    return {
      onClick: () => {
        // Handle row click
        console.log("Row clicked:", record);
      },
    };
  };

  const columns: ColumnsType<Strategy> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => dayjs(date).format("DD MMM YYYY"),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => dayjs(date).format("DD MMM YYYY"),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold font-poppins">
          Strategies Management
        </h2>
      </div>

      <Table
        loading={isFetching}
        columns={columns}
        dataSource={data.data}
        rowKey="id"
        onRow={onRow}
        rowClassName={"cursor-pointer"}
        pagination={{
          onChange: (page) => {
            setCurrentPage(page);
          },
          total: data.pagination.total,
          pageSize: PAGE_LIMIT,
          current: currentPage,
          showTotal(total, range) {
            return `Showing ${range[0]}-${range[1]} of ${total} actors`;
          },
        }}
      />
    </div>
  );
};

export default Strategies;
