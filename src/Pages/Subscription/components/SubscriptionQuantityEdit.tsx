// filepath: /Users/girishsawant/Desktop/Projects/tradeco/src/Pages/Subscription/components/SubscriptionQuantityEdit.tsx
import toaster from "@/components/toaster";
import { subscriptionService } from "@/utils/api/subscription/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InputNumber } from "antd";
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
      console.log("Subscription quantity updated successfully", data);
      toaster.success("Quantity updated successfully");
    },
    onError: (error) => {
      console.error("Error updating subscription quantity", error);
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

    subscriptionMutation.mutate({
      id: record.id,
      quantity: quantity,
    });
  };

  return (
    <InputNumber
      min={1}
      value={quantity}
      onChange={handleQuantityChange}
      onPressEnter={handleSubmit}
      onBlur={handleSubmit}
      disabled={subscriptionMutation.isPending}
      style={{ width: "100px" }}
    />
  );
};

export default SubscriptionQuantityEdit;
