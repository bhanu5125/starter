import { PersonalInfo } from "../EmpForm/PersonalInfo";
import { Drawer } from "components/ui/Drawer";

export function EmployeeDrawer({ row, isEditMode, isOpen, close, onSuccess }) {
  const mergedData = row ? {
    ...row.staff,
    Aadhaar: row.tblsourcebk.Aadhar_Number,
    AccountNumber: row.tblsourcebk.Bank_Acc_No,
    BankName: row.tblsourcebk.Bank_Name,
    IFSC: row.tblsourcebk.IFSC_Code,
    isActive: row.staff.IsActive === 1
  } : null;

  return (
    <Drawer isOpen={isOpen} onClose={close} size="xl">
      <div className="p-6">
        {mergedData ? (
          <PersonalInfo 
            readOnly={!isEditMode}
            isEditMode={isEditMode}
            defaultValues={mergedData}
            code={row.staff.Code}
            onSuccess={onSuccess}
          />
        ) : (
          <div className="text-center py-4">Loading employee data...</div>
        )}
      </div>
    </Drawer>
  );
}