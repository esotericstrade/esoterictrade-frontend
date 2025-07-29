import useToaster from "@/components/toaster";
import { actorService } from "@/utils/api/actor/service";
import { adminService } from "@/utils/api/admin/service";
import { subscriptionService } from "@/utils/api/subscription/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Form, InputNumber, Modal, Select } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useParams } from "react-router-dom";
const PAGE_LIMIT = 100;

const AddNewSubscription: React.FC<{
  children: ({
    open,
    setOpen,
  }: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}> = ({ children }) => {
  const queryClient = useQueryClient();

  const { userId } = useParams();

  const [open, setOpen] = useState(false);
  const toast = useToaster();
  const [form] = Form.useForm();

  const {
    data: { data: actors },
    isFetching,
  } = useQuery({
    queryKey: ["actors"],
    queryFn: () =>
      actorService.getAllActors({
        page: 1,
        size: PAGE_LIMIT,
      }),
    initialData: {
      pagination: {
        pages: 0,
        total: 0,
        page: 1,
        size: PAGE_LIMIT,
      },
      data: [],
    },
  });

  const {
    data: { data: users },
    isFetching: isUsersLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      adminService.getAllUsers({
        page: 1,
        limit: PAGE_LIMIT,
        searchQuery: "",
      }),
    initialData: {
      pagination: {
        pages: 0,
        total: 0,
        page: 1,
        size: PAGE_LIMIT,
      },
      data: [],
    },
  });

  const createNewSubscriptionMutation = useMutation({
    mutationFn: (data: CreateSubscriptionRequest) => {
      return subscriptionService.createSubscription(data);
    },
    onSuccess: () => {
      toast.success("Subscription created successfully");
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", userId],
      });
      setOpen(false);
    },
  });

  const handleFormSubmit = async (values: CreateSubscriptionRequest) => {
    try {
      await createNewSubscriptionMutation.mutateAsync(values);
      form.resetFields();
    } catch (error) {
      toast.error("Failed to create subscription", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <>
      {children({ open, setOpen })}

      {open && (
        <Modal
          title="Add New Actor"
          open={open}
          onCancel={() => setOpen(false)}
          footer={
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="default"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={form.submit}>
                Create
              </Button>
            </div>
          }
          width={600}
        >
          <Form<CreateSubscriptionRequest>
            form={form}
            onFinish={handleFormSubmit}
            layout="vertical"
            className="grid grid-cols-1 gap-3"
          >
            <Form.Item
              label="Actor"
              name="actor_id"
              required
              rules={[{ required: true, message: "Please input strategy!" }]}
            >
              <Select
                loading={isFetching}
                showSearch
                filterOption={(input, option) =>
                  (option?.["data-search"] ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                placeholder="Search instrument from actors"
                options={actors.map((actor) => ({
                  label: actor.instrument_name,
                  value: actor.id,
                  "data-search": actor.instrument_name + "_" + actor.name,
                }))}
              />
            </Form.Item>
            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                label="Quantity"
                initialValue={1}
                name="quantity"
                required
                rules={[{ required: true, message: "Please input quantity!" }]}
              >
                <InputNumber
                  className="w-full"
                  min={1}
                  placeholder="Enter quantity"
                />
              </Form.Item>

              <Form.Item
                label="User"
                name="user_id"
                initialValue={userId ? +userId : undefined}
                required
                rules={[{ required: true, message: "Please input user ID!" }]}
              >
                <Select
                  loading={isUsersLoading}
                  showSearch
                  placeholder="Search user"
                  options={users.map((user) => ({
                    label: user.first_name + " " + user.last_name,
                    value: user.id,
                  }))}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Form.Item label="Start Date" name="start_date">
                <DatePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  placeholder="Select start date"
                  style={{ width: "100%" }}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf("day");
                  }}
                />
              </Form.Item>
              <Form.Item label="End Date" name="end_date">
                <DatePicker
                  className="w-full"
                  format="YYYY-MM-DD"
                  placeholder="Select end date"
                  style={{ width: "100%" }}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf("day");
                  }}
                />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default AddNewSubscription;
