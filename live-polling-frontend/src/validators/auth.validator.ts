import * as yup from "yup";

export const RegisterSchema = yup.object({
  name: yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export const LoginSchema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(1, "Password is required").required("Password is required"),
});

export type RegisterDto = yup.InferType<typeof RegisterSchema>;
export type LoginDto = yup.InferType<typeof LoginSchema>;
