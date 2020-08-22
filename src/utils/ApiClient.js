import axios from 'axios';
import _has from 'lodash/has';
import _set from 'lodash/set';
import _get from 'lodash/get';

const reqConfig = {
  withCredentials: true,
};

function setInPath(obj, path, val) {
  if (!_has(obj, path)) {
    _set(obj, path, val);
  }
}
// 心跳包加特殊header，这里假设为hb
function heartbeat(config) {
  const hbPath = ['headers', 'hb'];
  setInPath(config, hbPath, true);
  return config;
}

function defaultHeaders(config) {
  // token存放在sessionStorage中，页面之间不共享
  const token = sessionStorage.getItem('token');
  const accept = 'application/json';
  // 语言设定存在localStorage，global.model可以从这儿初始化语言配置
  const lang = localStorage.getItem('language') || 'zh-cn';

  if (token) {
    setInPath(config, ['headers', 'Authorization'], token);
  }
  setInPath(config, ['headers', 'Accept'], accept);
  setInPath(config, ['headers', 'Accept-Language'], lang);

  return config;
}

// response interceptor
// 2xx系的json响应，去掉res包装，直接把data甩出去
function extract(res) {
  const jsonType = 'application/json';
  const contentType = _get(res, ['headers', 'content-type'], '');
  if (contentType.includes(jsonType)) return _get(res, ['data'], {});
  return res;
}

// 用户行为发出的请求使用这个，表示用户还在操作
const clientWithHeartBeat = axios.create(reqConfig);

// 非用户行为产生的请求用这个，譬如状态轮询。表示是自动行为，不影响用户超时不操作后的自动登出。
const clientWithoutHeartBeat = axios.create(reqConfig);

clientWithoutHeartBeat.interceptors.request.use(defaultHeaders);
clientWithoutHeartBeat.interceptors.response.use(extract);

clientWithHeartBeat.interceptors.request.use(defaultHeaders);
clientWithHeartBeat.interceptors.request.use(heartbeat);
clientWithHeartBeat.interceptors.response.use(extract);

export { clientWithoutHeartBeat as clientNoHB, clientWithHeartBeat as client };
export default clientWithHeartBeat;
