const TOKEN_KEY = "token";

export const getTokenPayload = token => {
  let payload = {};
  try {
    payload = JSON.parse(atob((token + "").replace(/(.+)\..+/, "$1")));
  } catch (err) {
    window.console.error(err);
  }
  return payload;
};

export const verifyToken = token => {
  const payload = getTokenPayload(token);
  if (!payload.exp || payload.sid !== 2) return false;
  return payload.exp > new Date() / 1000 + 1800;
};

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  return !token || !verifyToken(token) ? "" : token;
};

export const setToken = token => {
  if (!verifyToken(token)) return false;

  localStorage.setItem(TOKEN_KEY, token);
  return true;
};
