import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import PropTypes from "prop-types";
import { Input, Button, Textarea } from "components/ui";
import { DatePicker } from "components/shared/form/Datepicker";
import { Listbox } from "components/shared/form/Listbox";
import { personalInfoSchema } from "./schema";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const staffGroups = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
];

export function PersonalInfo({
  readOnly = false,
  isEditMode = false,
  defaultValues = {},
  code,
  onSuccess,
}) {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://tcs.trafficcounting.com/nodejs/api/get-deptname');
        const data = response.data;
        // Transform to match old structure: format as { label, value }
        const transformed = data.map(item => ({ label: item.DeptName, value: item.ID }));
        setDepartments(transformed);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDepartments();
  }, []);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: !readOnly ? yupResolver(personalInfoSchema) : undefined,
    defaultValues: {
      ...defaultValues,
      deptId: departments.find(d => d.value === defaultValues.deptId) || null,
      groupNo: staffGroups.find(g => g.value === defaultValues.StaffType) || null,
    },
  });

  useEffect(() => {
  const resolvedDefaults = {
    ...defaultValues,
    deptId: departments.find((d) => d.value === defaultValues?.deptId) || null,
    groupNo: staffGroups.find((g) => g.value === defaultValues?.StaffType) || null,
    DOJ: defaultValues?.DOJ ? new Date(defaultValues.DOJ) : null,
    DOR: defaultValues?.DOR ? new Date(defaultValues.DOR) : null,
  };
  reset(resolvedDefaults);
  /*
  console.log("Default Values:", defaultValues);
  console.log("Resolved Defaults on Reset:", resolvedDefaults);
  console.log(defaultValues.DOJ);
  console.log(resolvedDefaults.DOJ);
  */
}, [defaultValues, reset, departments]);

  const navigate = useNavigate();

  function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

  const deptId = watch("deptId");
  const DOJ = watch("DOJ");
  const DOR = watch("DOR");

  const onSubmit = async (data) => {
    try {
      const formData = {
        tblsourcebk: {
          Emp_FName: data.firstName,
          Emp_LName: data.lastName,
          Emp_Father_Name: data.guardian,
          Emp_Address: data.address,
          Aadhar_Number: data.Aadhaar,
          Emp_P_No: data.primaryPhone,
          Emp_A_No: data.secondaryPhone,
          DOJ: formatDate(data.DOJ),
          Bank_Acc_No: data.AccountNumber,
          IFSC_Code: data.IFSC,
          Dept: data.deptId?.value,
          Bank_Name: data.BankName,
          Branch: data.Branch,
          Otherinfo : data.Otherinfo || "",
        },
        staff: {
          FirstName: data.firstName,
          LastName: data.lastName,
          Guardian: data.guardian,
          Address: data.address,
          PrimaryPhone: data.primaryPhone,
          SecondaryPhone: data.secondaryPhone,
          IsActive: data.isActive?.value ?? 1,
          StaffType: data.groupNo?.value ?? 0,
          DOJ: formatDate(data.DOJ),
          DeptId: data.deptId?.value,
          ModifiedDate: new Date().toISOString(),
          ModifiedBy: 1,
        },
        resignationReason: data.resignationReason || "",
      };

      console.log("Form Data:", formData);

      const endpoint = isEditMode
        ? `https://tcs.trafficcounting.com/nodejs/api/update-staff/${code}`
        : "https://tcs.trafficcounting.com/nodejs/api/submit-form";

      const method = isEditMode ? "PUT" : "POST";
      const response = await axios({
        method,
        url: endpoint,
        data: formData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status >= 200 && response.status < 300) {
        onSuccess();
      }
    } catch (error) {
      console.error("Form submission error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="mt-6 space-y-4">
        <h5 className="text-lg font-medium text-gray-800 dark:text-dark-100">
          Personal Information
        </h5>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input {...register("firstName")} readOnly={readOnly} disabled={readOnly || isSubmitting} label="First Name" error={errors.firstName?.message} placeholder="Enter First Name" />
          <Input {...register("lastName")} readOnly={readOnly} disabled={readOnly || isSubmitting} label="Last Name" error={errors.lastName?.message} placeholder="Enter Last Name" />
          <Input {...register("guardian")} readOnly={readOnly} disabled={readOnly || isSubmitting} label="Guardian Name" error={errors.guardian?.message} placeholder="Enter Guardian Name" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Input {...register("primaryPhone")} readOnly={readOnly} disabled={readOnly || isSubmitting} label="Primary Phone" error={errors.primaryPhone?.message} placeholder="Enter Primary Phone" />
          <Input {...register("secondaryPhone")} readOnly={readOnly} disabled={readOnly || isSubmitting} label="Secondary Phone" error={errors.secondaryPhone?.message} placeholder="Enter Secondary Phone" />
          <Input {...register("Aadhaar")} readOnly={readOnly} disabled={readOnly || isSubmitting} label="Aadhaar Number" error={errors.Aadhaar?.message} placeholder="Enter Aadhaar Number" />
        </div>

        <h5 className="text-lg font-medium text-gray-800 dark:text-dark-100">Staff Information</h5>

        <div className="grid gap-4 lg:grid-cols-3">
          {(isEditMode || readOnly) && (
            <Input {...register("code")} readOnly disabled label="Staff Code" />
          )}

          <Listbox
            label="Department"
            data={departments}
            displayField="label"
            value={deptId}
            onChange={(val) => setValue("deptId", val)}
            disabled={readOnly || isSubmitting || isLoading}
            placeholder="Select Department"
            error={errors.deptId?.message}
          />

          {deptId?.value === 4 && (
            <Listbox
              label="Staff Group"
              data={staffGroups}
              displayField="label"
              value={watch("groupNo")}
              onChange={(val) => setValue("groupNo", val)}
              disabled={readOnly || isSubmitting}
              placeholder="Select Staff Group"
              error={errors.groupNo?.message}
            />
          )}

          <DatePicker
            label="Date of Joining"
            value={DOJ}
            onChange={(date) => setValue("DOJ", date)}
            readOnly={readOnly}
            disabled={readOnly || isSubmitting}
            dateFormat="yyyy-MM-dd"
            placeholder="Select Date of Joining"
            error={errors.DOJ?.message}
          />

          {(isEditMode || readOnly) && (
            <>
              <DatePicker
                label="Date of Relieving"
                value={DOR}
                onChange={(date) => setValue("DOR", date)}
                readOnly={readOnly}
                disabled={readOnly || isSubmitting}
                dateFormat="yyyy-MM-dd"
                placeholder="Select Date of Relieving"
                error={errors.DOR?.message}
              />
              <Textarea
                {...register("resignationReason")}
                readOnly={readOnly}
                disabled={readOnly || isSubmitting}
                placeholder="Enter Reason for Relieving"
                label="Reason for Relieving"
                error={errors.resignationReason?.message}
                component={TextareaAutosize}
                minRows={3}
                maxRows={6}
              />
            </>
          )}
        </div>

        <h5 className="text-lg font-medium text-gray-800 dark:text-dark-100">Address Information</h5>

        <Textarea
          {...register("address")}
          readOnly={readOnly}
          disabled={readOnly || isSubmitting}
          placeholder="Enter Address"
          label="Address"
          error={errors.address?.message}
          component={TextareaAutosize}
          minRows={2}
          maxRows={12}
        />

        <h5 className="text-lg font-medium text-gray-800 dark:text-dark-100">Bank Information</h5>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input {...register("AccountNumber")} readOnly={readOnly} disabled={readOnly || isSubmitting} label="Account Number" error={errors.AccountNumber?.message} placeholder="Enter Account Number" />
          <Input {...register("BankName")} readOnly={readOnly} disabled={readOnly || isSubmitting} label="Bank Name" error={errors.BankName?.message} placeholder="Enter Bank Name" />
          <Input {...register("Branch")} readOnly={readOnly} disabled={readOnly || isSubmitting} label="Branch" error={errors.Branch?.message} placeholder="Enter Branch Name" />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Input {...register("IFSC")} readOnly={readOnly} disabled={readOnly || isSubmitting} label="IFSC" error={errors.IFSC?.message} placeholder="Enter IFSC" />
          <Input {...register("Otherinfo")} readOnly={readOnly} disabled={readOnly || isSubmitting} label="Other Info" error={errors.Otherinfo?.message} placeholder="Enter Additional Info" />
        </div>

        <div className="mt-8 flex justify-end gap-3 rtl:space-x-reverse">
          <Button type="button" onClick={() => { navigate("/tables/emp1"); }} disabled={isSubmitting} className="min-w-[7rem]">
            Cancel
          </Button>
          {!readOnly && (
            <Button type="submit" color="primary" disabled={isSubmitting} className="min-w-[7rem]">
              {isSubmitting ? "Processing..." : isEditMode ? "Update Staff" : "Add Staff"}
            </Button>
          )}
        </div>
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
