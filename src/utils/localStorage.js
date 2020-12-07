/**
 * 保存 localStorage
 * @param {string} key
 * @param {any} value - 为对象时，会经过 JSON.stringify 转字符串
 */
export const setLocalStorageItem = (key, value) => {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }

  localStorage.setItem(key, value);
};

/**
 * 读取 localStorage
 * @param {string} key
 * @returns {any} 值会经过 JSON.parse 解析
 */
export const getLocalStorageItem = key => {
  let value = localStorage.getItem(key);
  try {
    value = JSON.parse(value);
  } catch (err) {
    // no todo
  }

  return value;
};
