import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input, Button } from "components/ui";
import * as yup from "yup";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// Validation schema for password change
const passwordChangeSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

function UserForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token;
  const username = location.state?.username; 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(passwordChangeSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://vps65389.dreamhostps.com:5000/api/update-password",
        { password: data.password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        alert("Password updated successfully!");
        navigate("/dashboards/administration");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.response) {
        alert(error.response.data.error || "Failed to update password");
      } else {
        alert("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="p-12 flex flex-row justify-self-center">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <h1 className="text-2xl font-bold mb-6">Change Password</h1>
        <div className="space-y-4">
          {/* Display Username (Disabled Input) */}
          <Input
            className="w-80"
            label="Username"
            value={username || "Loading..."} // Display the username or a fallback
            disabled // Make the input non-editable
          />

          {/* New Password Input */}
          <Input
            className="w-80"
            {...register("password")}
            type="password"
            disabled={isSubmitting}
            label="New Password"
            error={errors?.password?.message}
            placeholder="Enter New Password"
          />

          {/* Confirm Password Input */}
          <Input
            className="w-80"
            {...register("confirmPassword")}
            type="password"
            disabled={isSubmitting}
            label="Confirm Password"
            error={errors?.confirmPassword?.message}
            placeholder="Confirm New Password"
          />
        </div>
        <div className="mt-6 flex justify-start gap-3 rtl:space-x-reverse">
          <Button
            type="button"
            onClick={() => navigate("/tables/users")}
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
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;