import axios from "axios";
import { ENDPOINTS } from "../utils/constants";

export async function login(email: string, password: string) {
  return axios.post(ENDPOINTS.LOGIN, { email, password });
}
