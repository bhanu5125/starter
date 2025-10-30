// app/pages/SecretKey.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "app/contexts/auth/context";
import { Button, Card, Input } from "components/ui";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { Page } from "components/shared/Page";
import { useErrorHandler } from "hooks";

export default function SecretKey() {
  const { user, verifySecretKey, errorMessage } = useAuthContext();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (user?.username?.toLowerCase() !== 'sadmin') {
      navigate("/dashboards/home");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      const verified = await verifySecretKey(data.secretKey);
      if (verified) {
        navigate("/dashboards/home");
      }
    } catch (error) {
      handleError(error, "Secret key verification failed.");
    }
  };

  return (
    <Page title="Admin Verification">
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Admin Secret Verification
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Secret Key"
                type="password"
                placeholder="Enter admin secret key"
                prefix={<LockClosedIcon className="w-5 h-5" />}
                {...register("secretKey", { required: true })}
              />
              <Button
                type="submit"
                className="w-full"
                color="primary"
              >
                Verify Identity
              </Button>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </form>
          </Card>
        </div>
      </main>
    </Page>
  );
}