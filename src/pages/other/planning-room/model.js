import { saveVideo, queryVideoList, queryVideo, deleteVideo ,queryCount} from './service';

export default {
  namespace: 'room',
  state: {
    listObj: {},
    resultList: {},
    resultVo: {},
    isLoading: false,
    countList:[]
  },
  effects: {
    *save({ payload }, { call, put }) {
      const response = yield call(saveVideo, payload);
      yield put({
        type: 'saveVideoObj',
        payload: response,
      });
    },
    *searchCount({ payload }, { call, put }) {
      const response = yield call(queryCount, payload);
      yield put({
        type: 'saveCount',
        payload: response,
      });
    },
    *fetchList(_, { call, put }) {
      const response = yield call(queryVideoList, _.payload);
      yield put({
        type: 'getVideoList',
        payload: response,
      });
    },
    *fetch(_, { call, put }) {
      const response = yield call(queryVideo, _.payload);
      yield put({
        type: 'getVideoObj',
        payload: response,
      });
    },
    *del(_, { call, put }) {
      const response = yield call(deleteVideo, _.payload);
      yield put({
        type: 'delVideo',
        payload: response,
      });
    },
  },
  reducers: {
    saveCount(state, action) {
      return { ...state, countList: action.payload || {} };
    },
    saveVideoObj(state, action) {
      return { ...state, listObj: action.payload || {} };
    },
    getVideoList(state, action) {
      return { ...state, resultList: action.payload || {} };
    },
    getVideoObj(state, action) {
      return { ...state, resultVo: action.payload || {} };
    },
    delVideo(state, action) {
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
