import { queryList,queryById,createBean,updateBean,deleteBean } from '../services/feedbackapi';

export default {
  namespace: 'feedbackmodel',

  state: {
    subjectList: [],
    subjectBean:{},
    backBean:{},
    backIds:{}
  },

  effects: {

    *fetch({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
      yield put({
        type: 'queryAll',
        payload: response,
      });
    },
    *insertBack({ payload }, { call, put }) {
      const response = yield call(createBean, payload);
      yield put({
        type: 'insertBean',
        payload: response,
      });
    },
    *queryBack({ payload }, { call, put }) {
      const response = yield call(createBean, payload);
      yield put({
        type: 'insertBean',
        payload: response,
      });
    },
    *queryIDs({ payload }, { call, put }) {
      const response = yield call(createBean, payload);
      yield put({
        type: 'queryBack',
        payload: response,
      });
    },
    *queryById({ payload }, { call, put }) {
      const response = yield call(queryById, payload);
      yield put({
        type: 'queryBean',
        payload: response,
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(createBean, payload);
      yield put({
        type: 'addBean',
        payload: response,
      });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(updateBean, payload);
      yield put({
        type: 'updateModel',
        payload: response,
      });
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(deleteBean, payload);
      yield put({
        type: 'delModel',
        payload: response,
      });
    },


  },
  reducers: {
    queryAll(state, action) {return {
        ...state,
      subjectList: action.payload|| {}
      };
    },

    queryBean(state, action) {return {
      ...state,
      subjectBean: action.payload|| {}
    };
    },
    queryBack(state, action) {return {
      ...state,
      backIds: action.payload|| {}
    };
    },
    insertBean(state, action) {return {
      ...state,
      backBean: action.payload|| {}
    };
    },
    addBean(state, action) {return {
      ...state,
      subjectBean: action.payload|| {}
    };
    },
    updateModel(state, action) {return {
      ...state,
      subjectBean: action.payload|| {}
    };
    },
    delModel(state, action) {return {
      ...state,
      subjectBean: action.payload|| {}
    };
    },
  },
};
