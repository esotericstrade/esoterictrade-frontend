// src/Pages/Users/index.tsx
import { actorService } from "@/utils/api/actor/service";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Input, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import AddNewActorModal from "./components/AddNewActor";

const PAGE_LIMIT = 12;

const Actors = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounceValue(search, 500);

  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(
    undefined
  );

  const { data, isFetching } = useQuery({
    queryKey: ["actors", currentPage, debouncedSearch, sortField, sortOrder],
    queryFn: () =>
      actorService.getAllActors({
        page: currentPage,
        limit: PAGE_LIMIT,
        instrument: debouncedSearch || undefined,
        sort_by: sortField,
        sort_order: sortOrder,
      }),
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
      title: "Instrument Name",
      dataIndex: "instrument_name",
      key: "instrument_name",
      sorter: true,
      sortOrder:
        sortField === "instrument_name"
          ? sortOrder === "asc"
            ? "ascend"
            : "descend"
          : undefined,
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
              <Tag color="yellow">LTP:&nbsp;{record.parameters.ltp}</Tag>
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
      sorter: true,
      sortOrder:
        sortField === "created_at"
          ? sortOrder === "asc"
            ? "ascend"
            : "descend"
          : undefined,
      render: (date) => dayjs(date).format("DD MMM YYYY"),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold font-poppins">
          Actors Management
        </h1>
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

export default Actors;
