import _cloneDeep from 'lodash/cloneDeep';
import _get from 'lodash/get';
import _set from 'lodash/set';
import noop from 'lodash/noop';
import { enableES5, produce } from 'immer';
import { routerRedux } from 'dva/router';
import actionDefine from '../utils/actionDefine';
import { login, logout } from '../services/global';

//immer需要在ie11下启用这个，只在global里面运行一次就行
enableES5();

const namespace = 'global'; //只能是小写，下划线分割单词

const constants = [
  'SET_STATE',
  'RESET_STATE',
  'LOGIN',
  'SETUP',
  'GET_CURRENT_USER',
  'INITIALIZATION',
  'ERR_HANDLE',
];

const actionsNS = actionDefine(constants, namespace);
const actions = actionDefine(constants);

const { routerActions } = routerRedux;

const initialState = {
  user: null, // 用户信息，登录后请设置为对应的object
};

const model = {
  namespace,
  state: _cloneDeep(initialState),
  // reducers 用于处理同步流程
  reducers: {
    [actions.SET_STATE](state, action) {
      const { path, val } = action.payload;
      return produce(state, (nextState) => {
        _set(nextState, path, val);
      });
    },
    [actions.RESET_STATE]() {
      return _cloneDeep(initialState);
    },
  },
  // effects 用于处理涉及到异步的流程
  effects: {
    *[actions.LOGIN](action, { call, put }) {
      const { payload } = action;
      const { result } = yield call(login, payload);
      yield put.resolve({ type: actions.SETUP, payload: result });
    },
    *[actions.LOGOUT](action, { call, put, all }) {
      yield call(logout);
      // 登出成功后，清除token，返回login页，重置所有命名空间的状态。
      yield call([sessionStorage, 'removeItem'], 'token');
      yield put(routerActions.push('/login'));
      yield all([put.resolve({ type: actions.RESET_STATE })]);
    },
    *[actions.GET_CURRENT_USER](action, { call, put }) {
      // 获取用户信息
    },
    *[actions.SETUP](action, { put, call, select }) {
      // 登录成功后，拿到token了，要做的一堆事。
      // 譬如获取用户信息，跳转路由，获取页面数据等。
    },
    *[actions.INITIALIZATION](action, { put, call, select }) {
      // 在这里做一些初始化工作，主要用于页面刷新之后，发出一掉actions
      // 重新获取当前用户信息等，当前页面数据等
    },
    *[actions.ERR_HANDLE](action, { call, put }) {
      const { error, payload, meta: callback = noop } = action;
      if (error !== true) return;
      const errCode = _get(payload, ['response', 'status']);
      const title = _get(payload, ['response', 'data', 'message']);
      const result = _get(payload, ['response', 'data', 'result']);
      message.error(title, 3);
      switch (errCode) {
        // token/cookie过期了，重新登录
        case 401:
        case 403: {
          yield put({ type: actions.LOGOUT });
          break;
        }
        // 服务端验证，某个字段需要填写。
        case 417: {
          yield call(callback, result);
          break;
        }
      }
    },
  },
  subscriptions: {}, // 就是redux subscription
};

export { namespace, actionsNS as actions, model, model as default };
