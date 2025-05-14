// src/Pages/Users/components/UserFormModal.tsx
import { Button, Form, Input, Modal, Select, Switch } from "antd";
import { useEffect } from "react";

const { Option } = Select;

interface UserFormModalProps {
  visible: boolean;
  initialValues?: Partial<User>;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading: boolean;
}

const UserFormModal = ({
  visible,
  initialValues,
  onCancel,
  onSubmit,
  loading,
}: UserFormModalProps) => {
  const [form] = Form.useForm();
  const isEditing = !!initialValues?.id;

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title={isEditing ? "Edit User" : "Add New User"}
      open={visible}
      onCancel={onCancel}
      footer={
        <div className="grid grid-cols-2 gap-3">
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>

          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          is_active: true,
          role: "user",
          ...initialValues,
        }}
      >
        {!isEditing && (
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input the username!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        )}

        <Form.Item
          label="First Name"
          name="first_name"
          rules={[
            {
              required: true,
              message: "Please input the first name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[
            {
              required: true,
              message: "Please input the last name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input a valid email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {!isEditing && (
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input the password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Role" name="role">
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Active Status"
            name="is_active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
