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
    onError: () => {
      toaster.error("Error updating quantity");
      // Reset to previous value on error
      setQuantity(record.quantity);
    },
  });

  const handleQuantityChange = (value: number | null) => {
    if (value === null) return;
    setQuantity(value);
  };

  const handleSubmit = () => {
    if (quantity === null || quantity === record.quantity) return;

    modal.confirm({
      title: "Confirm Update",
      content: `Are you sure you want to update the quantity from ${record.quantity} to ${quantity}?`,
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
    <InputNumber
      size="small"
      min={1}
      value={quantity}
      onChange={handleQuantityChange}
      onPressEnter={handleSubmit}
      disabled={subscriptionMutation.isPending}
      style={{ width: "100px" }}
    />
  );
};

export default SubscriptionQuantityEdit;
