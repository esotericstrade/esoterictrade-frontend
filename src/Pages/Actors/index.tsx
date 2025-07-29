// src/Pages/Users/index.tsx
import { actorService } from "@/utils/api/actor/service";
import { PlusOutlined } from "@ant-design/icons";
import { PencilLine } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import { Button, Input, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import AddNewActorModal from "./components/AddNewActor";
import UpdateActorModal from "./components/UpdateActorModal";

const PAGE_LIMIT = 20;

const Actors = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

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
        size: PAGE_LIMIT,
        instrument: debouncedSearch || undefined,
        sort_by: sortField,
        sort_order: sortOrder,
      }),
    initialData: {
      pagination: {
        pages: 0,
        total: 0,
        page: 1,
        size: PAGE_LIMIT,
      },
      data: [],
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
      align: "end",
      render: (_, record) => {
        return (
          <div className="flex items-center gap-2 justify-end">
            {record.parameters.tick_size && (
              <Tag className="me-0" color="blue">
                Tick Size:&nbsp;{record.parameters.tick_size}
              </Tag>
            )}
            <Tag className="me-0" color="red">
              SL:&nbsp;{record.parameters.stoploss}
            </Tag>
            {record.parameters.ltp && (
              <Tag className="me-0" color="yellow">
                LTP:&nbsp;{record.parameters.ltp}
              </Tag>
            )}
            <Tag className="me-0" color="green">
              Target:&nbsp;{record.parameters.target}
            </Tag>
            <button
              className="flex items-center justify-center p-1 text-blue-600 border border-gray-200 rounded hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedActor(record);
                setUpdateModalOpen(true);
              }}
            >
              <PencilLine size={14} />
            </button>
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
      align: "end",
      render: (date) => (
        <span>
          {dayjs(date).format("DD MMM YYYY ")}
          <span className="text-gray-400">{dayjs(date).format("hh:mm A")}</span>
        </span>
      ),
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
      <UpdateActorModal
        actor={selectedActor}
        open={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
          setSelectedActor(null);
        }}
      />
    </div>
  );
};

export default Actors;
