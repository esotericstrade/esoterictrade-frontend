// src/components/GTTManagement/index.tsx
import { webhookService } from "@/utils/api/webhook/service";
import { PlusCircle, Target } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Modal, Radio, message } from "antd";
import { useState } from "react";

interface GTTManagementProps {
  // Optional props for customization
}

const GTTManagement: React.FC<GTTManagementProps> = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [actionType, setActionType] = useState<"create" | "update">("create");

  // Create GTT mutation
  const createGTTMutation = useMutation({
    mutationFn: webhookService.createGTT,
    onSuccess: (response) => {
      if (response.success) {
        message.success(response.message || "GTT created successfully");
        form.resetFields();
        setIsModalVisible(false);
      } else {
        message.error(response.message || "Failed to create GTT");
      }
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || "Error creating GTT order"
      );
    },
  });

  // Update GTT mutation
  const updateGTTMutation = useMutation({
    mutationFn: webhookService.updateGTT,
    onSuccess: (response) => {
      if (response.success) {
        message.success(response.message || "GTT updated successfully");
        form.resetFields();
        setIsModalVisible(false);
      } else {
        message.error(response.message || "Failed to update GTT");
      }
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || "Error updating GTT order"
      );
    },
  });

  const handleSubmit = async (values: GTTWebhookPayload) => {
    if (actionType === "create") {
      createGTTMutation.mutate(values);
    } else {
      updateGTTMutation.mutate(values);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const isLoading = createGTTMutation.isPending || updateGTTMutation.isPending;

  return (
    <>
      {/* Hidden trigger button */}
      <button
        id="gtt-trigger-button"
        onClick={showModal}
        style={{ display: 'none' }}
      />

      <Modal
        title={
          <div className="flex items-center gap-2">
            <Target size={20} />
            <span>GTT Order Management</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          {/* Action Type Selection */}
          <Form.Item label="Action Type" className="mb-6">
            <Radio.Group
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              buttonStyle="solid"
              className="w-full"
            >
              <Radio.Button value="create" className="w-1/2 text-center">
                <PlusCircle size={16} className="inline-block mr-1" />
                Create GTT
              </Radio.Button>
              <Radio.Button value="update" className="w-1/2 text-center">
                <Target size={16} className="inline-block mr-1" />
                Update GTT
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {/* Instrument Field */}
          <Form.Item
            label="Instrument"
            name="instrument"
            rules={[
              { required: true, message: "Please enter the instrument symbol" },
            ]}
          >
            <Input
              placeholder="e.g., HAL25JULFUT"
              size="middle"
              className="uppercase"
              onChange={(e) => {
                form.setFieldValue("instrument", e.target.value.toUpperCase());
              }}
            />
          </Form.Item>

          {/* LTP Field */}
          <Form.Item
            label="Last Traded Price (LTP)"
            name="ltp"
            rules={[
              { required: true, message: "Please enter the LTP" },
              {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: "Please enter a valid price",
              },
            ]}
          >
            <Input
              placeholder="e.g., 4944"
              size="middle"
              prefix="₹"
              type="number"
              step="0.01"
            />
          </Form.Item>

          {/* Target Price Field */}
          <Form.Item
            label="Target Price"
            name="new_target"
            rules={[
              { required: true, message: "Please enter the target price" },
              {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: "Please enter a valid price",
              },
            ]}
          >
            <Input
              placeholder="e.g., 3"
              size="middle"
              prefix="₹"
              type="number"
              step="0.01"
            />
          </Form.Item>

          {/* Stop Loss Field */}
          <Form.Item
            label="Stop Loss"
            name="new_stoploss"
            rules={[
              { required: true, message: "Please enter the stop loss" },
              {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: "Please enter a valid price",
              },
            ]}
          >
            <Input
              placeholder="e.g., 2.85"
              size="middle"
              prefix="₹"
              type="number"
              step="0.01"
            />
          </Form.Item>

          {/* Form Actions */}
          <Form.Item className="mb-0 mt-6">
            <div className="flex gap-3">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                size="middle"
                className="flex-1"
                icon={
                  actionType === "create" ? (
                    <PlusCircle size={16} />
                  ) : (
                    <Target size={16} />
                  )
                }
              >
                {actionType === "create" ? "Create GTT Order" : "Update GTT Order"}
              </Button>
              <Button
                onClick={handleCancel}
                size="middle"
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default GTTManagement;