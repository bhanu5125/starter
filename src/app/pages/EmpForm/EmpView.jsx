// EmpView.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PersonalInfo } from "./PersonalInfo";
import { useErrorHandler } from "hooks";

export default function EmpView() {
  const { code } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://tcs.trafficcounting.com/nodejs/api/get-staff/${code}`
        );
        console.log("Fetched Data:", data);
        if (data) {
          const { staff, tblsourcebk } = data;
          const formatDateForMySQL = (date) => {
            const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
            const istDate = new Date(new Date(date).getTime() + istOffset);

            const day = String(istDate.getDate()).padStart(2, "0");
            const month = String(istDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
            const year = istDate.getFullYear();

            return `${year}-${month}-${day}`;
          };
          const dojDate = formatDateForMySQL(staff.DOJ);
          const dorDate = staff.DOR === null ? null : formatDateForMySQL(staff.DOR);

          const deptId = staff.DeptId
            ? parseInt(staff.DeptId, 10)
            : null;
          let isActiveValue = 0;
          if (staff.IsActive === 1 || staff.IsActive === "1" || staff.IsActive === true)
            isActiveValue = 1;
          else if (staff.IsActive?.type === "Buffer")
            isActiveValue = staff.IsActive.data[0] === 1 ? 1 : 0;

          const formattedData = {
            firstName: staff.FirstName,
            lastName: staff.LastName,
            guardian: staff.Guardian,
            address: staff.Address,
            primaryPhone: staff.PrimaryPhone,
            secondaryPhone: staff.SecondaryPhone,
            isActive: isActiveValue,
            DOJ: dojDate,
            DOR: dorDate,
            resignationReason: staff.ResignationReason,
            deptId,
            Aadhaar: tblsourcebk?.Aadhar_Number,
            AccountNumber: tblsourcebk?.Bank_Acc_No,
            BankName: tblsourcebk?.Bank_Name,
            Branch: tblsourcebk?.Branch,
            IFSC: tblsourcebk?.IFSC_Code,
            code,
            StaffType: staff.StaffType,
          };
          setEmployeeData(formattedData);
        }
      } catch (err) {
        console.error(err);
        handleError(err, "Failed to load staff data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [code, handleError]);

  if (loading) return <div>Loading...</div>;
  if (!employeeData) return <div>Employee not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">View Staff</h1>
      <PersonalInfo
        readOnly
        defaultValues={employeeData}
      />
    </div>
  );
}
