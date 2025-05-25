// src/Pages/Brokers/index.tsx
import { adminService } from "@/utils/api/admin/service";
import { PlusOutlined } from "@ant-design/icons";
import { LockKey, LockKeyOpen, Pencil, Trash } from "@phosphor-icons/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrokerFormModal from "./BrokerFormModal";

const PAGE_LIMIT = 10;

const Brokers = () => {
  const queryClient = useQueryClient();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<
    Partial<BrokerAccount> | undefined
  >(undefined);

  // Add delete confirmation modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [brokerToDelete, setBrokerToDelete] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const { data, isFetching } = useQuery({
    queryKey: ["brokers"], // Remove currentPage from queryKey to fetch all data once
    queryFn: () => {
      return adminService.getAllBrokers(1, 100); // Fetch all brokers at once
    },
    select(data) {
      // Sort all brokers
      const sortedBrokers = data.brokers.sort(
        (a: BrokerAccount, b: BrokerAccount) => {
          const nameA = (
            a.metadata?.account_nickname || a.account_number
          ).toLowerCase();
          const nameB = (
            b.metadata?.account_nickname || b.account_number
          ).toLowerCase();
          return nameA.localeCompare(nameB);
        }
      );

      // Client-side pagination
      const startIndex = (currentPage - 1) * PAGE_LIMIT;
      const endIndex = startIndex + PAGE_LIMIT;
      const paginatedBrokers = sortedBrokers.slice(startIndex, endIndex);

      return {
        pagination: {
          ...data.pagination,
          total: sortedBrokers.length,
          page: currentPage,
          limit: PAGE_LIMIT,
          pages: Math.ceil(sortedBrokers.length / PAGE_LIMIT),
        },
        brokers: paginatedBrokers,
        allBrokers: sortedBrokers, // Keep all brokers for pagination
      };
    },
  });

  const handleAddBroker = () => {
    setSelectedBroker(undefined);
    setModalVisible(true);
  };

  const handleEditBroker = (broker: BrokerAccount) => {
    setSelectedBroker(broker);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedBroker(undefined);
  };

  const handleModalSubmit = async (values: any) => {
    setModalLoading(true);
    try {
      if (selectedBroker?.id) {
        // Edit existing broker
        await adminService.updateBrokerById(selectedBroker.id, values);
        message.success("Broker updated successfully");
      } else {
        // Add new broker
        await adminService.createBroker(values);
        message.success("Broker added successfully");
      }
      setModalVisible(false);
      queryClient.invalidateQueries({
        queryKey: ["brokers"], // Fixed: Match the actual queryKey
      });
    } catch (error) {
      message.error("Failed to save broker");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeactivateBroker = async (brokerId: number) => {
    try {
      await adminService.deactivateBroker(brokerId);
      message.success("Broker deactivated successfully");
      queryClient.invalidateQueries({
        queryKey: ["brokers"], // Fixed: Match the actual queryKey
      });
    } catch (error) {
      message.error("Failed to deactivate broker");
    }
  };

  const handleActivateBroker = async (brokerId: number) => {
    try {
      await adminService.activateBroker(brokerId);
      message.success("Broker activated successfully");
      queryClient.invalidateQueries({
        queryKey: ["brokers"], // Fixed: Match the actual queryKey
      });
    } catch (error) {
      message.error("Failed to activate broker");
    }
  };

  const handleDeleteBroker = async (brokerId: number) => {
    setBrokerToDelete(brokerId);
    setDeleteModalVisible(true);
  };

  const confirmDeleteBroker = async () => {
    if (!brokerToDelete) return;

    try {

      message.success("Broker deleted successfully");

      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({
        queryKey: ["brokers"],
      });

      // Close modal and reset state
      setDeleteModalVisible(false);
      setBrokerToDelete(null);
    } catch (error) {
      // More specific error handling
      if (error instanceof Error) {
        message.error(`Failed to delete broker: ${error.message}`);
      } else {
        message.error("Failed to delete broker: Unknown error");
      }
    }
  };

  const cancelDeleteBroker = () => {
    setDeleteModalVisible(false);
    setBrokerToDelete(null);
  };

  const onRow = (record: BrokerAccount) => {
    return {
      onClick: () => {
        // Handle row click - navigate to broker details
        navigate(`/brokers/${record.id}/details`);
      },
    };
  };

  const columns: ColumnsType<BrokerAccount> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Account Number",
      dataIndex: "account_number",
      key: "account_number",
    },
    {
      title: "Broker Type",
      dataIndex: "broker_type",
      key: "broker_type",
      render: (type) => <Tag color="blue">{type.toUpperCase()}</Tag>,
    },
    {
      title: "Account Nickname",
      key: "account_nickname",
      render: (_, record) => record.metadata?.account_nickname || "-",
    },
    {
      title: "API Key",
      dataIndex: "has_api_key",
      key: "has_api_key",
      render: (hasApiKey) => (
        <Tag color={hasApiKey ? "success" : "error"}>
          {hasApiKey ? "✓" : "✗"}
        </Tag>
      ),
    },
    {
      title: "API Secret",
      dataIndex: "has_api_secret",
      key: "has_api_secret",
      render: (hasApiSecret) => (
        <Tag color={hasApiSecret ? "success" : "error"}>
          {hasApiSecret ? "✓" : "✗"}
        </Tag>
      ),
    },
    {
      title: "Access Token",
      dataIndex: "has_access_token",
      key: "has_access_token",
      render: (hasAccessToken) => (
        <Tag color={hasAccessToken ? "success" : "error"}>
          {hasAccessToken ? "✓" : "✗"}
        </Tag>
      ),
    },
    {
      title: "Refresh Token",
      dataIndex: "has_refresh_token",
      key: "has_refresh_token",
      render: (hasRefreshToken) => (
        <Tag color={hasRefreshToken ? "success" : "error"}>
          {hasRefreshToken ? "✓" : "✗"}
        </Tag>
      ),
    },
    {
      title: "Token Status",
      key: "token_status",
      render: (_, record) => {
        const hasToken = record.has_access_token;
        const isExpired = record.token_expires_at
          ? new Date(record.token_expires_at) < new Date()
          : false;

        if (!hasToken) {
          return <Tag color="error">No Token</Tag>;
        }
        if (isExpired) {
          return <Tag color="warning">Expired</Tag>;
        }
        return <Tag color="success">Valid</Tag>;
      },
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
            size="small"
            type="primary"
            icon={<Pencil weight="bold" />}
            onClick={() => {
              handleEditBroker(record);
            }}
          />
          {record.is_active ? (
            <Button
              size="small"
              className="bg-amber-600 text-white"
              icon={<LockKey weight="bold" />}
              onClick={() => {
                handleDeactivateBroker(record.id);
              }}
            />
          ) : (
            <Button
              size="small"
              className="bg-amber-600 text-white"
              icon={<LockKeyOpen weight="bold" />}
              onClick={() => {
                handleActivateBroker(record.id);
              }}
            />
          )}
          <Button
            size="small"
            className="bg-rose-600 text-white"
            icon={<Trash weight="bold" />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              handleDeleteBroker(record.id);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Broker Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddBroker}
        >
          Add New Broker
        </Button>
      </div>

      <Table
        loading={isFetching}
        columns={columns}
        dataSource={data?.brokers || []}
        rowKey="id"
        onRow={onRow}
        rowClassName={"cursor-pointer"}
        pagination={
          data?.pagination
            ? {
                onChange: (page) => {
                  setCurrentPage(page);
                },
                total: data.pagination.total,
                pageSize: PAGE_LIMIT,
                current: currentPage,
                showTotal(total, range) {
                  return `Showing ${range[0]}-${range[1]} of ${total} brokers`;
                },
              }
            : false
        }
      />

      <BrokerFormModal
        visible={modalVisible}
        initialValues={selectedBroker}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        loading={modalLoading}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Broker"
        open={deleteModalVisible}
        onCancel={cancelDeleteBroker}
        centered
        footer={[
          <Button
            key="delete"
            type="primary"
            danger
            onClick={confirmDeleteBroker}
          >
            Yes, Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this broker account?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default Brokers;
