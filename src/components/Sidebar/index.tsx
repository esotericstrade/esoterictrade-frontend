import { useAuthContext } from "@/Pages/Auth/context";
import {
  CaretDown,
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
    key: "actors",
    icon: Lightning,
    label: "Actors",
    href: "/strategies",
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
  const { onLogout, user } = useAuthContext();

  return (
    <aside className="w-[220px] bg-white px-4 py-5 overflow-y-auto flex flex-col h-[calc(100vh-70px)]">
      <Menu
        items={MENU_ITEMS.map(({ key, icon: Icon, label, href }) => ({
          key,
          icon: <Icon size={16} weight="fill" />,
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
            icon: <Smiley size={16} weight="fill" />,
            label: "Community",
            onClick: () => navigate("/community"),
          },
          {
            key: "settings",
            icon: <Gear size={16} weight="fill" />,
            label: "Settings",
            onClick: () => navigate("/settings"),
          },
          {
            key: "help",
            icon: <Headset size={16} weight="fill" />,
            label: "Help & support",
            onClick: () => navigate("/help-and-support"),
          },
          {
            key: "logout",
            icon: <SignOut size={16} weight="fill" className="!fill-red-500" />,
            label: "Logout",
            onClick: onLogout,
            className:
              "!text-red-600 hover:!bg-red-100 [&.ant-menu-item-selected]:!bg-red-600",
          },
        ]}
      />

      <div className="grid grid-cols-[auto_1fr_auto] px-1.5 py-1.5 items-center gap-1.5 overflow-hidden mt-auto w-full bg-gray-100 rounded-lg border border-gray-200">
        <Avatar
          className="flex-grow-0 flex-shrink-0 bg-gray-500 text-white"
          src="ellipse-12.png"
          children={user?.first_name?.[0] ?? ""}
        />

        <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative overflow-hidden truncate">
          <p className="flex-grow-0 leading-none  flex-shrink-0 text-sm font-semibold text-left text-[#0a1b39] truncate">
            {user?.first_name ?? ""} {user?.last_name ?? ""}
          </p>
          <p className="flex-grow-0 leading-none  flex-shrink-0 text-xs text-left text-[#83899f] truncate ">
            {user?.role}
          </p>
        </div>

        <CaretDown weight="fill" size={16} className="text-gray-500" />
      </div>
    </aside>
  );
};

export default Sidebar;
