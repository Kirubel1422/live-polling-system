import { useRegisterMutation } from "@/api/auth.api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RegisterDto } from "@/validators/auth.validator";

export const useRegister = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterDto) => {
    try {
      await register(data).unwrap();
      toast.success("Successfully registered!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to register. Please try again.");
    }
  };

  return {
    isLoading,
    onSubmit,
  };
};
