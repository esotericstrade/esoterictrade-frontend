// src/Pages/Brokers/components/BrokerFormModal.tsx
import { Button, Form, Input, Modal, Select, Switch } from "antd";
import { useEffect } from "react";

const { Option } = Select;
const { TextArea } = Input;

interface BrokerFormModalProps {
  visible: boolean;
  initialValues?: Partial<BrokerAccount>;
  onCancel: () => void;
  onSubmit: (values: any) => void; // Using any to match the exact API structure
  loading: boolean;
}

const BrokerFormModal = ({
  visible,
  initialValues,
  onCancel,
  onSubmit,
  loading,
}: BrokerFormModalProps) => {
  const [form] = Form.useForm();
  const isEditing = !!initialValues?.id;

  useEffect(() => {
    if (visible && initialValues) {
     
      
      // Only populate non-encrypted/available values
      const flattenedValues = {
        broker_type: initialValues.broker_type || "kite",
        account_number: initialValues.account_number || "",
        account_nickname: initialValues.metadata?.account_nickname || "",
        description: initialValues.metadata?.description || initialValues.metadata?.descritpion || "", // Handle both spellings
        is_autologin: initialValues.metadata?.is_autologin === "True",
        // Don't populate encrypted/sensitive fields - leave them empty for user to re-enter
        api_key: "",
        api_secret: "",
        password: "",
        mfa_secret: "",
      };
      
      form.setFieldsValue(flattenedValues);
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (isEditing) {
        // Update payload structure - only include fields that have values
        const updatePayload: any = {
          account_number: values.account_number,
          metadata: {
            descritpion: values.description || "", // Using the API's spelling
            is_autologin: values.is_autologin ? "True" : "False",
            account_nickname: values.account_nickname,
          }
        };

        // Only include API credentials if provided (not empty)
        if (values.api_key && values.api_key.trim()) {
          updatePayload.api_key = values.api_key;
        }
        if (values.api_secret && values.api_secret.trim()) {
          updatePayload.api_secret = values.api_secret;
        }

        // Only include login credentials if provided (not empty)
        if (values.password && values.password.trim() || values.mfa_secret && values.mfa_secret.trim()) {
          updatePayload.metadata.tokens = {};
          if (values.password && values.password.trim()) {
            updatePayload.metadata.tokens.password = values.password;
          }
          if (values.mfa_secret && values.mfa_secret.trim()) {
            updatePayload.metadata.tokens.mfa_secret = values.mfa_secret;
          }
        }

        onSubmit(updatePayload);
      } else {
        // Create payload structure (matches your Postman example)
        const createPayload = {
          broker_type: values.broker_type,
          account_number: values.account_number,
          api_key: values.api_key,
          api_secret: values.api_secret,
          metadata: {
            descritpion: values.description || "", // Using the API's spelling
            is_autologin: values.is_autologin ? "True" : "False",
            account_nickname: values.account_nickname,
            tokens: {
              password: values.password,
              mfa_secret: values.mfa_secret
            }
          }
        };
        onSubmit(createPayload);
      }
    });
  };

  return (
    <Modal
      title={isEditing ? "Edit Broker Account" : "Add New Broker Account"}
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={
        <div className="flex justify-end gap-3">
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            {isEditing ? "Update Broker" : "Create Broker"}
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          broker_type: "kite",
          is_autologin: true,
        }}
      >
        {/* Broker Type - Only show in create mode */}
        {!isEditing && (
          <Form.Item
            label="Broker Type"
            name="broker_type"
            rules={[
              {
                required: true,
                message: "Please select the broker type!",
              },
            ]}
          >
            <Select placeholder="Select broker type">
              <Option value="kite">Kite</Option>
              <Option value="upstox">Upstox</Option>
              <Option value="angelone">Angel One</Option>
            </Select>
          </Form.Item>
        )}

        {/* Account Number */}
        <Form.Item
          label="Account Number"
          name="account_number"
          rules={[
            {
              required: true,
              message: "Please input the account number!",
            },
          ]}
        >
          <Input placeholder="Enter your broker account number" />
        </Form.Item>

        {/* Account Nickname */}
        <Form.Item
          label="Account Nickname"
          name="account_nickname"
          rules={[
            {
              required: true,
              message: "Please input the account nickname!",
            },
          ]}
        >
          <Input placeholder="e.g., John's Personal Trading Account" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
        >
          <TextArea 
            rows={2} 
            placeholder="Optional description for this broker account"
          />
        </Form.Item>

        {/* API Credentials Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium mb-3 text-gray-700">API Credentials</h4>
          
          <Form.Item
            label="API Key"
            name="api_key"
            rules={[
              {
                required: !isEditing, // Only required for create, optional for edit
                message: "Please input the API key!",
              },
            ]}
          >
            <Input placeholder={isEditing ? "Leave empty to keep existing API key" : "Enter your broker API key"} />
          </Form.Item>

          <Form.Item
            label="API Secret"
            name="api_secret"
            rules={[
              {
                required: !isEditing, // Only required for create, optional for edit
                message: "Please input the API secret!",
              },
            ]}
          >
            <Input.Password placeholder={isEditing ? "Leave empty to keep existing API secret" : "Enter your broker API secret"} />
          </Form.Item>
        </div>

        {/* Login Credentials Section */}
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium mb-3 text-blue-700">Login Credentials</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Login Password"
              name="password"
              rules={[
                {
                  required: !isEditing, // Only required for create, optional for edit
                  message: "Please input the login password!",
                },
              ]}
            >
              <Input.Password placeholder={isEditing ? "Leave empty to keep existing password" : "Broker login password"} />
            </Form.Item>

            <Form.Item
              label="MFA Secret/TOTP"
              name="mfa_secret"
              rules={[
                {
                  required: !isEditing, // Only required for create, optional for edit
                  message: "Please input the MFA secret!",
                },
              ]}
            >
              <Input.Password placeholder={isEditing ? "Leave empty to keep existing MFA secret" : "TOTP/MFA secret key"} />
            </Form.Item>
          </div>
        </div>

        {/* Auto Login Setting */}
        <Form.Item
          label="Auto Login"
          name="is_autologin"
          valuePropName="checked"
          tooltip="Enable automatic login using stored credentials"
        >
          <Switch />
        </Form.Item>

        {/* Security Notice */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Security Notice:</strong> Your credentials are encrypted and stored securely. 
                {isEditing ? " Leave sensitive fields empty to keep existing encrypted values." : " All fields are required for new broker accounts."}
              </p>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default BrokerFormModal;