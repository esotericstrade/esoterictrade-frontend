import toaster from "@/components/toaster";
import { authService } from "@/utils/api/auth/service";
import { AppleOutlined, GoogleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Form, Input, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context";

const { Title, Text, Link } = Typography;
const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthContext();

  const onFinish = async (values: {
    username_or_email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const response = await authService.login({
        username_or_email: values.username_or_email,
        password: values.password,
      });

      setUser(response.user);

      toaster.success("Login successful!");
      navigate("/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message || "Login failed!";
      toaster.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="md:flex flex-col justify-center items-center px-12 w-[60%] text-white">
        <div>
          <h1 className="text-2xl font-light mb-20 tracking-widest">
            EsotericTrade
          </h1>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#b7a5f4]">
              Your Gateway to <br /> Smarter Investments
            </h2>
            <p className="text-gray-400 text-sm max-w-md">
              Simplifying complex trades with <br />
              advanced tools and insights
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white px-8 py-12">
        <div className="w-full max-w-md">
          <Title level={3} className="text-center">
            Log in
          </Title>
          <Text className="block text-center mb-6 text-gray-600">
            Don't have an account? <Link href="/auth/signup">Sign up</Link>
          </Text>

          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              username_or_email: "admin",
              password: "Passw0rd.",
            }}
          >
            <Form.Item
              label="Email address or user name"
              name="username_or_email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email or username",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <div className="flex justify-between items-center mb-4">
              <Checkbox>Remember me</Checkbox>
              <Link href="/auth/forgot-password">Forget your password</Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>

            <Divider plain>Or continue with</Divider>

            <Button icon={<GoogleOutlined />} className="mb-3" block>
              Continue with Google
            </Button>

            <Button icon={<AppleOutlined />} block>
              Continue with Apple
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
