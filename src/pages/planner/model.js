import { saveDutyUser, queryDutyUserList, queryDutyUser, deleteDutyUser,delBySql,querySty } from './service';

export default {
  namespace: 'dutyuser',
  state: {
    listObj: {},
    resultList: {},
    resultVo: {},
    province: [],
    city: [],
    isLoading: false,
    styList:{},
    userList:{},
    countList:{}
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
    *updateSql(_, { call, put }) {
      const response = yield call(delBySql, _.payload);
      yield put({
        type: 'saveDutyUser',
        payload: response,
      });
    },
    *seachSty(_, { call, put }) {
      const response = yield call(querySty, _.payload);
      yield put({
        type: 'saveSty',
        payload: response,
      });
    },
    *seachUser(_, { call, put }) {
      const response = yield call(querySty, _.payload);
      yield put({
        type: 'saveUser',
        payload: response,
      });
    },
    *seachCount(_, { call, put }) {
      const response = yield call(querySty, _.payload);
      yield put({
        type: 'saveCount',
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
    saveUser(state, action) {
      return { ...state, userList: action.payload || {} };
    },
    saveCount(state, action) {
      return { ...state, countList: action.payload || {} };
    },
    saveSty(state, action) {
      return { ...state, styList: action.payload || {} };
    },
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
