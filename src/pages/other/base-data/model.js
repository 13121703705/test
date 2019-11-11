import { saveObj, queryList, queryObj, deleteObj } from './service';

export default {
  namespace: 'base',
  state: {
    resultList: {},
    resultVo: {},
    isLoading: false,
  },
  effects: {
    *save({ payload }, { call, put }) {
      const response = yield call(saveObj, payload);
      yield put({
        type: 'saveSingleObj',
        payload: response,
      });
    },
    *fetchList(_, { call, put }) {
      const response = yield call(queryList);
      yield put({
        type: 'getObjList',
        payload: response,
      });
    },
    *fetch(_, { call, put }) {
      const response = yield call(queryObj, _.payload);
      yield put({
        type: 'getObj',
        payload: response,
      });
    },
    *del(_, { call, put }) {
      const response = yield call(deleteObj, _.payload);
      yield put({
        type: 'delObj',
        payload: response,
      });
    },
  },
  reducers: {
    saveSingleObj(state, action) {
      return { ...state, resultVo: action.payload || {} };
    },
    getObjList(state, action) {
      return { ...state, resultList: action.payload || {} };
    },
    getObj(state, action) {
      return { ...state, resultVo: action.payload || {} };
    },
    delObj(state, action) {
      return { ...state, resultVo: action.payload || {} };
    },
  },
};
