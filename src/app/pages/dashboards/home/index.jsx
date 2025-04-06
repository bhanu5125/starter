import { Page } from "components/shared/Page";
import {
  ShieldCheckIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Box } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";

const items = [
  {
    id: "manage-staff",
    Icon: UserGroupIcon,
    title: "Manage Staff",
    description: "Add, Edit, View Staff Members",
    navigateto: "/tables/emp1"
  },
  {
    id: "attendance",
    Icon: UserPlusIcon,
    title: "Attendance",
    description: "Mark Attendance of Staff Members",
    navigateto: "/tables/attendance"
  },
  {
    id: "payroll",
    Icon: CurrencyDollarIcon,
    title: "Payroll Calculation",
    description: "Calculate Payroll of Staff Members",
    navigateto: "/dashboards/payroll"
  },
  {
    id: "administration",
    Icon: ShieldCheckIcon,
    title: "Administration",
    description: "Manage Payroll and System Settings",
    navigateto: "/dashboards/administration"
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const isAdmin = user?.username?.toLowerCase() === "sadmin";
  const filteredItems = isAdmin ? items : items.slice(0, 2)

  return (
    <Page title="Homepage">
      <div className="flex min-w-0 align-middle justify-center py-2">
        <h1 className="truncate text-4xl font-medium tracking-wide align-middle justify-center text-gray-800 dark:text-dark-50 px-2">
          Dashboard
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:px-16 lg:py-16 gap-4 sm:grid-cols-1 sm:gap-2 lg:grid-cols-2 lg:gap-4">
        {filteredItems.map(({ id, Icon, title, description, navigateto }) => (
          <Box
            key={id}
            className="relative rounded-lg px-12 py-16 text-center mx-24 flex flex-col items-center justify-center cursor-pointer bg-gray-100 text-gray-800 shadow-lg dark:bg-dark-700 dark:text-dark-100 dark:shadow-none"
            onClick={() => navigate(navigateto)}
          >
            <Icon className="size-12 mb-2 text-primary-600 dark:text-primary-400" />
            <h4 className="text-lg font-semibold">{title}</h4>
            <p className="text-sm opacity-80">{description}</p>
          </Box>
        ))}
      </div>
    </Page>
  );
}