import useToaster from "@/components/toaster";
import { subscriptionService } from "@/utils/api/subscription/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch } from "antd";
const SubscriptionStatusToggle = ({
  record,
  userId,
}: {
  record: Subscription;
  userId: string;
}) => {
  const queryClient = useQueryClient();
  const toaster = useToaster();

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

  return (
    <Switch
      size="small"
      checked={record.is_active}
      loading={subscriptionMutation.isPending}
      onChange={(checked) =>
        subscriptionMutation.mutate({
          id: record.id,
          is_active: checked,
        })
      }
    />
  );
};

export default SubscriptionStatusToggle;
