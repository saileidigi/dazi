import axios from "axios";
import { getToken } from "./token";

let NetworkErrorShowed = false;

/**
 * 创建 AxiosInstance
 * @param {Object} config - AxiosRequestConfig
 * @returns {Object} 返回 AxiosInstance
 */
export default config => {
  const instance = axios.create(config);

  // 拦截请求
  instance.interceptors.request.use(
    config => {
      config.headers.auth = config.url === "/login" ? "visitor" : getToken();
      return config;
    },
    error => {
      // 提示错误
      window.antd.notification.error({
        message: error.message
      });
      return Promise.reject(error);
    }
  );

  // 拦截回应
  instance.interceptors.response.use(
    response => response.data,
    error => {
      // 提示错误
      if (error.message === "Network Error") {
        if (NetworkErrorShowed) return Promise.reject(error);

        NetworkErrorShowed = true;
      }

      window.antd.notification.error({
        message: (error.response && error.response.status) || error.message,
        description: error.response && error.response.data
      });

      return Promise.reject(error);
    }
  );

  return instance;
};
