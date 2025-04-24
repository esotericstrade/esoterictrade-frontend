import { useAuthContext } from "@/Pages/Auth/context";
import {
  ChartBar,
  Cube,
  Gear,
  Headset,
  House,
  Lightning,
  SignOut,
  Smiley,
  Users,
  WaveTriangle,
} from "@phosphor-icons/react";
import { Avatar, Divider, Menu } from "antd";
import { useNavigate } from "react-router-dom";

const MENU_ITEMS = [
  {
    key: "dashboard",
    icon: House,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    key: "users",
    icon: Users,
    label: "Users",
    href: "/users",
  },
  {
    key: "strategies",
    icon: Lightning,
    label: "Strategies",
    href: "/strategies",
  },
  {
    key: "positions",
    icon: WaveTriangle,
    label: "Positions",
    href: "/positions",
  },
  {
    key: "orders",
    icon: Cube,
    label: "Orders",
    href: "/orders",
  },
  {
    key: "analytics",
    icon: ChartBar,
    label: "Analytics",
    href: "/analytics",
  },
] as const;

const Sidebar = () => {
  const navigate = useNavigate();
  const { onLogout } = useAuthContext();

  return (
    <aside className="w-[252px] bg-white px-4 py-5 overflow-hidden flex flex-col h-[calc(100vh-70px)]">
      <Menu
        items={MENU_ITEMS.map(({ key, icon: Icon, label, href }) => ({
          key,
          icon: <Icon size={24} />,
          label,
          onClick: () => navigate(href),
        }))}
      />
      <Divider className="my-3" />
      <Menu
        selectedKeys={[]}
        items={[
          {
            key: "community",
            icon: <Smiley size={24} />,
            label: "Community",
            onClick: () => navigate("/community"),
          },
          {
            key: "settings",
            icon: <Gear size={24} />,
            label: "Settings",
            onClick: () => navigate("/settings"),
          },
          {
            key: "help",
            icon: <Headset size={24} />,
            label: "Help & support",
            onClick: () => navigate("/help-and-support"),
          },
          {
            key: "logout",
            icon: <SignOut size={24} />,
            label: "Logout",
            onClick: onLogout,
            className:
              "!text-red-600 hover:!bg-red-100 [&.ant-menu-item-selected]:!bg-red-600",
          },
        ]}
      />

      <div className="mt-auto flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 overflow-hidden gap-2.5 px-5 py-3 rounded-2xl bg-[#f5f6f8] border border-[#e6e7ec]">
        <div className="flex justify-between items-center flex-grow-0 flex-shrink-0 w-[193px] relative">
          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-3">
            <Avatar
              className="flex-grow-0 flex-shrink-0"
              src="ellipse-12.png"
            />
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-0.5">
              <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-[#0a1b39]">
                Rahul Mash..
              </p>
              <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-[#83899f]">
                Admin
              </p>
            </div>
          </div>
          <svg
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-grow-0 flex-shrink-0 w-4 h-4 relative"
            preserveAspectRatio="none"
          >
            <path
              d="M7.98902 10.9993C7.75585 10.9998 7.52987 10.9184 7.35033 10.7693L2.36052 6.7693C2.15672 6.59956 2.02855 6.35565 2.00422 6.09122C1.97989 5.8268 2.06139 5.56352 2.23078 5.3593C2.40017 5.15508 2.64359 5.02666 2.90748 5.00228C3.17136 4.9779 3.43411 5.05956 3.63791 5.2293L7.98902 8.7093L12.3401 5.3893C12.4422 5.30623 12.5597 5.2442 12.6858 5.20677C12.8118 5.16934 12.9441 5.15724 13.0748 5.17118C13.2056 5.18512 13.3323 5.22482 13.4477 5.28799C13.5631 5.35117 13.6649 5.43657 13.7473 5.5393C13.8387 5.64212 13.9079 5.76275 13.9506 5.89362C13.9933 6.02449 14.0086 6.16279 13.9954 6.29986C13.9823 6.43692 13.9411 6.56979 13.8744 6.69015C13.8076 6.81051 13.7168 6.91575 13.6075 6.9993L8.61774 10.8293C8.43303 10.9548 8.21167 11.0147 7.98902 10.9993Z"
              fill="#262E3D"
            />
          </svg>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
