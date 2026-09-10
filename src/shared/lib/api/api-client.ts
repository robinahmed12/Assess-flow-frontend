import {ofetch} from "ofetch"; import {apiConfig} from "./api-config";
export const apiClient=ofetch.create({baseURL:apiConfig.baseURL,timeout:apiConfig.timeout});
