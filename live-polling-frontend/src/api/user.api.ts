import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ENV } from "@/config/env";
import authApi from "./auth.api";

const API_URL = ENV.API_URL;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL + "/user",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    updateProfile: builder.mutation<any, { firstName: string; lastName: string; email: string }>({
      query: (body) => ({
        url: "/profile",
        method: "PUT",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try { 
          const { data } = await queryFulfilled;
          dispatch(
            authApi.util.updateQueryData("getMe", undefined, () => {
              return data.data?.user;
            })
          );
        } catch {}
      },
    }),
    updatePassword: builder.mutation<any, { currentPassword?: string; newPassword: string }>({
      query: (body) => ({
        url: "/password",
        method: "PUT",
        body,
      }),
    }),
    updateNotifications: builder.mutation<any, { enabled: boolean }>({
      query: (body) => ({
        url: "/notifications",
        method: "PUT",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            authApi.util.updateQueryData("getMe", undefined, () => {
              return data.data?.user;
            })
          );
        } catch {}
      },
    }),
    uploadAvatar: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/avatar",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            authApi.util.updateQueryData("getMe", undefined, () => {
              return data.data?.user;
            })
          );
        } catch {}
      },
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateNotificationsMutation,
  useUploadAvatarMutation,
} = userApi;

export default userApi;
