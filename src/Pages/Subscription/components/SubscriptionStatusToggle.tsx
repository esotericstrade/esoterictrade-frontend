import useToaster from "@/components/toaster";
import { subscriptionService } from "@/utils/api/subscription/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch } from "antd";
import useApp from "antd/es/app/useApp";
const SubscriptionStatusToggle = ({
  record,
  userId,
}: {
  record: Subscription;
  userId: string;
}) => {
  const queryClient = useQueryClient();
  const toaster = useToaster();
  const { modal } = useApp();

  const subscriptionMutation = useMutation({
    mutationKey: ["toggleSubscription"],
    mutationFn: (data: { id: number; is_active: boolean }) => {
      return subscriptionService.updateSubscription(data.id, {
        is_active: data.is_active,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["userSubscription", userId],
      });
      toaster.success(
        `Subscription ${data.is_active ? "activated" : "deactivated"}`
      );
    },
    onError: () => {
      toaster.error("Error updating subscription");
    },
  });

  const handleToggle = (checked: boolean) => {
    modal.confirm({
      title: "Confirm Update",
      content: `Are you sure you want to ${
        checked ? "activate" : "deactivate"
      } this subscription?`,
      onOk: () => {
        subscriptionMutation.mutate({
          id: record.id,
          is_active: checked,
        });
      },
      okButtonProps: {
        autoFocus: true,
      },
    });
  };

  return (
    <Switch
      size="small"
      checked={record.is_active}
      loading={subscriptionMutation.isPending}
      onChange={handleToggle}
    />
  );
};

export default SubscriptionStatusToggle;
