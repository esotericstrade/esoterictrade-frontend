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
  Plus,
  SignOut,
  Smiley,
  Target,
  UserCircle,
  Users,
  WaveTriangle,
} from "@phosphor-icons/react";
import { Button, Menu } from "antd";
import clsx from "clsx";
import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PlaceOrderWrapper from "../PlaceOrderWrapper";
import GTTManagement from "../GTTManagement";

// Define menu item type with optional role restrictions
type MenuItem = {
  key: string;
  icon: any;
  label: string;
  href: string;
  roles?: Array<"admin"|"readonly_admin"|"user">; // If not specified, available to all
};

const ALL_MENU_ITEMS: MenuItem[] = [
  {
    key: "dashboard",
    icon: House,
    label: "Dashboard",
    href: "/dashboard",
    roles: ["admin","readonly_admin"], // Admin only
  },
  {
    key: "users",
    icon: Users,
    label: "Users",
    href: "/users",
    roles: ["admin","readonly_admin"], // Admin only
  },
  {
    key: "actors",
    icon: Lightning,
    label: "Actors",
    href: "/actors",
    roles: ["admin","readonly_admin"], // Admin only
  },
  {
    key: "strategies",
    icon: CardsThree,
    label: "Strategies",
    href: "/strategies",
    roles: ["admin","readonly_admin"], // Admin only
  },
  {
    key: "brokers",
    icon: Users,
    label: "Brokers",
    href: "/brokers",
    roles: ["admin","readonly_admin"], // Admin only
  },
  {
    key: "reports",
    icon: ChartBar,
    label: "Reports",
    href: "/reports/trade",
    roles: ["admin","readonly_admin"], // Admin only
  },
  {
    key: "positions",
    icon: WaveTriangle,
    label: "Positions",
    href: "/positions",
    roles: ["admin","readonly_admin","user"]
  },
  {
    key: "orders",
    icon: Cube,
    label: "Orders",
    href: "/orders",
    roles: ["admin","readonly_admin"], // Admin only
  },
  {
    key: "analytics",
    icon: ChartBar,
    label: "Analytics",
    href: "/analytics",
    roles: ["admin","readonly_admin"], // Admin only
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onLogout, user } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<string>("dashboard");

  // Filter menu items based on user role
  const filteredMenuItems = useMemo(() => {
    if (!user) return [];

    return ALL_MENU_ITEMS.filter((item) => {
      // If no roles specified, item is available to all
      if (!item.roles || item.roles.length === 0) {
        return true;
      }
      // Check if user's role is in the allowed roles
      return item.roles.includes(user.role);
    });
  }, [user]);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = filteredMenuItems.find((item) =>
      currentPath.startsWith(item.href)
    );
    
    if (currentItem) {
      setActiveStep(currentItem.key);
    } else if (filteredMenuItems.length > 0) {
      // If current path doesn't match any menu item, default to first available item
      setActiveStep(filteredMenuItems[0].key);
      
      // For non-admin users, redirect to positions if they try to access admin routes
      if (user?.role === "user" && !currentItem) {
        navigate("/positions");
      }
    }
  }, [location.pathname, filteredMenuItems, user, navigate]);

  // Hide action buttons for non-admin users
  const showActionButtons = user?.role === "admin";

  return (
    <aside className="w-[260px] bg-white shadow-sm px-4 py-6 overflow-y-auto flex flex-col h-[calc(100vh-70px)]">
      {/* Action Buttons Section - Only for Admins */}
      {showActionButtons && (
        <div className="space-y-2 mb-6">
          <PlaceOrderWrapper>
            {({ setOpen }) => (
              <Button
                type="primary"
                size="large"
                block
                icon={<Plus size={18} weight="bold" />}
                onClick={() => setOpen(true)}
                className="h-11 font-medium shadow-sm hover:shadow-md transition-shadow"
              >
                Place Order
              </Button>
            )}
          </PlaceOrderWrapper>
          
          <Button
            type="default"
            size="large"
            block
            icon={<Target size={18} weight="bold" />}
            onClick={() => {
              // GTT Management functionality
              const gttButton = document.querySelector('#gtt-trigger-button');
              if (gttButton) {
                (gttButton as HTMLButtonElement).click();
              }
            }}
            className="h-11 font-medium border-primary-600 text-primary-600 hover:bg-primary-50 hover:border-primary-700"
          >
            GTT Orders
          </Button>
          
          {/* Hidden GTT Management Component */}
          <div className="hidden">
            <GTTManagement />
          </div>
        </div>
      )}

      {/* Navigation Section */}
      <div className="flex-1">
        {showActionButtons && (
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Navigation
          </div>
        )}
        
        <Menu
          selectedKeys={[activeStep]}
          className="border-0"
          items={filteredMenuItems.map(({ key, icon: Icon, label, href }) => ({
            key,
            icon: <Icon size={20} weight="duotone" />,
            label,
            onClick: () => navigate(href),
            className: "rounded-lg mb-1 transition-all duration-200",
          }))}
          style={{
            background: "transparent",
          }}
        />
      </div>

      {/* User Profile Section */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <div
          role="button"
          onClick={() => setOpen((prev) => !prev)}
          className={clsx(
            "w-full rounded-xl transition-all duration-300",
            open ? "bg-gray-50 shadow-sm" : "hover:bg-gray-50"
          )}
        >
          <div className="flex items-center px-3 py-2.5">
            <div className="relative">
              <UserCircle
                weight="fill"
                className="text-primary-600"
                size={36}
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role}
              </p>
            </div>
            <CaretDown
              weight="bold"
              size={16}
              className={clsx(
                "text-gray-400 transition-transform duration-300 ml-2",
                open && "rotate-180"
              )}
            />
          </div>
          
          {/* Dropdown Menu */}
          <div
            className={clsx(
              "overflow-hidden transition-all duration-300",
              open ? "max-h-48 pb-2" : "max-h-0"
            )}
          >
            <div className="px-2 pt-2">
              <Menu
                selectedKeys={[]}
                className="border-0"
                items={[
                  {
                    key: "settings",
                    icon: <Gear size={18} weight="duotone" />,
                    label: "Settings",
                    onClick: () => navigate("/settings"),
                    className: "rounded-lg mb-1",
                  },
                  {
                    key: "help",
                    icon: <Headset size={18} weight="duotone" />,
                    label: "Help & Support",
                    onClick: () => navigate("/help-and-support"),
                    className: "rounded-lg mb-1",
                  },
                  {
                    key: "community",
                    icon: <Smiley size={18} weight="duotone" />,
                    label: "Community",
                    onClick: () => navigate("/community"),
                    className: "rounded-lg mb-1",
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "logout",
                    icon: (
                      <SignOut
                        size={18}
                        weight="duotone"
                        className="text-red-500"
                      />
                    ),
                    label: "Logout",
                    onClick: onLogout,
                    className: "rounded-lg text-red-600 hover:!bg-red-50",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;