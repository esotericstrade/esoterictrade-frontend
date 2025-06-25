// src/Pages/Users/index.tsx
import { adminService } from "@/utils/api/admin/service";
import { PlusOutlined } from "@ant-design/icons";
import {
  DotsThreeOutlineVertical,
  LockKey,
  LockKeyOpen,
  MagnifyingGlass,
  Pencil,
  Trash,
} from "@phosphor-icons/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Dropdown, Input, message, Table, Tag } from "antd";
import useApp from "antd/es/app/useApp";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import UserFormModal from "./UserFormModal";

const PAGE_LIMIT = 20;

const Users = () => {
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<User> | undefined>(
    undefined
  );
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText] = useDebounceValue(searchText, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(
    undefined
  );
  const { modal } = useApp();

  const navigate = useNavigate();

  const { data, isFetching } = useQuery({
    queryKey: ["users", currentPage, debouncedSearchText, sortField, sortOrder],
    queryFn: () =>
      adminService.getAllUsers({
        page: currentPage,
        limit: PAGE_LIMIT,
        searchQuery: debouncedSearchText,
        sortField,
        sortOrder,
      }),
    initialData: {
      pagination: {
        limit: PAGE_LIMIT,
        page: currentPage,
        total: 0,
        pages: 0,
      },
      data: [],
    },
    // Remove local sorting, rely on API sorting
    select(data) {
      return data;
    },
  });

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setModalVisible(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedUser(undefined);
  };

  const handleModalSubmit = async (
    values: RegisterUserRequest | Partial<User>
  ) => {
    setModalLoading(true);
    try {
      if (selectedUser?.id) {
        // Edit existing user
        await adminService.updateUserById(
          selectedUser.id,
          values as Partial<User>
        );
        message.success("User updated successfully");
      } else {
        // Add new user
        await adminService.registerUser(values as RegisterUserRequest);
        message.success("User added successfully");
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving user:", error);
      message.error("Failed to save user");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeactivateUser = async (userId: number) => {
    try {
      await adminService.deactivateUser(userId);
      message.success("User deactivated successfully");
      queryClient.invalidateQueries({
        queryKey: ["users", currentPage],
      });
    } catch (error) {
      console.error("Error deactivating user:", error);
      message.error("Failed to deactivate user");
    }
  };

  const handleDeleteUser = (userId: number) => {
    modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      onOk: () => {
        return adminService
          .deleteUserById(userId)
          .then(() => {
            message.success("User deleted successfully");
            queryClient.invalidateQueries({
              queryKey: ["users", currentPage],
            });
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
            message.error("Failed to delete user");
          });
      },
    });
  };

  const gotoSubscription = (record: User) => {
    navigate(`/subscription/${record.username}/${record.id}`);
  };

  const gotoPositions = (record: User) => {
    navigate(`/positions/${record.username}/${record.id}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const columns: ColumnsType<User> = [
    {
      title: "Name",
      key: "name",
      dataIndex: "first_name",
      sorter: true,
      sortOrder:
        sortField === "name"
          ? sortOrder === "asc"
            ? "ascend"
            : sortOrder === "desc"
            ? "descend"
            : undefined
          : undefined,
      render: (_, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "blue" : "green"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (
        <Tag color={isActive ? "success" : "error"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Subscription",
      key: "subscription",
      dataIndex: "subscription",
      render: (_, record) => (
        <span
          className="flex items-center gap-0.5 text-blue-600 hover:underline cursor-pointer"
          role="link"
          onClick={() => gotoSubscription(record)}
        >
          Subscriptions <ArrowRight size={14} weight="bold" />
        </span>
      ),
    },
    {
      title: "Positions",
      key: "positions",
      dataIndex: "positions",
      render: (_, record) => (
        <span
          className="flex items-center gap-0.5 text-blue-600 hover:underline cursor-pointer"
          role="link"
          onClick={() => gotoPositions(record)}
        >
          Positions <ArrowRight size={14} weight="bold" />
        </span>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 60,
      render: (_, record) => (
        <div className="grid place-items-center">
          <Dropdown
            menu={{
              items: [
                {
                  key: "edit",
                  label: "Edit User",
                  icon: <Pencil size={14} />,
                  onClick: () => handleEditUser(record),
                },
                {
                  key: "deactivate",
                  label: record.is_active ? "Deactivate User" : "Activate User",
                  icon: record.is_active ? (
                    <LockKey size={14} />
                  ) : (
                    <LockKeyOpen size={14} />
                  ),
                  onClick: () =>
                    record.is_active
                      ? handleDeactivateUser(record.id)
                      : () => {
                          /* Handle activate */
                        },
                },
                {
                  key: "delete",
                  label: "Delete User",
                  icon: <Trash size={14} />,
                  danger: true,
                  onClick: () => handleDeleteUser(record.id),
                },
              ],
            }}
            trigger={["hover"]}
            placement="bottomRight" // Adjust placement as needed
            className="cursor-pointer"
          >
            <Button
              size="small"
              className="!rounded-md"
              icon={<DotsThreeOutlineVertical weight="bold" size={14} />}
            />
          </Dropdown>
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
      align: "end",
      width: 180,
      sortOrder:
        sortField === "created_at"
          ? sortOrder === "asc"
            ? "ascend"
            : sortOrder === "desc"
            ? "descend"
            : undefined
          : undefined,
      render: (d) => {
        const dt = dayjs(d);
        return (
          <div>
            {dt.format("DD MMM YYYY ")}
            <span className="text-gray-400">{dt.format("HH:mm A")}</span>
          </div>
        );
      },
    },
  ];

  // Table onChange handler for sorting
  const handleTableChange = (
    _pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<User> | SorterResult<User>[]
  ) => {
    // Only handle single sorter
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    if (singleSorter && typeof singleSorter.field === "string") {
      let field = singleSorter.field;
      if (field === "name") field = "name";
      if (field === "created_at") field = "created_at";
      setSortField(field);
      setSortOrder(
        singleSorter.order === "ascend"
          ? "asc"
          : singleSorter.order === "descend"
          ? "desc"
          : undefined
      );
    } else {
      setSortField(undefined);
      setSortOrder(undefined);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold font-poppins">User Management</h2>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search by username, email, name, or role"
            value={searchText}
            onChange={handleSearch}
            className="rounded-full w-64"
            prefix={<MagnifyingGlass />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
          >
            Add New User
          </Button>
        </div>
      </div>

      <Table
        loading={isFetching}
        columns={columns}
        dataSource={data.data}
        rowKey="id"
        pagination={{
          onChange: (page) => {
            setCurrentPage(page);
          },
          total: data.pagination.total,
          pageSize: PAGE_LIMIT,
          current: currentPage,
          showTotal(total, range) {
            return `Showing ${range[0]}-${range[1]} of ${total} users`;
          },
        }}
        onChange={handleTableChange}
      />

      <UserFormModal
        visible={modalVisible}
        initialValues={selectedUser}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
      />
    </div>
  );
};

export default Users;
