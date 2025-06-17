import { dashboardService } from "@/utils/api/dashboard/service";
import {
  Bank,
  Cards,
  ChartLineUp,
  Lightning,
  ListBullets,
  Users,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: () => dashboardService.getDashboardSummary(),
    initialData: {
      users: {
        entity_type: "user",
        total_count: 0,
        active_count: 0,
        admin_count: 0,
      },
      brokerAccounts: {
        entity_type: "broker_account",
        total_count: 0,
        active_count: 0,
        is_admin_view: false,
      },
      subscriptions: {
        entity_type: "subscription",
        total_count: 0,
        active_count: 0,
        is_admin_view: false,
      },
      actors: {
        entity_type: "actor",
        total_count: 0,
        strategy_count: 0,
        is_admin_view: false,
      },
      strategies: {
        entity_type: "strategy",
        total_count: 0,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Spin size="large" tip="Loading dashboard data..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-3 gap-6"
      >
        {/* User Stats Card */}
        <motion.div
          variants={itemVariants}
          transition={{
            ease: [0.6, 0.05, -0.01, 0.9],
          }}
          whileHover={{
            y: -10,
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            transition: {
              duration: 0.15,
              ease: [0.6, 0.05, -0.01, 0.9],
            },
          }}
          onClick={() => navigate("/users")}
          className="bg-white rounded-2xl shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-4 relative cursor-pointer"
        >
          <div className="rounded-3xl bg-indigo-400/40 absolute right-6 top-6 size-14 grid place-items-center ">
            <Users size={32} className="text-indigo-800" weight="duotone" />
          </div>
          <h3 className="justify-start text-neutral-800/70 text-base font-medium">
            Users
          </h3>
          <span className="justify-start text-neutral-800 text-3xl font-bold flex items-center gap-0.5 tracking-wider">
            {new Intl.NumberFormat("en-IN", {
              notation: "compact",
              compactDisplay: "short",
            }).format(data.users.active_count)}
            <span className="text-neutral-400 flex items-center gap-0.5">
              <span>/</span>
              {new Intl.NumberFormat("en-IN", {
                notation: "compact",
                compactDisplay: "short",
              }).format(data.users.total_count)}
            </span>
          </span>
          <p className="truncate flex items-center gap-1">
            <ChartLineUp size={20} className="text-emerald-500" />
            <span className="text-neutral-500 text-sm">
              <span className="text-emerald-500">8.5%</span>&nbsp; from last
              month
            </span>
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          transition={{
            ease: [0.6, 0.05, -0.01, 0.9],
          }}
          whileHover={{
            y: -10,
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            transition: {
              duration: 0.15,
              ease: [0.6, 0.05, -0.01, 0.9],
            },
          }}
          onClick={() => navigate("/brokers")}
          className="bg-white rounded-2xl shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-4 relative cursor-pointer"
        >
          <div className="rounded-3xl bg-amber-400/40 absolute right-6 top-6 size-14 grid place-items-center ">
            <Bank size={32} className="text-amber-800" weight="duotone" />
          </div>
          <h3 className="justify-start text-neutral-800/70 text-base font-medium">
            Broker Accounts
          </h3>
          <span className="justify-start text-neutral-800 text-3xl font-bold flex items-center gap-0.5 tracking-wider">
            {new Intl.NumberFormat("en-IN", {
              notation: "compact",
              compactDisplay: "short",
            }).format(data.brokerAccounts.active_count)}
            <span className="text-neutral-400 flex items-center gap-0.5">
              <span>/</span>
              {new Intl.NumberFormat("en-IN", {
                notation: "compact",
                compactDisplay: "short",
              }).format(data.brokerAccounts.total_count)}
            </span>
          </span>
          <p className="truncate flex items-center gap-1">
            <ChartLineUp size={20} className="text-emerald-500" />
            <span className="text-neutral-500 text-sm">
              <span className="text-emerald-500">5.5%</span>&nbsp; from last
              month
            </span>
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          transition={{
            ease: [0.6, 0.05, -0.01, 0.9],
          }}
          whileHover={{
            y: -10,
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            transition: {
              duration: 0.15,
              ease: [0.6, 0.05, -0.01, 0.9],
            },
          }}
          onClick={() => navigate("/subscription")}
          className="bg-white rounded-2xl shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-4 relative overflow-hidden cursor-pointer"
        >
          <div className="rounded-3xl bg-rose-400/40 absolute right-6 top-6 size-14 grid place-items-center ">
            <ListBullets size={32} className="text-rose-800" weight="duotone" />
          </div>
          <h3 className="justify-start text-neutral-800/70 text-base font-medium">
            Subscriptions
          </h3>
          <span className="justify-start text-neutral-800 text-3xl font-bold flex items-center gap-0.5 tracking-wider">
            {new Intl.NumberFormat("en-IN", {
              notation: "compact",
              compactDisplay: "short",
            }).format(data.subscriptions.active_count)}
            <span className="text-neutral-400 flex items-center gap-0.5">
              <span>/</span>
              {new Intl.NumberFormat("en-IN", {
                notation: "compact",
                compactDisplay: "short",
              }).format(data.subscriptions.total_count)}
            </span>
          </span>
          <p className="truncate flex items-center gap-1">
            <ChartLineUp size={20} className="text-emerald-500" />
            <span className="text-neutral-500 text-sm">
              <span className="text-emerald-500">10.2%</span>&nbsp; from last
              month
            </span>
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          transition={{
            ease: [0.6, 0.05, -0.01, 0.9],
          }}
          whileHover={{
            y: -10,
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            transition: {
              duration: 0.15,
              ease: [0.6, 0.05, -0.01, 0.9],
            },
          }}
          onClick={() => navigate("/actors")}
          className="bg-white rounded-2xl shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-4 relative cursor-pointer"
        >
          <div className="rounded-3xl bg-orange-400/40 absolute right-6 top-6 size-14 grid place-items-center ">
            <Lightning size={32} className="text-orange-800" weight="duotone" />
          </div>
          <h3 className="justify-start text-neutral-800/70 text-base font-medium">
            Actors
          </h3>
          <span className="justify-start text-neutral-800 text-3xl font-bold flex items-center gap-0.5 tracking-wider">
            {new Intl.NumberFormat("en-IN", {
              notation: "compact",
              compactDisplay: "short",
            }).format(data.actors.total_count)}
          </span>
          <p className="truncate flex items-center gap-1">
            <ChartLineUp size={20} className="text-emerald-500" />
            <span className="text-neutral-500 text-sm">
              <span className="text-emerald-500">6.2%</span>&nbsp; from last
              month
            </span>
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          transition={{
            ease: [0.6, 0.05, -0.01, 0.9],
          }}
          whileHover={{
            y: -10,
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            transition: {
              duration: 0.15,
              ease: [0.6, 0.05, -0.01, 0.9],
            },
          }}
          onClick={() => navigate("/strategies")}
          className="bg-white rounded-2xl shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-6 flex flex-col gap-4 relative cursor-pointer"
        >
          <div className="rounded-3xl bg-green-400/40 absolute right-6 top-6 size-14 grid place-items-center ">
            <Cards size={32} className="text-green-800" weight="duotone" />
          </div>
          <h3 className="justify-start text-neutral-800/70 text-base font-medium">
            Strategies
          </h3>
          <span className="justify-start text-neutral-800 text-3xl font-bold flex items-center gap-0.5 tracking-wider">
            {new Intl.NumberFormat("en-IN", {
              notation: "compact",
              compactDisplay: "short",
            }).format(data.strategies.total_count)}
          </span>
          <p className="truncate flex items-center gap-1">
            <ChartLineUp size={20} className="text-emerald-500" />
            <span className="text-neutral-500 text-sm">
              <span className="text-emerald-500">6.2%</span>&nbsp; from last
              month
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
