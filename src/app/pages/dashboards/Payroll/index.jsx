/* eslint-disable no-unused-vars */
import { Page } from "components/shared/Page";
import {
  ShieldCheckIcon,
  CurrencyDollarIcon,
  DocumentCurrencyRupeeIcon,
  UserGroupIcon,
  UserPlusIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { Box } from "components/ui";

const items = [
  {
    id: "manage-staff",
    Icon: CurrencyDollarIcon,
    title: "Generate Payroll Report",
    description: "Payroll report month wise and generate for bank",
    isActive: false,
    navigateto: "/tables/genpayroll"
  },
  {
    id: "attendance",
    Icon: DocumentCurrencyRupeeIcon,
    title: "Generate Payslips",
    description: "Payslips for staff members",
    isActive: false,
    navigateto: "/tables/payslip"
  }
];

export default function Home() {
  const navigate = useNavigate();  // React Router navigation hook

  return (
    <Page title="Payroll">
      <div className="flex min-w-0 align-middle justify-center py-2">
          <h1 className="truncate text-4xl font-medium tracking-wide align-middle justify-center text-gray-800 dark:text-dark-50 px-2">
          Payroll
          </h1>
        </div>
      <div className="grid grid-cols-1 lg:px-14 lg:py-48 gap-4 sm:grid-cols-1 sm:gap-2 lg:grid-cols-2 lg:gap-4">
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
