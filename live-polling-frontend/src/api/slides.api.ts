import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Slide } from "@/types/presentation";
import { IResponse } from "@/types/response.types";
import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

const slidesApi = createApi({
  reducerPath: "slidesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL + "/presentations",
    credentials: "include",
  }),
  tagTypes: ["Slides"],
  endpoints: (builder) => ({
    /** PATCH /api/presentations/:presentationId/slides/:slideId/settings */
    updateSlideSettings: builder.mutation<
      Slide,
      { presentationId: string; slideId: string; settings: Record<string, unknown> }
    >({
      query: ({ presentationId, slideId, settings }) => ({
        url: `/${presentationId}/slides/${slideId}/settings`,
        method: "PATCH",
        body: settings,
      }),
      transformResponse: (resp: IResponse<any>) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Failed to update slide settings");
        }
        const { meta, ...rest } = resp.data;
        return { ...rest, ...(meta || {}) } as Slide;
      },
    }),

    /** DELETE /api/presentations/:presentationId/slides/:slideId */
    deleteSlide: builder.mutation<void, { presentationId: string; slideId: string }>({
      query: ({ presentationId, slideId }) => ({
        url: `/${presentationId}/slides/${slideId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { presentationId }) => [
        { type: "Slides", id: presentationId },
      ],
    }),

    /** POST /api/presentations/:presentationId/slides/:slideId/duplicate */
    duplicateSlide: builder.mutation<
      Slide,
      { presentationId: string; slideId: string }
    >({
      query: ({ presentationId, slideId }) => ({
        url: `/${presentationId}/slides/${slideId}/duplicate`,
        method: "POST",
      }),
      transformResponse: (resp: IResponse<any>) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Failed to duplicate slide");
        }
        // Flatten meta into the slide object (same pattern as presentations.api.ts)
        const { meta, ...rest } = resp.data;
        return { ...rest, ...(meta || {}) } as Slide;
      },
      invalidatesTags: (_result, _error, { presentationId }) => [
        { type: "Slides", id: presentationId },
      ],
    }),
  }),
});

export const { useDeleteSlideMutation, useDuplicateSlideMutation, useUpdateSlideSettingsMutation } = slidesApi;
export default slidesApi;
