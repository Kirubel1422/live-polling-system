import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type IResponse } from "@/types/response.types";
import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

export const participantApi = createApi({
  reducerPath: "participantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL + "/participant",
    credentials: "include",
  }),
  tagTypes: ["Participant"],
  endpoints: (builder) => ({
    joinSession: builder.mutation<any, { joinCode: string; name: string }>({
      query: (body) => ({
        url: "/join",
        method: "POST",
        body,
      }),
      transformResponse: (resp: IResponse) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Failed to join session");
        }
        return resp.data;
      },
    }),
    getSessionData: builder.query<any, string>({
      query: (presentationId) => `/session/${presentationId}`,
      transformResponse: (resp: IResponse) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Failed to fetch session data");
        }
        return resp.data;
      },
    }),
    submitResponse: builder.mutation<any, { participantId: string; slideId: string; value: any }>({
      query: (body) => ({
        url: "/response",
        method: "POST",
        body,
      }),
      transformResponse: (resp: IResponse) => {
        if (!resp.success) {
          throw new Error(resp.message || "Failed to submit response");
        }
        return resp.data;
      },
    }),
  }),
});

export const {
  useJoinSessionMutation,
  useGetSessionDataQuery,
  useSubmitResponseMutation,
} = participantApi;

export default participantApi;
