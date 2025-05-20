// index.js
import { Page } from "components/shared/Page";
import { KYCFormProvider } from "./KYCFormProvider";
import { PersonalInfo } from "./PersonalInfo";
import { useNavigate } from "react-router";

const KYCForm = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    console.log("Employee added successfully!");
    navigate("/tables/emp1");
  };

  return (
    <Page title="Form">
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <h2 className="py-5 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:py-6 lg:text-2xl">
          Add Staff
        </h2>

        <KYCFormProvider>
          <PersonalInfo
            isEditMode={false}          // create mode
            defaultValues={{}}          // empty for create
            onSuccess={handleSuccess}
          />
        </KYCFormProvider>
      </div>
    </Page>
  );
};

export default KYCForm;
