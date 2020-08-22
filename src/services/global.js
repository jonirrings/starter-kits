import client from '../utils/ApiClient';

const v1Prefix = '/api/v1';

export const urls = {
  login: `${v1Prefix}/login`,
  logout: `${v1Prefix}/logout`,
};

export function login({ username, password }) {
  return client.post(urls.login, { username, password });
}
//一般登出是带着token/cookie发个请求就能在服务端清除token/cookie的有效性，所以不需要参数
export function logout() {
  return client.post(urls.logout);
}
