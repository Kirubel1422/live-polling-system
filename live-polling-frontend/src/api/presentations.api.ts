import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Presentation } from "@/types/presentation";
import { IResponse } from "@/types/response.types";

import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

const presentationsApi = createApi({
  reducerPath: "presentationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL + "/presentations",
    credentials: "include",
  }),
  tagTypes: ["Presentations", "PresentationDetails"],
  endpoints: (builder) => ({
    // Create presentation from template
    createFromTemplate: builder.mutation<Presentation, string>({
      query: (templateId) => ({
        url: `/template/${templateId}`,
        method: "POST",
      }),
      transformResponse: (resp: IResponse<Presentation>) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Failed to create presentation from template");
        }
        const presentation = resp.data;
        if (presentation.slides) {
          presentation.slides = presentation.slides.map((slide: any) => {
            const { meta, ...rest } = slide;
            return { ...rest, ...(meta || {}) };
          });
        }
        return presentation;
      },
      invalidatesTags: [{ type: "Presentations", id: "LIST" }],
    }),
    
    // Create new presentation from scratch or saved template
    createPresentation: builder.mutation<Presentation, Partial<Presentation>>({
      query: (presentationDto) => ({
        url: "/",
        method: "POST",
        body: presentationDto,
      }),
      transformResponse: (resp: IResponse<Presentation>) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Failed to create presentation");
        }
        const presentation = resp.data;
        if (presentation.slides) {
          presentation.slides = presentation.slides.map((slide: any) => {
            const { meta, ...rest } = slide;
            return { ...rest, ...(meta || {}) };
          });
        }
        return presentation;
      },
      invalidatesTags: [{ type: "Presentations", id: "LIST" }],
    }),
    
    // Generate presentation from AI
    generatePresentation: builder.mutation<Presentation, { prompt: string }>({
      query: (data) => ({
        url: "/generate",
        method: "POST",
        body: data,
      }),
      transformResponse: (resp: IResponse<Presentation>) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Failed to generate presentation");
        }
        const presentation = resp.data;
        if (presentation.slides) {
          presentation.slides = presentation.slides.map((slide: any) => {
            const { meta, ...rest } = slide;
            return { ...rest, ...(meta || {}) };
          });
        }
        return presentation;
      },
      invalidatesTags: [{ type: "Presentations", id: "LIST" }],
    }),

    // Update existing presentation
    updatePresentation: builder.mutation<Presentation, { id: string; data: Partial<Presentation> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (resp: IResponse<Presentation>) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Failed to update presentation");
        }
        const presentation = resp.data;
        if (presentation.slides) {
          presentation.slides = presentation.slides.map((slide: any) => {
            const { meta, ...rest } = slide;
            return { ...rest, ...(meta || {}) };
          });
        }
        return presentation;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Presentations", id: "LIST" },
        { type: "PresentationDetails", id }
      ],
    }),

    // Update presentation theme
    updatePresentationTheme: builder.mutation<Presentation, { id: string; theme: any }>({
      query: ({ id, theme }) => ({
        url: `/${id}/theme`,
        method: "PATCH",
        body: theme,
      }),
      transformResponse: (resp: IResponse<Presentation>) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Failed to update presentation theme");
        }
        return resp.data;
      },
      // Since we also update the store optimistically in presentationsSlice, we don't strictly need to invalidate, but it's safer.
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PresentationDetails", id }
      ],
    }),
    
    // Reorder slides
    reorderSlides: builder.mutation<Presentation, { id: string; slideIds: string[] }>({
      query: ({ id, slideIds }) => ({
        url: `/${id}/reorder`,
        method: "PATCH",
        body: { slideIds },
      }),
      transformResponse: (resp: IResponse<Presentation>) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Failed to reorder presentation slides");
        }
        return resp.data;
      },
      // Since we locally dispatch reorderSlides in Redux, invalidating isn't strictly necessary immediately, but good for sync.
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PresentationDetails", id }
      ],
    }),
    
    // Get all presentations
    getPresentations: builder.query<Presentation[], void>({
      query: () => "/",
      transformResponse: (resp: IResponse<Presentation[]>) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Failed to fetch presentations");
        }
        return resp.data.map(presentation => {
          if (presentation.slides) {
            presentation.slides = presentation.slides.map((slide: any) => {
              const { meta, ...rest } = slide;
              return { ...rest, ...(meta || {}) };
            });
          }
          return presentation;
        });
      },
      providesTags: [{ type: "Presentations", id: "LIST" }],
    }),

    // Get single presentation
    getPresentation: builder.query<Presentation, string>({
      query: (id) => `/${id}`,
      transformResponse: (resp: IResponse<Presentation>) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Failed to fetch presentation");
        }
        const presentation = resp.data;
        if (presentation.slides) {
          presentation.slides = presentation.slides.map((slide: any) => {
            const { meta, ...rest } = slide;
            return { ...rest, ...(meta || {}) };
          });
        }
        return presentation;
      },
      providesTags: (_result, _error, id) => [{ type: "PresentationDetails", id }],
    }),

    // Delete presentation
    deletePresentation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Presentations", id: "LIST" }],
    }),

    // Duplicate presentation
    duplicatePresentation: builder.mutation<Presentation, string>({
      query: (id) => ({
        url: `/${id}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Presentations", id: "LIST" }],
    }),
  }),
});

export const { 
  useCreateFromTemplateMutation, 
  useCreatePresentationMutation,
  useUpdatePresentationMutation,
  useUpdatePresentationThemeMutation,
  useGetPresentationsQuery,
  useGetPresentationQuery,
  useLazyGetPresentationQuery,
  useDeletePresentationMutation,
  useDuplicatePresentationMutation,
  useReorderSlidesMutation,
  useGeneratePresentationMutation,
} = presentationsApi;
export default presentationsApi;
