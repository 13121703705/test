import { saveSubject, querySubjectList,
  querySubject, setSubjectPublish,
  deleteSubject, deleteAltern,
  getJB, queryNotifyUser, extExcel, setWechat, queryNotityList,
  setNotifyAgree, sendNotifyMsg } from '@/services/subject';

export default {
  namespace: 'subject',
  state: {
    listObj: {},
    subjectList: {},
    workInfo: {},
    resultVo: {},
    baseTable: [],
    notifyUser: [],
    excelObj: {},
  },
  effects: {
    *save({ payload }, { call, put }) {
      const response = yield call(saveSubject, payload);
      yield put({
        type: 'saveSubjectObj',
        payload: response,
      });
    },
    *getSubjectList(_, { call, put }) {
      const response = yield call(querySubjectList, _.payload);
      yield put({
        type: 'getSubjectListObj',
        payload: response,
      });
    },
    *getNotifyList(_, { call, put }) {
      const response = yield call(queryNotityList, _.payload);
      yield put({
        type: 'getNotifyListObj',
        payload: response,
      });
    },
    *getSubject(_, { call, put }) {
      const response = yield call(querySubject, _.payload);
      yield put({
        type: 'getSubjectObj',
        payload: response,
      });
    },
    *sendMsg(_, { call, put }) {
      const response = yield call(sendNotifyMsg, _.payload);
      yield put({
        type: 'sendObj',
        payload: response,
      });
    },
    *setAgree(_, { call, put }) {
      const response = yield call(setNotifyAgree, _.payload);
      yield put({
        type: 'setAgreeObj',
        payload: response,
      });
    },
    *setPublish(_, { call, put }) {
      const response = yield call(setSubjectPublish, _.payload);
      yield put({
        type: 'setWorkInfoObj',
        payload: response,
      });
    },
    *setTrustwechat(_, { call, put }) {
      const response = yield call(setWechat, _.payload);
      yield put({
        type: 'setWechatObj',
        payload: response,
      });
    },
    *delSubject(_, { call, put }) {
      const response = yield call(deleteSubject, _.payload);
      yield put({
        type: 'delSubjectObj',
        payload: response,
      });
    },
    *removeAltern(_, { call, put }) {
      const response = yield call(deleteAltern, _.payload);
      yield put({
        type: 'delAlternObj',
        payload: response,
      });
    },
    *getJb(_, { call, put }) {
      const response = yield call(getJB, _.payload);
      yield put({
        type: 'getJbObj',
        payload: response,
      });
    },
    *getNotifyUser({ payload }, { call, put }) {
      const response = yield call(queryNotifyUser, payload);
      yield put({
        type: 'setNotifyUser',
        payload: response,
      });
    },
    *excel({ payload }, { call, put }) {
      const response = yield call(extExcel, payload);
      yield put({
        type: 'setExcel',
        payload: response,
      });
    },
  },
  reducers: {
    saveSubjectObj(state, action) {
      return { ...state, listObj: action.payload || {} };
    },
    getSubjectListObj(state, action) {
      return { ...state, subjectList: action.payload || {} };
    },
    getNotifyListObj(state, action) {
      return { ...state, resultVo: action.payload || {} };
    },
    getSubjectObj(state, action) {
      return { ...state, workInfo: action.payload || {} };
    },
    setWorkInfoObj(state, action) {
      return { ...state, resultVo: action.payload || {} };
    },
    setAgreeObj(state, action) {
      return { ...state, resultVo: action.payload || {} };
    },
    setWechatObj(state, action) {
      return { ...state, resultVo: action.payload || {} };
    },
    delSubjectObj(state, action) {
      return { ...state, resultVo: action.payload || {} };
    },
    sendObj(state, action) {
      return { ...state, resultVo: action.payload || {} };
    },
    delAlternObj(state, action) {
      return { ...state, resultVo: action.payload || {} };
    },
    getJbObj(state, action) {
      return { ...state, baseTable: action.payload || [] };
    },
    setNotifyUser(state, action) {
      return { ...state, notifyUser: action.payload || [] };
    },
    setExcel(state, action) {
      return { ...state, excelObj: action.payload || {} };
    },
  },
};
