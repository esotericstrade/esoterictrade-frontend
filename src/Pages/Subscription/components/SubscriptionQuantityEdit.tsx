import useToaster from "@/components/toaster";
import { subscriptionService } from "@/utils/api/subscription/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InputNumber } from "antd";
import useApp from "antd/es/app/useApp";
import { useState } from "react";
const SubscriptionQuantityEdit = ({
  record,
  userId,
}: {
  record: Subscription;
  userId: string;
}) => {
  const [quantity, setQuantity] = useState<number>(record.quantity);
  const queryClient = useQueryClient();
  const toaster = useToaster();
  const { modal } = useApp();
  // Ensure userId is defined

  const subscriptionMutation = useMutation({
    mutationKey: ["updateSubscriptionQuantity"],
    mutationFn: (data: { id: number; quantity: number }) => {
      return subscriptionService.updateSubscription(data.id, {
        quantity: data.quantity,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["userSubscription", userId],
      });
      toaster.success(`Quantity updated to ${data.quantity}`);
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toaster.error(`Error updating quantity: ${errorMessage}`);
      // Reset to previous value on error
      setQuantity(record.quantity);
    },
  });

  const handleQuantityChange = (value: number | null) => {
    if (value === null) return;
    setQuantity(value);
  };

  const handleSubmit: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity === null || quantity === record.quantity) return;

    modal.confirm({
      title: "Confirm Quantity Change",
      content: (
        <div>
          <p>Are you sure you want to update the subscription quantity?</p>
          <p>
            <strong>Instrument:</strong> {record.actor.instrument_name}
          </p>
          <p>
            <strong>Current Quantity:</strong> {record.quantity}
          </p>
          <p>
            <strong>New Quantity:</strong> {quantity}
          </p>
        </div>
      ),
      onOk: () => {
        subscriptionMutation.mutate({
          id: record.id,
          quantity: quantity,
        });
      },
      onCancel: () => {
        setQuantity(record.quantity);
      },
      okButtonProps: {
        autoFocus: true,
      },
    });
  };

  return (
    <div className="flex items-center">
      <InputNumber
        size="small"
        min={1}
        value={quantity}
        onChange={handleQuantityChange}
        onPressEnter={handleSubmit}
        disabled={subscriptionMutation.isPending}
        style={{ width: "100px" }}
      />
      {subscriptionMutation.isPending && (
        <div className="ml-2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionQuantityEdit;
