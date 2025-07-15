import { adminService } from "@/utils/api/admin/service";
import { userAdminBrokerService } from "@/utils/api/broker/service";
import { useQuery } from "@tanstack/react-query";
import { Tag } from "antd";
import { useParams } from "react-router-dom";
import UserPositionTable from "./PositionTable";

const UserPosition = () => {
  const { userId, userName } = useParams();

  const { data: user } = useQuery({
    queryKey: ["user", userName],
    queryFn: () => {
      if (!userName) {
        throw new Error("User name is required");
      }
      return adminService.getUserByUsername(userName);
    },
  });

  const { data: positions, isFetching: isPositionsFetching } = useQuery({
    queryKey: ["userPosition", userId],
    enabled: !!userId,
    initialData: [],
    queryFn: () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return userAdminBrokerService.getUserPositionsById(Number(userId));
    },
  });

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold font-poppins">
            Positions
            {user ? ` of ${user.first_name} ${user.last_name}` : ""}
          </h2>

          <div className="flex items-center gap-2">
            <Tag color="green">
              {positions ? positions.length : 0} Positions
            </Tag>
          </div>
        </div>
      </div>
      <UserPositionTable
        positions={positions}
        loading={isPositionsFetching}
        pagination={false}
      />
    </section>
  );
};

export default UserPosition;
