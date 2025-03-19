import { Page } from "components/shared/Page";
import { KYCFormProvider } from "./KYCFormProvider";
import { PersonalInfo } from "./PersonalInfo";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";

const KYCForm = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch employee data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/get-salary-calc/`);
          console.log("Formatted data:", response.data);
          const transformedData = {
            Basic: response.data[0].Basic || "",
            HRA: response.data[0].HRA || "",
            PF: response.data[0].PF || "",
            ESI: response.data[0].ESI || "",
            TotalDays: response.data[0].TotalDays || "",
          };
    
          setEmployeeData(transformedData);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Handle form submission success
  const handleSuccess = () => {
    navigate("/dashboards/administration"); // Redirect to employee list after successful update
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!employeeData) {
    return <div>Data not found</div>;
  }

  return (
    <Page title="eKYC Form">
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <h2 className="py-5 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:py-6 lg:text-2xl">
          Salary Calculations
        </h2>

        <KYCFormProvider>
        <PersonalInfo
        defaultValues={employeeData}
        onSuccess={handleSuccess}
      />
        </KYCFormProvider>
      </div>
    </Page>
  );
};

export default KYCForm;
