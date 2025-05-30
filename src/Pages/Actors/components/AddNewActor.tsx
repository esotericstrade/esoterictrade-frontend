import useToaster from "@/components/toaster";
import { actorService } from "@/utils/api/actor/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { useState } from "react";
const AddNewActorModal: React.FC<{
  children: ({
    open,
    setOpen,
  }: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}> = ({ children }) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const toast = useToaster();
  const [form] = Form.useForm();

  const createActorMutation = useMutation({
    mutationFn: (data: CreateActorRequest) => {
      return actorService.createActor(data);
    },
    onSuccess: () => {
      toast.success("Actor created successfully");
      queryClient.invalidateQueries({
        queryKey: ["actors"],
      });
      setOpen(false);
    },
  });

  const handleFormSubmit = async (values: CreateActorRequest) => {
    try {
      await createActorMutation.mutateAsync(values);
      form.resetFields();
    } catch (error) {
      toast.error("Failed to create actor", {
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
          <Form<CreateActorRequest>
            form={form}
            onFinish={handleFormSubmit}
            layout="vertical"
            className="grid grid-cols-1 gap-3"
          >
            <Form.Item
              label="Strategy"
              name="strategy_id"
              initialValue={1}
              required
              rules={[{ required: true, message: "Please input strategy!" }]}
            >
              <Select
                placeholder="Select strategy"
                options={[
                  { label: "ema-sma-slope-futures-strategy	", value: 1 },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Actor Name"
              name="name"
              required
              rules={[{ required: true, message: "Please input actor name!" }]}
            >
              <Input placeholder="Enter actor name" />
            </Form.Item>

            <Form.Item
              label="Instrument"
              name="instrument_name"
              required
              rules={[{ required: true, message: "Please input instrument!" }]}
            >
              <Input placeholder="Enter instrument name" />
            </Form.Item>

            <div className="grid grid-cols-3 gap-3">
              <Form.Item
                label="Stoploss"
                name={["parameters", "stoploss"]}
                rules={[{ required: true, message: "Please input stoploss!" }]}
                required
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  className="w-full"
                  placeholder="Enter stoploss"
                />
              </Form.Item>
              <Form.Item label="LTP" name={["parameters", "ltp"]}>
                <InputNumber
                  min={0}
                  step={0.1}
                  className="w-full"
                  placeholder="Enter LTP"
                />
              </Form.Item>
              <Form.Item
                label="Target"
                name={["parameters", "target"]}
                rules={[{ required: true, message: "Please input target!" }]}
                required
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  className="w-full"
                  placeholder="Enter target"
                />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default AddNewActorModal;
