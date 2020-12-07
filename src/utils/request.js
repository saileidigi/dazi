import axios from "axios";
import message from "ant-design-vue/lib/message";
import { getToken } from "./token";

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
      message.error({
        content: error.message
      });
      return Promise.reject(error);
    }
  );

  // 拦截回应
  instance.interceptors.response.use(
    response => response.data,
    error => {
      message.error({
        content: (error.response && error.response.data) || error.message
      });

      return Promise.reject(error);
    }
  );

  return instance;
};
