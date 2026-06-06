import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResetPasswordSchema, type ResetPasswordDto } from '@/validators/auth.validator';
import { useResetPasswordMutation } from '@/api/auth.api';

export function useResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const form = useForm<ResetPasswordDto>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordDto) => {
    if (!token) return toast.error('Invalid token');
    
    try {
      const response = await resetPassword({ token, newPassword: data.password }).unwrap();
      toast.success(response.message || "Password reset successfully");
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password');
    }
  };

  return {
    token,
    form,
    isLoading,
    onSubmit,
  };
}
