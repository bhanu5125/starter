/* eslint-disable no-unused-vars */
// Import Dependencies
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";

// Local Imports
import Logo from "assets/mainLogo.svg?react";
import DashboardCheck from "assets/illustrations/dashboard-check.svg?react";
import { Button, Card, Checkbox, Input, InputErrorMsg } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { useThemeContext } from "app/contexts/theme/context";
import { schema } from "./schema";
import { Page } from "components/shared/Page";
import { useErrorHandler } from "hooks";

export default function SignIn() {
  const { login, errorMessage } = useAuthContext();
  const {
    primaryColorScheme: primary,
    lightColorScheme: light,
    darkColorScheme: dark,
    isDark,
  } = useThemeContext();
  const { handleError } = useErrorHandler();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Watch for errorMessage changes and show toast
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage || "Login failed. Please check your credentials.");
    }
  }, [errorMessage]);

  const onSubmit = async (data) => {
    await login({
      username: data.username,
      password: data.password,
    });
  };

  return (
    <Page title="Login">
      <main className="min-h-100vh flex">
      <div className="fixed top-0 hidden p-6 lg:block lg:px-12">
        <div className="flex items-center gap-2">
          <Logo className="size-16" />
          <p className="text-2xl font-semibold text-orange-500 uppercase dark:text-dark-100">
          Traffic Counting Management System
          </p>
        </div>
      </div>
        <div className="hidden w-full place-items-center lg:grid">
          <div className="w-full max-w-lg p-6">
            <DashboardCheck
              style={{
                "--primary": primary[500],
                "--dark-500": isDark ? dark[500] : light[200],
                "--dark-600": isDark ? dark[600] : light[100],
                "--dark-700": isDark ? dark[700] : light[300],
                "--dark-450": isDark ? dark[450] : light[400],
                "--dark-800": isDark ? dark[800] : light[400],
              }}
              className="w-full"
            />
          </div>
        </div>

        {/* Login Form Section */}
        <div className="flex w-full flex-col items-center ltr:border-l rtl:border-r border-gray-150 bg-white dark:border-transparent dark:bg-dark-700 lg:max-w-md">
          <div className="flex w-full max-w-sm grow flex-col justify-center p-5">
            <div className="text-center">
              <div className="mt-4">
                <h2 className="text-3xl font-semibold text-gray-600 dark:text-dark-100">
                  Sign In
                </h2>
              </div>
            </div>

            <Card className="mt-5 rounded-lg p-5 lg:p-7">
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="space-y-4">
                  <Input
                    label="Username"
                    placeholder="Enter Username"
                    prefix={
                      <EnvelopeIcon
                        className="size-5 transition-colors duration-200"
                        strokeWidth="1"
                      />
                    }
                    {...register("username")}
                    error={errors?.username?.message}
                  />
                  <Input
                    label="Password"
                    placeholder="Enter Password"
                    type="password"
                    prefix={
                      <LockClosedIcon
                        className="size-5 transition-colors duration-200"
                        strokeWidth="1"
                      />
                    }
                    {...register("password")}
                    error={errors?.password?.message}
                  />
                </div>

                <div className="mt-2">
                  <InputErrorMsg
                    when={errorMessage && errorMessage?.message !== ""}
                  >
                    {errorMessage?.message}
                  </InputErrorMsg>
                </div>

                <Button type="submit" className="mt-5 w-full" color="primary">
                  Sign In
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </Page>
  );
}
