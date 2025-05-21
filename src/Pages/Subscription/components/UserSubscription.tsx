import { adminService } from "@/utils/api/admin/service";
import { subscriptionService } from "@/utils/api/subscription/service";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Button, Input, Switch, Tag } from "antd";
import Table, { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AddNewSubscription from "./AddNewSubscription";
import SubscriptionQuantityEdit from "./SubscriptionQuantityEdit";
import SubscriptionStatusToggle from "./SubscriptionStatusToggle";

const PAGE_LIMIT = 12;

const UserSubscription = () => {
  const [activeOnly, setActiveOnly] = useState(false);
  const { userId, userName } = useParams();

  const { data: user } = useQuery({
    queryKey: ["user", userName],
    queryFn: () => {
      if (!userName) {
        throw new Error("User name is required");
      }
      return adminService.getUserByUsername(userName);
    },
  });

  const { data, isFetching } = useQuery({
    queryKey: ["userSubscription", userId, activeOnly],
    enabled: !!userId,
    initialData: {
      active: 0,
      subscriptions: [],
      total: 0,
    },
    queryFn: ({ queryKey }) => {
      const [, userIdKey, activeOnlyKey] = queryKey;
      if (!userIdKey) {
        throw new Error("User ID is required");
      }
      return subscriptionService.getUserSubscriptions({
        userId: userIdKey as string,
        activeOnly: Boolean(activeOnlyKey),
      });
    },
  });

  const [searchText, setSearchText] = React.useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(PAGE_LIMIT);

  type SorterType = {
    columnKey?: string | number;
    order?: "ascend" | "descend";
  };
  const [sortedInfo, setSortedInfo] = React.useState<SorterType>({});

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1); // Reset to first page on search
    setSearchText(e.target.value);
  };

  const handleChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Subscription> | SorterResult<Subscription>[]
  ) => {
    // Handle sorting
    const sortObj = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortedInfo({
      columnKey: sortObj?.columnKey as string | number | undefined,
      order: sortObj?.order === null ? undefined : sortObj?.order,
    });
    // Handle pagination
    if (pagination.current) setCurrentPage(pagination.current);
    if (pagination.pageSize) setPageSize(pagination.pageSize);
  };

  // Filtered data based on search only (activeOnly handled by backend)
  const filteredData = React.useMemo(() => {
    return data.subscriptions.filter((sub) =>
      sub.actor.instrument_name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data.subscriptions, searchText]);

  // Sorted data based on sortedInfo
  const sortedData = React.useMemo(() => {
    if (!sortedInfo.columnKey || !sortedInfo.order) return filteredData;
    const sorted = [...filteredData];
    if (sortedInfo.columnKey === "instrument_name") {
      sorted.sort((a, b) => {
        const result = a.actor.instrument_name.localeCompare(
          b.actor.instrument_name
        );
        return sortedInfo.order === "ascend" ? result : -result;
      });
    }
    // Add more sorting logic here if you add more sortable columns
    return sorted;
  }, [filteredData, sortedInfo]);

  // Paginated data
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize]);

  const columns: ColumnsType<Subscription> = [
    {
      title: "Instrument",
      dataIndex: ["actor", "instrument_name"],
      key: "instrument_name",
      sorter: (a, b) =>
        a.actor.instrument_name.localeCompare(b.actor.instrument_name),
      sortOrder:
        sortedInfo.columnKey === "instrument_name" ? sortedInfo.order : null,
      render: (_, record) => {
        return record.actor.instrument_name;
      },
    },
    {
      title: "Strategy Name",
      render: (_, record) => {
        return record.actor.name;
      },
    },
    {
      title: "Parameters",
      render: (_, record) => {
        return (
          <div>
            <Tag color="red">SL:{record.actor.parameters.stoploss}</Tag>
            {record.actor.parameters.ltp && (
              <Tag color="yellow">LTP: {record.actor.parameters.ltp}</Tag>
            )}
            <Tag color="green">Target: {record.actor.parameters.target}</Tag>
          </div>
        );
      },
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (record) => (
        <SubscriptionQuantityEdit record={record} userId={userId as string} />
      ),
    },
    {
      title: (
        <Switch
          checked={activeOnly}
          onChange={setActiveOnly}
          checkedChildren="Active Only"
          unCheckedChildren="All Subs."
        />
      ),
      align: "center",
      key: "active",
      render: (record) => (
        <SubscriptionStatusToggle record={record} userId={userId as string} />
      ),
    },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold font-poppins">
            Subscriptions
            {user ? ` of ${user.first_name} ${user.last_name}` : ""}
          </h2>

          <div className="flex items-center gap-2">
            <Tag color="green">
              Active: {data.active} out of {data.total}
            </Tag>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search by username, email, name, or role"
            value={searchText}
            onChange={handleSearch}
            className="rounded-full w-64"
            prefix={<MagnifyingGlass />}
          />
          <AddNewSubscription>
            {({ setOpen }) => (
              <Button
                type="primary"
                icon={<Plus />}
                onClick={() => setOpen(true)}
              >
                Add New Subscription
              </Button>
            )}
          </AddNewSubscription>
        </div>
      </div>

      <Table
        loading={isFetching}
        dataSource={paginatedData}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} subscriptions`,
        }}
        rowKey="id"
        scroll={{ x: true }}
        onChange={handleChange}
      />
    </section>
  );
};

export default UserSubscription;
