import useToaster from "@/components/toaster";
import { subscriptionService } from "@/utils/api/subscription/service";
import { KeyReturn, Spinner } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InputNumber, Tooltip } from "antd";
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
          <div className="grid grid-cols-[auto_1fr] gap-y-0.5 mt-2 gap-x-2">
            <>
              <span className="text-gray-400">Instrument:</span>
              <span className="font-medium">
                {record.actor.instrument_name}
              </span>
            </>

            <>
              <span className="text-gray-400">Current Quantity:</span>
              <span className="font-medium">{record.quantity}</span>
            </>
            <>
              <span className="text-gray-400">New Quantity:</span>
              <span className="font-medium">{quantity}</span>
            </>
          </div>
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
      />
      <div className="w-5 flex items-center justify-center ms-2">
        {subscriptionMutation.isPending ? (
          <Spinner className="animate-spin" size={16} />
        ) : (
          quantity !== record.quantity && (
            <Tooltip title="Press Enter to save changes">
              <KeyReturn className="text-gray-400" size={16} weight="bold" />
            </Tooltip>
          )
        )}
      </div>
    </div>
  );
};

export default SubscriptionQuantityEdit;
