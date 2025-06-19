import useToaster from "@/components/toaster";
import { actorService } from "@/utils/api/actor/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, InputNumber, Modal } from "antd";
import { useEffect } from "react";

interface UpdateActorModalProps {
  actor: Actor | null;
  open: boolean;
  onClose: () => void;
}

const UpdateActorModal: React.FC<UpdateActorModalProps> = ({
  actor,
  open,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const toast = useToaster();
  const [form] = Form.useForm();

  useEffect(() => {
    if (actor && open) {
      form.setFieldsValue({
        parameters: {
          stoploss: actor.parameters.stoploss,
          target: actor.parameters.target,
          ltp: actor.parameters.ltp,
          tick_size: actor.parameters.tick_size,
        },
      });
    }
  }, [actor, open, form]);

  const updateActorMutation = useMutation({
    mutationFn: (data: UpdateActorRequest) => {
      if (!actor) throw new Error("No actor selected");
      return actorService.updateActor(actor.id, data);
    },
    onSuccess: () => {
      toast.success("Actor updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["actors"],
      });
      onClose();
    },
  });

  const handleFormSubmit = async (values: { parameters: ActorParameters }) => {
    try {
      await updateActorMutation.mutateAsync({
        parameters: {
          stoploss: values.parameters.stoploss,
          target: values.parameters.target,
          ltp: actor?.parameters.ltp || "",
          tick_size: values.parameters.tick_size || "",
        },
      });
      form.resetFields();
    } catch (error) {
      toast.error("Failed to update actor", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <Modal
      title={`Update Actor: ${actor?.instrument_name}`}
      open={open}
      afterOpenChange={(visible) => {
        if (visible) {
          form.focusField("parameters.stoploss");
        }
      }}
      onCancel={onClose}
      footer={
        <div className="grid grid-cols-2 gap-3">
          <Button type="default" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={form.submit}
            loading={updateActorMutation.isPending}
          >
            Update
          </Button>
        </div>
      }
      width={440}
    >
      <Form
        form={form}
        onFinish={handleFormSubmit}
        layout="vertical"
        className="grid grid-cols-1 gap-3"
      >
        <div className="grid grid-cols-2 gap-1 gap-x-3">
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
          <Form.Item
            label="Tick Size"
            name={["parameters", "tick_size"]}
            rules={[{ required: true, message: "Please input Tick Size!" }]}
            required
          >
            <InputNumber
              min={0}
              step={0.1}
              className="w-full"
              placeholder="Enter Tick Size"
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateActorModal;
