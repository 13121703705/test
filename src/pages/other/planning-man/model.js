import { saveDutyUser, queryDutyUserList, queryDutyUser, deleteDutyUser } from './service';

export default {
  namespace: 'dutyuser',
  state: {
    listObj: {},
    resultList: {},
    resultVo: {},
    province: [],
    city: [],
    isLoading: false,
  },
  effects: {
    *save({ payload }, { call, put }) {
      const response = yield call(saveDutyUser, payload);
      yield put({
        type: 'saveDutyUser',
        payload: response,
      });
    },
    *fetchList(_, { call, put }) {
      const response = yield call(queryDutyUserList, _.payload);
      yield put({
        type: 'getDutyUserObj',
        payload: response,
      });
    },
    *fetch(_, { call, put }) {
      const response = yield call(queryDutyUser, _.payload);
      yield put({
        type: 'getDutyUser',
        payload: response,
      });
    },
    *del(_, { call, put }) {
      const response = yield call(deleteDutyUser, _.payload);
      yield put({
        type: 'delDutyUser',
        payload: response,
      });
    },
  },
  reducers: {
    saveDutyUser(state, action) {
      return { ...state, resultVo: action.payload || {} };
    },
    getDutyUserObj(state, action) {
      return { ...state, resultList: action.payload || {} };
    },
    getDutyUser(state, action) {
      return { ...state, resultVo: action.payload || {} };
    },
    delDutyUser(state, action) {
      return { ...state, resultVo: action.payload || {} };
    },
    changeLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
  },
};
