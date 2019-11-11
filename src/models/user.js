import { queryCurrent,changPwd, query as queryUsers } from '@/services/user';
import { queryList } from '../services/api';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    statusFlag:{},
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *change({ payload }, { call, put }) {
      const response = yield call(changPwd, payload);
      yield put({
        type: 'status',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
    status(state, action) {return {
      ...state,
      statusFlag: action.payload|| {}
    };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
