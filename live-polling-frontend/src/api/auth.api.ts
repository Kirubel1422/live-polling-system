import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IResponse } from "@/types/response.types";
import { LoginDto, RegisterDto } from "@/validators/auth.validator"; // We'll create these types

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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;

export default authApi;
