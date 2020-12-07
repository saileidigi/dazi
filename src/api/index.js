import notification from "ant-design-vue/lib/notification";
import createRequest from "@/utils/request";
import { getToken, setToken } from "@/utils/token";

export const request = createRequest({
  baseURL: "https://system-api.oos.saileidigi.cn"
});

export const login = () => {
  const token = getToken();

  return token
    ? Promise.resolve(token)
    : request
        .post("/login", {
          sid: 2,
          h: "5d53b127a2d418887a52d659c318a90e"
        })
        .then(setToken);
};

const query = async (type, data) => {
  !getToken() && (await login());

  if (!getToken()) {
    notification.error({
      message: "受权失败"
    });

    return Promise.reject("受权失败");
  }

  return request.post("query/" + type, data);
};

export const queryAll = data => query("all", data);

// export const queryList = data => query("list", data);
