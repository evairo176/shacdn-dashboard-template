import environment from "@/config/environment";
import axios from "axios";

import { Session } from "next-auth";

const headers = {};
export interface CustomSession extends Session {
  accessToken?: string;
}

const instance = axios.create({
  baseURL: environment.API_URL,
  headers: {
    "Content-Type": "application/json",
    ...headers,
  },
  timeout: 60 * 1000,
});

export default instance;
