// src/Pages/Users/index.tsx
import { actorService } from "@/utils/api/actor/service";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import AddNewActorModal from "./components/AddNewActor";

const PAGE_LIMIT = 12;

const Actors = () => {
  // const [selectedActor, setSelectedActor] = useState<
  //   Partial<Actor> | undefined
  // >(undefined);

  const [currentPage, setCurrentPage] = useState(1);

  const { data, isFetching } = useQuery({
    queryKey: ["actors", currentPage],
    queryFn: () => actorService.getAllActors(currentPage, PAGE_LIMIT),
    initialData: {
      pagination: {
        pages: 0,
        total: 0,
        page: 1,
        limit: PAGE_LIMIT,
      },
      actors: [],
    },
  });
  console.log("🚀 ~ Actors ~ data:", data);

  const onRow = (record: Actor) => {
    return {
      onClick: () => {
        // Handle row click
        console.log("Row clicked:", record);
      },
    };
  };

  const columns: ColumnsType<Actor> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Instrument Name",
      dataIndex: "instrument_name",
      key: "instrument_name",
    },
    {
      title: "Strategy Name",
      dataIndex: "strategy_name",
      key: "strategy_name",
    },
    {
      title: "Parameters",
      render: (_, record) => {
        return (
          <div>
            <Tag color="red">SL:&nbsp;{record.parameters.stoploss}</Tag>
            {record.parameters.ltp && (
              <Tag color="amber">LTP:&nbsp;{record.parameters.ltp}</Tag>
            )}
            <Tag color="green">Target:&nbsp;{record.parameters.target}</Tag>
          </div>
        );
      },
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
        <h1 className="text-2xl font-semibold">Actors Management</h1>
        <AddNewActorModal>
          {({ setOpen }) => (
            <>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setOpen(true)}
              >
                Add New Actor
              </Button>
            </>
          )}
        </AddNewActorModal>
      </div>

      <Table
        loading={isFetching}
        columns={columns}
        dataSource={data.actors}
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

export default Actors;
