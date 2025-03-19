/* eslint-disable no-unused-vars */
import { Page } from "components/shared/Page";
import {
  ShieldCheckIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  UserPlusIcon,
  UserIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { Box } from "components/ui";

const items = [
  {
    id: "staff-salaries",
    Icon: UserGroupIcon,
    title: "Staff Salaries",
    description: "Manage Staff Members Salaries",
    isActive: false,
    navigateto: "/tables/salary"
  },
  {
    id: "salary-settings",
    Icon: Cog6ToothIcon,
    title: "Salary Settings",
    description: "Manage Payroll Calculations",
    isActive: false,
    navigateto: "/forms/salcal"
  },
  {
    id: "user-settings",
    Icon: UserIcon,
    title: "User Settings",
    description: "Manage System User Settings",
    isActive: false,
    navigateto: "/tables/users"
  }
];

export default function Home() {
  const navigate = useNavigate();  // React Router navigation hook

  return (
    <Page title="Administration">
      <div className="flex min-w-0 align-middle justify-center py-2">
          <h1 className="truncate text-4xl font-medium tracking-wide align-middle justify-center text-gray-800 dark:text-dark-50 px-2">
          Administration
          </h1>
        </div>
      <div className="grid grid-cols-1 lg:px-16 lg:py-16 gap-4 sm:grid-cols-1 sm:gap-2 lg:grid-cols-2 lg:gap-4">
        {items.map(({ id, isActive, Icon, title, description, navigateto }) => (
          <Box
            key={id}
            className="relative rounded-lg px-12 py-16 text-center mx-24 flex flex-col items-center justify-center cursor-pointer bg-gray-100 text-gray-800 shadow-lg dark:bg-dark-700 dark:text-dark-100 dark:shadow-none"
            onClick={() => navigate(navigateto)}  // Navigate on click
          >
            <Icon
              className={clsx(
                "size-12 mb-2", 
                !isActive && "text-primary-600 dark:text-primary-400"
              )}
            />
            <h4 className="text-lg font-semibold">{title}</h4>
            <p className="text-sm opacity-80">{description}</p>
          </Box>
        ))}
      </div>
    </Page>
  );
}
