import { ofetch } from "ofetch";
import { apiConfig } from "./api-config";
import Cookies from "js-cookie";

export interface ApiErrorResponse {
  success: false;
  message: string;
  stack?: string;
}

export const apiClient = ofetch.create({
  baseURL: apiConfig.baseURL,

  timeout: apiConfig.timeout,

  onRequest({ options }) {
    const token = Cookies.get("accessToken");

    if (token) {
      if (options.headers instanceof Headers) {
        options.headers.set("Authorization", `Bearer ${token}`);
      } else {
        options.headers = new Headers(options.headers as HeadersInit);
        options.headers.set("Authorization", `Bearer ${token}`);
      }
    }
  },

  onResponseError({ response }) {
    const data = response._data as Partial<ApiErrorResponse> | undefined;

    throw new Error(data?.message || "Something went wrong. Please try again.");
  },
});
