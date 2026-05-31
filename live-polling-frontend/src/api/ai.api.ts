import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type Presentation } from "@/types/presentation";
import { ENV } from "@/config/env";

const API_URL = ENV.API_URL;

export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    enhancePresentation: builder.mutation<Presentation, { 
      presentationId: string; 
      prompt: string; 
      presentationData: any;
      onReasoningChunk?: (chunk: string) => void;
    }>({
      queryFn: async ({ presentationId, prompt, presentationData, onReasoningChunk }) => {
        try {
          const response = await fetch(`${API_URL}/presentations/${presentationId}/enhance`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ prompt, presentationData }),
          });

          if (!response.ok) {
            const errText = await response.text();
            return { error: { status: response.status, data: errText } };
          }

          const reader = response.body?.getReader();
          if (!reader) {
            return { error: { status: 'FETCH_ERROR', error: 'No response body stream' } };
          }
          
          const decoder = new TextDecoder("utf-8");
          let currentReasoning = "";
          let newPresentation = null;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter(l => l.trim() !== "");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.substring(6));
                  if (data.type === "reasoning") {
                    currentReasoning += data.text;
                    if (onReasoningChunk) {
                      onReasoningChunk(currentReasoning);
                    }
                  } else if (data.type === "presentation") {
                    newPresentation = data.data;
                  } else if (data.type === "error") {
                    return { error: { status: 'CUSTOM_ERROR', error: data.message } };
                  }
                } catch (e) {
                  // Ignore incomplete JSON chunks
                }
              }
            }
          }
          
          if (!newPresentation) {
             return { error: { status: 'CUSTOM_ERROR', error: 'No presentation data returned' } };
          }

          return { data: newPresentation as Presentation };
        } catch (error: any) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
    }),
  }),
});

export const { useEnhancePresentationMutation } = aiApi;
export default aiApi;
