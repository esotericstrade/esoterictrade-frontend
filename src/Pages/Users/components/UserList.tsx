// src/Pages/Users/index.tsx
import { adminService } from "@/utils/api/admin/service";
import {
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  PlusOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Button, message, Modal, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserFormModal from "./UserFormModal";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<User> | undefined>(
    undefined
  );
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const navigate = useNavigate();

  const fetchUsers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers(page, limit);
      console.log("API Response:", response); // Debug: Log full response

      // Handle different response formats
      if (Array.isArray(response)) {
        // If response is directly an array of users
        setUsers(response);
        setPagination({
          ...pagination,
          total: response.length,
        });
      } else if (response && typeof response === "object") {
        // If response is a paginated object
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setPagination({
            current: response.page || 1,
            pageSize: response.limit || 10,
            total: response.total || response.data.length,
          });
        } else if (response.users && Array.isArray(response.users)) {
          // Alternative structure some APIs use
          setUsers(response.users);
          setPagination({
            current: response.page || 1,
            pageSize: response.limit || 10,
            total: response.total || response.users.length,
          });
        } else {
          // If we can't find an array in the expected places, log error
          console.error("Unexpected response structure:", response);
          message.error("Received unexpected data format from server");
        }
      } else {
        console.error("Invalid response:", response);
        message.error("Received invalid data from server");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchUsers(pagination.current, pagination.pageSize);
  };

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
      fetchUsers(pagination.current, pagination.pageSize);
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
      fetchUsers(pagination.current, pagination.pageSize);
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
          fetchUsers(pagination.current, pagination.pageSize);
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
        <Space size="middle" onClick={(e) => e.stopPropagation()}>
          <Button
            icon={<EditOutlined />}
            size="small"
            type="primary"
            onClick={() => handleEditUser(record)}
          />
          {record.is_active ? (
            <Button
              icon={<LockOutlined />}
              size="small"
              danger
              onClick={() => handleDeactivateUser(record.id)}
            />
          ) : (
            <Button
              icon={<UnlockOutlined />}
              size="small"
              type="default"
              onClick={() => {
                /* Handle activate */
              }}
            />
          )}
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDeleteUser(record.id)}
          />
        </Space>
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
        loading={loading}
        columns={columns}
        dataSource={users}
        rowKey="id"
        onRow={onRow}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
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
