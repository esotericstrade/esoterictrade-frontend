// src/Pages/Users/index.tsx
import { adminService } from "@/utils/api/admin/service";
import { PlusOutlined } from "@ant-design/icons";
import { LockKey, LockKeyOpen, Pencil, Trash } from "@phosphor-icons/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserFormModal from "./UserFormModal";

const PAGE_LIMIT = 10;

const Users = () => {
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<User> | undefined>(
    undefined
  );

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const { data, isFetching } = useQuery({
    queryKey: ["users", currentPage],
    queryFn: () => adminService.getAllUsers(currentPage, PAGE_LIMIT),
    initialData: {
      pagination: {
        limit: PAGE_LIMIT,
        page: currentPage,
        total: 0,
        pages: 0,
      },
      users: [],
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

  const handleModalSubmit = async (values: any) => {
    setModalLoading(true);
    try {
      if (selectedUser?.id) {
        // Edit existing user
        await adminService.updateUserById(selectedUser.id, values);
        message.success("User updated successfully");
      } else {
        // Add new user
        await adminService.registerUser(values);
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

  const handleDeleteUser = async (userId: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await adminService.deleteUserById(userId);
          message.success("User deleted successfully");
          queryClient.invalidateQueries({
            queryKey: ["users", currentPage],
          });
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error("Failed to delete user");
        }
      },
    });
  };

  const onRow = (record: User) => {
    return {
      onClick: () => {
        // Handle row click
        navigate(`/subscription/${record.id}`);
      },
    };
  };

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => `${record.first_name} ${record.last_name}`,
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
      render: (date) => new Date(date).toLocaleDateString(),
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
            type="primary"
            icon={<Pencil weight="bold" />}
            onClick={() => handleEditUser(record)}
          />
          {record.is_active ? (
            <Button
              className="bg-amber-600 text-white"
              icon={<LockKey weight="bold" />}
              onClick={() => handleDeactivateUser(record.id)}
            />
          ) : (
            <Button
              className="bg-amber-600 text-white"
              icon={<LockKeyOpen weight="bold" />}
              onClick={() => {
                /* Handle activate */
              }}
            />
          )}
          <Button
            className="bg-rose-600 text-white"
            icon={<Trash weight="bold" />}
            onClick={() => handleDeleteUser(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
          Add New User
        </Button>
      </div>

      <Table
        loading={isFetching}
        columns={columns}
        dataSource={data.users}
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
