import axios from "axios";
import type { AxiosInstance } from "axios";
import type { App } from "vue";

type ApiConfig = {
  baseURL: string;
  authBaseURL: string;
  publicBaseURL: string;
  accessToken: string | null;
};

export class Api {
  private axios: AxiosInstance;
  private axiosPublic: AxiosInstance;
  private baseURL: string;
  private authBaseURL: string;
  private publicBaseURL: string;
  private accessToken: string | null;

  constructor({ baseURL, accessToken, authBaseURL, publicBaseURL }: ApiConfig) {
    this.baseURL = baseURL;
    this.authBaseURL = authBaseURL;
    this.publicBaseURL = publicBaseURL;
    try{
      this.accessToken = accessToken ?? localStorage?.getItem("access-token");
    } catch (e) {
      this.accessToken = null;
    }
    this.axios = axios.create({ baseURL });
    this.axios.interceptors.request.use(({ headers = {}, ...config }) => ({
      ...config,
      headers: { ...headers, ["access-token"]: this.accessToken },
    }));
    this.axiosPublic = axios.create({ baseURL: publicBaseURL });
    this.testConnection().catch(() => {
      this.accessToken = null;
      localStorage.removeItem("access-token");
    });
  }

  async auth({ code, state }: { code: string; state: string }) {
    const tokens = (await axios.post(`${this.authBaseURL}`, { code, state }))
      ?.data;
    if (tokens.accessToken) {
      this.accessToken = tokens.accessToken as string;
      localStorage.setItem("access-token", this.accessToken);
      return tokens;
    }
    throw "got no access token from spotify :/";
  }

  isAuthorized() {
    return !!this.accessToken;
  }

  async testConnection() {
    return (await this.axios.get(`/test`))?.data;
  }
  async getRole() {
    return (await this.axios.get(`/me/role`))?.data;
  }
  async getCurrentlyPlaying() {
    return (await this.axios.get(`/me/currentlyPlaying`))?.data;
  }

  async getUserInfo(userId: string) {
    return (await this.axiosPublic.get(`/users/${userId}/info`))?.data;
  }

  async getSession() {
    return (await this.axios.get(`/session`))?.data;
  }
  async createSession() {
    return (await this.axios.post(`/session`))?.data;
  }
  async deleteSession() {
    return (await this.axios.delete(`/session`))?.data;
  }
  async joinSession(hostId: string) {
    return (await this.axios.post(`/session/join`, { hostId }))?.data;
  }
  async leaveSession() {
    return (await this.axios.post(`/session/leave`))?.data;
  }
}

let api = null as Api | null;

export const useApi = () => api;

export const createApi = (vue: App, config: ApiConfig) => {
  api = new Api(config);
  vue.config.globalProperties.$api = api;
};
