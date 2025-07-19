import { useEffect } from "react";
import { useForm, } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input, Button } from "components/ui";
import { salaryCalcSchema } from "./schema";
import axios from "axios";

export function PersonalInfo({ defaultValues, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(salaryCalcSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        "https://dev.trafficcounting.in/nodejs/api/update-salary-calc/",
        data
      );

      if (response.status === 200) {
        onSuccess?.();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="mt-6 space-y-4">
        <h5 className="text-lg font-medium text-gray-800 dark:text-dark-100">
          Payroll Calculations
        </h5>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            {...register("Basic")}
            disabled={isSubmitting}
            label="Basic (%)"
            error={errors?.Basic?.message}
            placeholder="Enter Basic (%)"
          />
          <Input
            {...register("PF")}
            disabled={isSubmitting}
            label="PF (%)"
            error={errors?.PF?.message}
            placeholder="Enter PF (%)"
          />
          <Input
            {...register("TotalDays")}
            disabled={isSubmitting}
            label="Total Days"
            error={errors?.TotalDays?.message}
            placeholder="Enter Total Days"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
        <Input
            {...register("HRA")}
            disabled={isSubmitting}
            label="HRA (%)"
            error={errors?.HRA?.message}
            placeholder="Enter HRA (%)"
          />
          <Input
            {...register("ESI")}
            disabled={isSubmitting}
            label="ESI (%)"
            error={errors?.ESI?.message}
            placeholder="Enter ESI (%)"
          />
        </div>

        <div className="mt-8 flex justify-end gap-3 rtl:space-x-reverse">
          <Button
            type="button"
            onClick={onSuccess}
            disabled={isSubmitting}
            className="min-w-[7rem]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            className="min-w-[7rem]"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}