import { useLoginMutation } from "@/api/auth.api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoginDto } from "@/validators/auth.validator";

export const useLogin = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginDto) => {
    try {
      await login(data).unwrap();
      toast.success("Successfully logged in!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to login. Please check your credentials.");
    }
  };

  return {
    isLoading,
    onSubmit,
  };
};
