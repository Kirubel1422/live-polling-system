import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type IResponse } from "@/types/response.types";
import { type LoginDto, type RegisterDto } from "@/validators/auth.validator"; // We'll create these types

import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL + "/auth",
    credentials: "include",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<any, LoginDto>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      transformResponse: (resp: IResponse) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Login failed");
        }
        return resp.data;
      },
    }),
    register: builder.mutation<any, RegisterDto>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      transformResponse: (resp: IResponse) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Registration failed");
        }
        return resp.data;
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    getMe: builder.query<any, void>({
      query: () => "/me",
      transformResponse: (resp: IResponse) => resp.data?.user,
    }),
    verifyEmail: builder.mutation<IResponse, string>({
      query: (token) => `/verify-email?token=${token}`,
    }),
    forgotPassword: builder.mutation<IResponse, { email: string }>({
      query: (body) => ({
        url: "/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<IResponse, { token: string; newPassword: string }>({
      query: (body) => ({
        url: "/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;

export default authApi;
