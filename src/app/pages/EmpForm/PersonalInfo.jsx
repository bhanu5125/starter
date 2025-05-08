import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextareaAutosize from "react-textarea-autosize";
import axios from "axios";
import { UserIcon, PhoneIcon } from "@heroicons/react/20/solid";
import PropTypes from "prop-types";

// Components
import { Listbox } from "components/shared/form/Listbox";
import { Button, Input, Textarea } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";

// Schema and Context
import { personalInfoSchema } from "./schema";

const staffGroups = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
];

const departments = [
  { label: "TRIBE DEVELOPMENT", value: 1 },
  { label: "TRIBE DESIGN", value: 2 },
  { label: "TSS ADMIN", value: 3 },
  { label: "TSS DATA ENTRY", value: 4 },
  { label: "HTPL", value: 5 },
];

const activeStatuses = [
  { label: "Active", value: 1 },
  { label: "Inactive", value: 0 },
];

export function PersonalInfo({
  readOnly = false,
  isEditMode = false,
  defaultValues,
  code,
  onSuccess,
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: !readOnly && yupResolver(personalInfoSchema),
    defaultValues, // Use defaultValues directly
  });

  useEffect(() => {
    // Transform defaultValues to match Listbox's expected format
    const transformedDefaultValues = {
      ...defaultValues,
      deptId: departments.find((dept) => dept.value === defaultValues.deptId), // Find the department object
      isActive: activeStatuses.find(
        (status) => status.value === defaultValues.isActive,
      ), // Find the status object
    };

    // Reset the form with transformed values
    reset(transformedDefaultValues);
  }, [defaultValues, reset]);

  const onSubmit = async (data) => {
    try {
      // Transform data back to the expected API format
      const formData = {
        tblsourcebk: {
          Emp_FName: data.firstName,
          Emp_LName: data.lastName,
          Emp_Father_Name: data.guardian,
          Emp_Address: data.address,
          Aadhar_Number: data.Aadhaar,
          Emp_P_No: data.primaryPhone,
          Emp_A_No: data.secondaryPhone,
          DOJ: data.DOJ,
          Bank_Acc_No: data.AccountNumber,
          IFSC_Code: data.IFSC,
          Dept: data.deptId.value, // Use the value property
          Bank_Name: data.BankName,
        },
        staff: {
          FirstName: data.firstName,
          LastName: data.lastName,
          Guardian: data.guardian,
          Address: data.address,
          PrimaryPhone: data.primaryPhone,
          SecondaryPhone: data.secondaryPhone,
          IsActive: data.isActive.value, // Use the value property
          DOJ: data.DOJ,
          DeptId: data.deptId.value, // Use the value property
          ModifiedDate: new Date().toISOString(),
          ModifiedBy: 1,
          GroupNo: data.groupNo,
        },
      };

      const endpoint = isEditMode
        ? `https://tms-backend-three.vercel.app/api/update-staff/${code}`
        : "https://tms-backend-three.vercel.app/api/submit-form";

      const method = isEditMode ? "PUT" : "POST";

      const response = await axios({
        method,
        url: endpoint,
        data: formData,
      });

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
          Personal Information
        </h5>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            {...register("firstName")}
            readOnly={readOnly}
            disabled={readOnly || isSubmitting}
            prefix={<UserIcon className="size-5" />}
            label="First Name"
            error={errors?.firstName?.message}
            placeholder="Enter First Name"
          />
          <Input
            {...register("lastName")}
            readOnly={readOnly}
            disabled={readOnly || isSubmitting}
            prefix={<UserIcon className="size-5" />}
            label="Last Name"
            error={errors?.lastName?.message}
            placeholder="Enter Last Name"
          />
          <Input
            {...register("guardian")}
            readOnly={readOnly}
            disabled={readOnly || isSubmitting}
            prefix={<UserIcon className="size-5" />}
            label="Guardian Name"
            error={errors?.guardian?.message}
            placeholder="Enter Guardian Name"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Input
            {...register("primaryPhone")}
            readOnly={readOnly}
            disabled={readOnly || isSubmitting}
            prefix={<PhoneIcon className="size-5" />}
            label="Primary Phone"
            error={errors?.primaryPhone?.message}
            placeholder="Enter Primary Phone"
          />
          <Input
            {...register("secondaryPhone")}
            readOnly={readOnly}
            disabled={readOnly || isSubmitting}
            prefix={<PhoneIcon className="size-5" />}
            label="Secondary Phone"
            error={errors?.secondaryPhone?.message}
            placeholder="Enter Secondary Phone"
          />
          <Input
            {...register("Aadhaar")}
            readOnly={readOnly}
            disabled={readOnly || isSubmitting}
            label="Aadhaar Number"
            error={errors?.Aadhaar?.message}
            placeholder="Enter Aadhaar Number"
          />
        </div>

        <h5 className="text-lg font-medium text-gray-800 dark:text-dark-100">
          Staff Information
        </h5>

        <div className="grid gap-4 lg:grid-cols-3">
          {(isEditMode || readOnly) && (
            <>
              <Input
                {...register("code")}
                readOnly={readOnly}
                disabled={true}
                label="Staff Code"
                error={errors?.Aadhaar?.message}
                placeholder="Code"
              />
            </>
          )}
          <Controller
            name="deptId"
            control={control}
            render={({ field }) => {
              console.log("Departments Data:", departments); // Debugging

              return (
                <>
                  <Listbox
                    {...field}
                    disabled={readOnly || isSubmitting}
                    data={departments ?? []} // Prevent undefined error
                    label="Department"
                    placeholder="Select Department"
                    displayField="label"
                    error={errors?.deptId?.message}
                  />

                  {field.value?.value === 4 && (
                    <Controller
                      name="groupNo"
                      control={control}
                      render={({ field: groupField }) => {
                        console.log("Staff Groups Data:", staffGroups); // Debugging

                        return (
                          <Listbox
                            {...groupField}
                            disabled={readOnly || isSubmitting}
                            data={staffGroups} // Prevent undefined error
                            label="Staff Group"
                            placeholder="Select Staff Group"
                            displayField="label"
                            error={errors?.groupNo?.message}
                          />
                        );
                      }}
                    />
                  )}
                </>
              );
            }}
          />
          {/*
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => {
              console.log("Status Value:", field.value); // Debugging
              return (
                <Listbox
                  {...field}
                  disabled={readOnly || isSubmitting}
                  data={activeStatuses}
                  label="Status"
                  placeholder="Select Status"
                  displayField="label"
                  error={errors?.isActive?.message}
                />
              );
            }}
          />*/}
          <Controller
            name="DOJ"
            control={control}
            render={({ field }) => {
              let selected = null;
              if (field.value) {
                try {
                  const date = new Date(field.value);
                  if (!isNaN(date.getTime())) {
                    selected = date;
                  }
                } catch (e) {
                  console.error("Invalid date:", field.value, e);
                }
              }

              return (
                <DatePicker
                  {...field}
                  readOnly={readOnly}
                  disabled={readOnly || isSubmitting}
                  label="Date of Joining"
                  placeholder="Select Date of Joining"
                  selected={selected}
                  dateFormat="dd-MM-yyyy"
                  error={errors?.DOJ?.message}
                  onChange={(date) => field.onChange(date)}
                />
              );
            }}
          />
          {(isEditMode || readOnly) && (
            <>
              <Controller
                name="DOR"
                control={control}
                render={({ field }) => {
                  let selected = null;
                  if (field.value) {
                    try {
                      const date = new Date(field.value);
                      if (!isNaN(date.getTime())) {
                        selected = date;
                      }
                    } catch (e) {
                      console.error("Invalid date:", field.value, e);
                    }
                  }

                  return (
                    <DatePicker
                      {...field}
                      readOnly={readOnly}
                      disabled={readOnly || isSubmitting}
                      label="Date of Relieving"
                      placeholder="Select Date of Relieving"
                      selected={selected}
                      dateFormat="dd-MM-yyyy"
                      error={errors?.DOR?.message}
                      onChange={(date) => field.onChange(date)}
                    />
                  );
                }}
              />
              <Textarea
                {...register("resignationReason")}
                readOnly={readOnly}
                disabled={readOnly || isSubmitting}
                placeholder="Enter Reason for Relieving"
                label="Reason for Relieving"
                error={errors?.resignationReason?.message}
                className="rounded-lg bg-gray-150 px-3 py-2 placeholder:font-light placeholder:text-gray-600 focus:ring focus:ring-primary-500/50 dark:bg-dark-900 dark:placeholder:text-dark-200"
                component={TextareaAutosize}
                minRows={3}
                maxRows={6}
              />
            </>
          )}
        </div>

        <h5 className="text-lg font-medium text-gray-800 dark:text-dark-100">
          Address Information
        </h5>

        <div className="mt-6 space-y-4">
          <Textarea
            {...register("address")}
            readOnly={readOnly}
            disabled={readOnly || isSubmitting}
            placeholder="Enter Address"
            label="Address"
            error={errors?.address?.message}
            className="rounded-lg bg-gray-150 px-3 py-2 placeholder:font-light placeholder:text-gray-600 focus:ring focus:ring-primary-500/50 dark:bg-dark-900 dark:placeholder:text-dark-200"
            component={TextareaAutosize}
            minRows={2}
            maxRows={12}
          />
        </div>

        <h5 className="text-lg font-medium text-gray-800 dark:text-dark-100">
          Bank Information
        </h5>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            {...register("AccountNumber")}
            readOnly={readOnly}
            disabled={readOnly || isSubmitting}
            label="Account Number"
            error={errors?.AccountNumber?.message}
            placeholder="Enter Account Number"
          />
          <Input
            {...register("BankName")}
            readOnly={readOnly}
            disabled={readOnly || isSubmitting}
            label="Bank Name"
            error={errors?.BankName?.message}
            placeholder="Enter Bank Name"
          />
          <Input
            {...register("Branch")}
            readOnly={readOnly}
            disabled={readOnly || isSubmitting}
            label="Branch"
            error={errors?.Branch?.message}
            placeholder="Enter Branch Name"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Input
            {...register("IFSC")}
            readOnly={readOnly}
            disabled={readOnly || isSubmitting}
            label="IFSC"
            error={errors?.IFSC?.message}
            placeholder="Enter IFSC"
          />
          <Input
            {...register("Otherinfo")}
            readOnly={readOnly}
            disabled={readOnly || isSubmitting}
            label="Other Info"
            error={errors?.Otherinfo?.message}
            placeholder="Enter Additional Info"
          />
        </div>

        {!readOnly && (
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
              {isEditMode ? "Update Staff" : "Add Staff"}
            </Button>
          </div>
        )}
        {readOnly && (
          <div className="mt-8 flex justify-end gap-3 rtl:space-x-reverse">
            <Button
              type="button"
              onClick={onSuccess}
              disabled={isSubmitting}
              className="min-w-[7rem]"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}

PersonalInfo.propTypes = {
  readOnly: PropTypes.bool,
  isEditMode: PropTypes.bool,
  defaultValues: PropTypes.object,
  code: PropTypes.string,
  onSuccess: PropTypes.func,
};
