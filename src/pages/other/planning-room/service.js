import request from '@/utils/request';
import { RestUrl } from '../../../const/localConfig';

/**
 * 保存工作信息
 * @param id =0 代表新增，其它数值代表修改该信息
 * @returns {Promise<void>}
 */
const url = "http://39.107.72.184/bmicpd/api/";
export async function saveVideo(params) {
  return request(`${RestUrl}/room/save`, {
    mode: 'cors',
    method: 'post',
    data: params,
    requestType: 'form',
  });
}

export async function queryVideoList(params) {
  return request(`${RestUrl}/room/getList`, {
    mode: 'cors',
    method: 'post',
    data: params,
    requestType: 'form',
  });
}

export async function queryVideo(payload) {
  return request(`${RestUrl}/room/get/${payload.key}`, {
    mode: 'cors',
  });
}

export async function deleteVideo(payload) {
  return request(`${RestUrl}/room/delete/${payload.key}`, {
    mode: 'cors',
  });
}
export async function queryCount(params) {
  return request(`${url}/query`, {
    mode: 'cors',
    method: 'post',
    data: params,
    requestType: 'form',
  });
}
