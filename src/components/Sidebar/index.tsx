import { useAuthContext } from "@/Pages/Auth/context";
import {
  CardsThree,
  CaretDown,
  ChartBar,
  Cube,
  Gear,
  Headset,
  House,
  Lightning,
  SignOut,
  Smiley,
  UserCircle,
  Users,
  WaveTriangle,
} from "@phosphor-icons/react";
import { Divider, Menu } from "antd";
import clsx from "clsx";
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
    href: "/actors",
  },
  {
    key: "strategies",
    icon: CardsThree,
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
          icon: <Icon size={16} weight="duotone" />,
          label,
          onClick: () => navigate(href),
        }))}
      />
      <Divider className="my-3" />

      <div className="mt-auto">
        <hr className="mb-3 border-gray-200" />

        <div className={clsx("w-full")}>
          <div
            role="button"
            className={clsx(
              "group grid grid-rows-[1fr] items-center rounded-lg bg-white py-1.5 shadow-[0px_0px_0px_1px_#dadadd] transition-[grid-template-rows,max-height,opacity] duration-300 ease-in-2 hover:bg-gray-50",
              "group-hover:grid-rows-[1fr_auto]"
            )}
          >
            <div className="flex items-center px-2">
              <UserCircle
                weight="fill"
                className="mx-auto text-blue-600"
                size={18}
              />
              <div
                className={clsx(
                  "ms-2.5 flex flex-1 items-center gap-1.5 overflow-hidden transition-all duration-300 ease-in-2",
                  "max-w-[160px] scale-x-100 opacity-100"
                )}
                style={{ transformOrigin: "left" }}
              >
                <p className="flex-1 truncate text-left text-[13px] font-medium text-[#42424a]">
                  {user?.first_name} {user?.last_name}
                </p>
                <CaretDown
                  weight="fill"
                  size={16}
                  className="text-gray-500 group-hover:rotate-180 transition-transform duration-300 ease-in-2"
                />
              </div>
            </div>
            <div
              className={clsx(
                "grid max-h-0 gap-2 overflow-hidden opacity-0 transition-[max-height,opacity] duration-300 ease-in-2",
                "group-hover:max-h-40 opacity-100"
              )}
            >
              <hr className="mx-2 mt-2 border-gray-200" />
              <Menu
                selectedKeys={[]}
                items={[
                  {
                    key: "logout",
                    icon: (
                      <SignOut
                        size={16}
                        weight="duotone"
                        className="!fill-red-500"
                      />
                    ),
                    label: "Logout",
                    onClick: onLogout,
                    className:
                      "!text-red-600 hover:!bg-red-100 [&.ant-menu-item-selected]:!bg-red-600",
                  },
                  {
                    key: "settings",
                    icon: <Gear size={16} weight="duotone" />,
                    label: "Settings",
                    onClick: () => navigate("/settings"),
                  },
                  {
                    key: "help",
                    icon: <Headset size={16} weight="duotone" />,
                    label: "Help & support",
                    onClick: () => navigate("/help-and-support"),
                  },
                  {
                    key: "community",
                    icon: <Smiley size={16} weight="duotone" />,
                    label: "Community",
                    onClick: () => navigate("/community"),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-[auto_1fr_auto] px-1.5 py-1.5 items-center gap-1.5 overflow-hidden mt-auto w-full bg-gray-100 rounded-lg border border-gray-200">
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

        <CaretDown weight="duotone" size={16} className="text-gray-500" />
      </div> */}
    </aside>
  );
};

export default Sidebar;
