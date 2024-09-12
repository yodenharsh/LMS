import axios from "axios"
import appConfig from "./appConfig"

export const authService = axios.create({
  baseURL: appConfig.authBaseUrl,
})
