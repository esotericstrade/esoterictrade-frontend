import { Form, Input, Button, Typography, Checkbox } from "antd";

const { Title, Text, Link } = Typography;
const SignUp = () => {
  return (
    <div className="min-h-screen flex">
      <div className=" md:flex flex-col justify-center items-center px-12 w-[60%] text-white">
        <div>
          <h1 className="text-2xl font-light  mb-20  tracking-widest">
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
        <div className="w-full max-w-md ">
          <Title level={3} className="text-center">
            Create an account
          </Title>
          <Text className="block text-center mb-6 text-gray-600">
            Have an account ?<Link href="#">Log in</Link>
          </Text>

          <Form layout="vertical">
            <Form.Item
              label="Email address "
              name="email"
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

            <Form.Item
              label="Confirm Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item
              name="consent"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("You must accept to receive messages")
                        ),
                },
              ]}
            >
              <Checkbox>
                I am also consenting to receive SMS messages & emails, including
                product new feature updates, and marketing promotions.
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full rounded-full  text-white "
                size="large"
              >
                Sign up
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
