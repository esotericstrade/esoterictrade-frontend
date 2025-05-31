// src/Pages/Users/index.tsx
import { adminService } from "@/utils/api/admin/service";
import { PlusOutlined } from "@ant-design/icons";
import {
  LockKey,
  LockKeyOpen,
  MagnifyingGlass,
  Pencil,
  Trash,
} from "@phosphor-icons/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, message, Table, Tag } from "antd";
import useApp from "antd/es/app/useApp";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { FilterValue, SorterResult } from "antd/es/table/interface";
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

  const onRow = (record: User) => {
    return {
      onClick: () => {
        // Handle row click
        navigate(`/subscription/${record.username}/${record.id}`);
      },
    };
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
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      sorter: true,
      sortOrder:
        sortField === "created_at"
          ? sortOrder === "asc"
            ? "ascend"
            : sortOrder === "desc"
            ? "descend"
            : undefined
          : undefined,
      render: (d) =>
        Array.isArray(d)
          ? new Date(d[0], d[1] - 1, d[2]).toLocaleDateString()
          : "Invalid",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="small"
            type="primary"
            icon={<Pencil weight="bold" />}
            onClick={() => handleEditUser(record)}
          />
          {record.is_active ? (
            <Button
              size="small"
              className="bg-amber-600 text-white"
              icon={<LockKey weight="bold" />}
              onClick={() => handleDeactivateUser(record.id)}
            />
          ) : (
            <Button
              size="small"
              className="bg-amber-600 text-white"
              icon={<LockKeyOpen weight="bold" />}
              onClick={() => {
                /* Handle activate */
              }}
            />
          )}
          <Button
            size="small"
            className="bg-rose-600 text-white"
            icon={<Trash weight="bold" />}
            onClick={() => handleDeleteUser(record.id)}
          />
        </div>
      ),
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
