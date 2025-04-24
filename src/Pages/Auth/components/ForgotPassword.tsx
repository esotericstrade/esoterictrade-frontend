import { Form, Input, Button, Typography} from "antd";
import { EyeInvisibleOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg ">
        <div className="p-10"
          style={{
            padding: "18px",
          }}
        >
          <Title level={4} className="text-center mb-4">
            Reset Password
          </Title>

          <Form layout="vertical">
            <Form.Item label="Current Password" name="currentPassword">
              <Input.Password
                placeholder="Enter current password"
                iconRender={() => <EyeInvisibleOutlined />}
              />
            </Form.Item>

            <Form.Item label="New Password" name="newPassword">
              <Input.Password
                placeholder="Enter new password"
                iconRender={() => <EyeInvisibleOutlined />}
              />
            </Form.Item>

            <Form.Item label="Confirm New Password" name="confirmPassword">
              <Input.Password
                placeholder="Confirm new password"
                iconRender={() => <EyeInvisibleOutlined />}
              />
            </Form.Item>

            <Paragraph className="text-sm text-gray-500 mt-2 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
              lobortis maximus.
            </Paragraph>

            <Form.Item className="mt-6">
              <Button
                type="primary"
                htmlType="submit"
                block
                className="bg-[#6949fd] rounded-full h-11 font-medium hover:bg-[#5a3fe6]"
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;