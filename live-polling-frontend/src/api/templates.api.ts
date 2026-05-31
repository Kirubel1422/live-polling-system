import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type IResponse } from "@/types/response.types";
import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

export interface Template {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  slides: any[];
}

const templatesApi = createApi({
  reducerPath: "templatesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL + "/templates",
    credentials: "include",
  }),
  tagTypes: ["Templates"],
  endpoints: (builder) => ({
    getTemplates: builder.query<Template[], void>({
      query: () => "/",
      transformResponse: (resp: IResponse<Template[]>) => {
        if (!resp.success || !resp.data) {
          throw new Error(resp.message || "Failed to fetch templates");
        }
        const templates = resp.data;
        return templates.map(template => {
          if (template.slides) {
            template.slides = template.slides.map((slide: any) => {
              const { meta, ...rest } = slide;
              return { ...rest, ...(meta || {}) };
            });
          }
          return template;
        });
      },
      providesTags: ["Templates"],
    }),
  }),
});

export const { useGetTemplatesQuery } = templatesApi;
export default templatesApi;
