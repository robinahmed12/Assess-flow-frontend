import { ofetch } from "ofetch";
import { apiConfig } from "./api-config";

export interface ApiErrorResponse {
  success: false;
  message: string;
  stack?: string;
}

export const apiClient = ofetch.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,

  onResponseError({ response }) {
    const data = response._data as Partial<ApiErrorResponse> | undefined;


    throw new Error(
      data?.message || "Something went wrong. Please try again."
    );
  },
});