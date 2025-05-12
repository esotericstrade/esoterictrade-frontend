import { subscriptionService } from "@/utils/api/subscription/service";
import { useQuery } from "@tanstack/react-query";
import { Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useParams } from "react-router-dom";
import SubscriptionQuantityEdit from "./SubscriptionQuantityEdit";
import SubscriptionStatusToggle from "./SubscriptionStatusToggle";

const UserSubscription = () => {
  const { userId } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: ["userSubscription", userId],
    enabled: !!userId,
    initialData: {
      active: 0,
      subscriptions: [],
      total: 0,
    },
    queryFn: ({ queryKey }) => {
      const [, userId] = queryKey;
      if (!userId) {
        throw new Error("User ID is required");
      }
      return subscriptionService.getUserSubscriptions(userId);
    },
    select: (data) => {
      return {
        ...data,
        subscriptions: data.subscriptions.sort((a, b) => {
          const nameA = a.actor.instrument_name.toLowerCase();
          const nameB = b.actor.instrument_name.toLowerCase();
          return nameA.localeCompare(nameB);
        }),
      };
    },
  });

  const columns: ColumnsType<Subscription> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Instrument Name",
      render: (_, record) => {
        return record.actor.instrument_name;
      },
    },
    {
      title: "Strategy Name",
      render: (_, record) => {
        return record.actor.name;
      },
    },
    {
      title: "Parameters",
      render: (_, record) => {
        return (
          <div>
            <Tag color="red">SL:{record.actor.parameters.stoploss}</Tag>
            {record.actor.parameters.ltp && (
              <Tag color="amber">LTP: {record.actor.parameters.ltp}</Tag>
            )}
            <Tag color="green">Target: {record.actor.parameters.target}</Tag>
          </div>
        );
      },
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (record) => (
        <SubscriptionQuantityEdit record={record} userId={userId as string} />
      ),
    },
    {
      title: "Active",
      key: "active",
      render: (record) => (
        <SubscriptionStatusToggle record={record} userId={userId as string} />
      ),
    },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Subscriptions</h2>
        <div className="flex gap-2 h-fit">
          <Tag color="green">
            Active: {data.active} out of {data.total}
          </Tag>
        </div>
      </div>

      <Table
        loading={isFetching}
        dataSource={data.subscriptions}
        columns={columns}
        pagination={false}
        rowKey="id"
        scroll={{ x: true }}
      />
    </section>
  );
};

export default UserSubscription;
