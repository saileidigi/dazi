const TOKEN_KEY = "token_s_2";

// 获取 token 的内容
export const getTokenPayload = token => {
  let payload = {};
  try {
    payload = JSON.parse(atob((token + "").replace(/(.+)\..+/, "$1")));
  } catch (err) {
    window.console.error(err);
  }
  return payload;
};

// 验证 token
export const verifyToken = token => {
  const payload = getTokenPayload(token);
  if (!payload.exp || payload.sid !== 2) return false;
  // 提前1800秒结束
  return payload.exp > new Date() / 1000 + 1800;
};

// 获取 token
export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  return !token || !verifyToken(token) ? "" : token;
};

// 设置 token
export const setToken = token => {
  if (!verifyToken(token)) return false;

  localStorage.setItem(TOKEN_KEY, token);
  return true;
};
