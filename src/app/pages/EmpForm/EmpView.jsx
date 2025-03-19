import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PersonalInfo } from "./PersonalInfo"; // Import your form component

export default function EmpView() {
  const { code } = useParams(); // Get employee code from URL
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch employee data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/get-staff/${code}`);
        console.log("Raw data:", response.data);
        
        if (response.data) {
          const { staff, tblsourcebk } = response.data;
          
          // Handle DOJ date format (DD-MM-YYYY)
          let dojDate = null;
          if (staff.DOJ && typeof staff.DOJ === 'string') {
            try {
              // Parse the date in DD-MM-YYYY format
              const [day, month, year] = staff.DOJ.split('-');
              dojDate = new Date(year, month - 1, day);
              
              // Ensure it's a valid date
              if (isNaN(dojDate.getTime())) {
                console.error("Invalid date after parsing:", staff.DOJ);
                dojDate = null;
              }
            } catch (e) {
              console.error("Error parsing date:", e);
              dojDate = null;
            }
          }

          let dorDate = null
          if (staff.DOR && typeof staff.DOR === 'string') {
            try {
              // Parse the date in DD-MM-YYYY format
              const [day, month, year] = staff.DOR.split('-');
              dorDate = new Date(year, month - 1, day);
              
              // Ensure it's a valid date
              if (isNaN(dorDate.getTime())) {
                console.error("Invalid date after parsing:", staff.DOJ);
                dorDate = null;
              }
            } catch (e) {
              console.error("Error parsing date:", e);
              dorDate = null;
            }
          }

          
          // Handle the DeptId - make sure it's a number
          let departmentId = null;
          if (staff.DeptId !== undefined && staff.DeptId !== null) {
            departmentId = parseInt(staff.DeptId, 10);
          }
          
          // Handle the IsActive Buffer case
          let isActiveValue = 0; // Default to inactive
          if (staff.IsActive) {
            if (staff.IsActive === 1 || staff.IsActive === true || staff.IsActive === "1") {
              isActiveValue = 1;
            } else if (typeof staff.IsActive === 'object' && staff.IsActive.type === 'Buffer') {
              // Handle Buffer case
              isActiveValue = staff.IsActive.data[0] === 1 ? 1 : 0;
            }
          }
          
          const formattedData = {
            firstName: staff.FirstName,
            lastName: staff.LastName,
            guardian: staff.Guardian,
            address: staff.Address,
            primaryPhone: staff.PrimaryPhone,
            secondaryPhone: staff.SecondaryPhone,
            isActive: isActiveValue, // Use the numeric value (0 or 1)
            DOJ: dojDate,
            DOR: dorDate,
            resignationReason: staff.ResignationReason, // Add Reason for Resignation
            deptId: departmentId, // Use the parsed department ID
            Aadhaar: tblsourcebk?.Aadhar_Number,
            AccountNumber: tblsourcebk?.Bank_Acc_No,
            BankName: tblsourcebk?.Bank_Name,
            IFSC: tblsourcebk?.IFSC_Code,
            code: code
          };
          
          console.log("Formatted data:", formattedData);
          setEmployeeData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [code]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!employeeData) {
    return <div>Employee not found</div>;
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">View Staff</h1>
      <PersonalInfo readOnly defaultValues={employeeData} />
    </div>
  );
}