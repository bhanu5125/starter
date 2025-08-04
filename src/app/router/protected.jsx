import { Navigate } from "react-router";
import { AppLayout } from "app/layouts/AppLayout";
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";
import { AdminGuard } from "middleware/AdminGuard";
import { SecretKeyGuard } from "middleware/SecretKeyGaurd";

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    {
      path: "verify-secret-key",
      lazy: async () => ({
        Component: (await import("app/pages/Auth/SecretKey")).default,
      }),
    },
    {
      Component: SecretKeyGuard,
      children: [
        {
          Component: DynamicLayout,
          children: [
            {
              index: true,
              element: <Navigate to="/dashboards/home" replace />,
            },
            {
              path: "dashboards",
              children: [
                {
                  index: true,
                  element: <Navigate to="/dashboards/home" replace />,
                },
                {
                  path: "home",
                  lazy: async () => ({
                    Component: (await import("app/pages/dashboards/home")).default,
                  }),
                },
                {
                  element: <AdminGuard />,
                  children: [
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
              ],
            },
            {
              path: "/tables",
              children: [
                {
                  index: true,
                  element: <Navigate to="/tables/emp1" replace />,
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
                  path: "ot-bonus",
                  lazy: async () => ({
                    Component: (await import("app/pages/emp-bonus-ot-table")).default,
                  }),
                },
                {
                  element: <AdminGuard />,
                  children: [
                    {
                      path: "salary",
                      lazy: async () => ({
                        Component: (await import("app/pages/emp-salary-table")).default,
                      }),
                    },
                    {
                      path: "payslip",
                      lazy: async () => ({
                        Component: (await import("app/pages/PaySlipTable")).default,
                      }),
                    },
                    {
                      path: "payslip/:staffId",
                      lazy: async () => ({
                        Component: (await import("app/pages/PaySlipTable/PaySlip")).default,
                      }),
                    },
                    {
                      path: "users",
                      lazy: async () => ({
                        Component: (await import("app/pages/UserSettings/UserTable.jsx")).default,
                      }),
                    },
                    {
                      path: "genpayroll",
                      lazy: async () => ({
                        Component: (await import("app/pages/GenPayroll")).default,
                      }),
                    },
                  ],
                },
              ],
            },
            {
              path: "/forms",
              children: [
                {
                  index: true,
                  element: <Navigate to="/forms/emp1" replace />,
                },
                {
                  path: "emp1",
                  lazy: async () => ({
                    Component: (await import("app/pages/EmpForm/index.jsx")).default,
                  }),
                },
                {
                  path: "emp1/view/:code",
                  lazy: async () => ({
                    Component: (await import("app/pages/EmpForm/EmpView.jsx")).default,
                  }),
                },
                {
                  path: "emp1/edit/:code",
                  lazy: async () => ({
                    Component: (await import("app/pages/EmpForm/EmpEdit.jsx")).default,
                  }),
                },
                {
                  element: <AdminGuard />,
                  children: [
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
          ],
        },
        {
          Component: AppLayout,
          children: [
            {
              element: <AdminGuard />,
              children: [
                {
                  path: "settings",
                  lazy: async () => ({
                    Component: (await import("app/pages/settings/Layout")).default,
                  }),
                  children: [
                    {
                      index: true,
                      element: <Navigate to="/settings/general" replace />,
                    },
                    {
                      path: "general",
                      lazy: async () => ({
                        Component: (await import("app/pages/settings/sections/General")).default,
                      }),
                    },
                    {
                      path: "appearance",
                      lazy: async () => ({
                        Component: (await import("app/pages/settings/sections/Appearance")).default,
                      }),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export { protectedRoutes };