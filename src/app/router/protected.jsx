import { Navigate } from "react-router";

// Local Imports
import { AppLayout } from "app/layouts/AppLayout";
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";

// ----------------------------------------------------------------------

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    // The dynamic layout supports both the main layout and the sideblock.
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboards" />,
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <Navigate to="/dashboards/home" />,
            },
            {
              path: "home",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/home")).default,
              }),
            },
            {
              path: "administration",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/Administrator")).default,
              }),
            },
            {
              path: "payroll",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/Payroll")).default,
              }),
            },
          ],
        },
        {
          path: "/tables",
          children: [
            {
              index: true,
              element: <Navigate to="/tables/emp1" />,
            },
            {
              path: "emp1",
              lazy: async () => ({
                Component: (await import("app/pages/emp-table-1")).default,
              }),
            },
            {
              path: "attendance",
              lazy: async () => ({
                Component: (await import("app/pages/emp-attendance-table")).default,
              }),
            },
            {
              path: "salary",
              lazy: async () => ({
                Component: (await import("app/pages/emp-salary-table")).default,
              }),
            },
            {
              path: "users",
              lazy: async () => ({
                Component: (await import("app/pages/UserSettings/UserTable.jsx")).default,
              }),
            },
            {
              path: "payslip",
              lazy: async () => ({
                Component: (await import("app/pages/PaySlipTable")).default,
              }),
            },
          ],
        },
        {
          path: "/forms",
          children: [
            {
              index: true,
              element: <Navigate to="/forms/emp1" />,
            },
            {
              path: "emp1",
              lazy: async () => ({
                Component: (await import("app/pages/EmpForm/index.jsx")).default,
              }),
            },
            {
              path: "emp1/view/:code", // Route for viewing employee data
              lazy: async () => ({
                Component: (await import("app/pages/EmpForm/EmpView.jsx")).default,
              }),
            },
            {
              path: "emp1/edit/:code", // Route for editing employee data
              lazy: async () => ({
                Component: (await import("app/pages/EmpForm/EmpEdit.jsx")).default,
              }),
            },
            {
              path: "salcal",
              lazy: async () => ({
                Component: (await import("app/pages/SalForm")).default,
              }),
            },
            {
              path: "user-form/:uid",
              lazy: async () => ({
                Component: (await import("app/pages/UserSettings/UserForm.jsx")).default,
              }),
            },
          ],
        },
      ],
    },
    // The app layout supports only the main layout. Avoid using it for other layouts.
    {
      Component: AppLayout,
      children: [
        {
          path: "settings",
          lazy: async () => ({
            Component: (await import("app/pages/settings/Layout")).default,
          }),
          children: [
            {
              index: true,
              element: <Navigate to="/settings/general" />,
            },
            {
              path: "general",
              lazy: async () => ({
                Component: (await import("app/pages/settings/sections/General"))
                  .default,
              }),
            },
            {
              path: "appearance",
              lazy: async () => ({
                Component: (
                  await import("app/pages/settings/sections/Appearance")
                ).default,
              }),
            },
          ],
        },
      ],
    },
  ],
};

export { protectedRoutes };