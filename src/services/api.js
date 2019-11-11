import { stringify } from 'qs';
import request from '../utils/request';

const url = "http://39.107.72.184/bmicpd/api/";

export async function queryList(params) {
  return request(`${url}/query`,{
    mode: 'cors',
    method: 'POST',
    requestType: 'form',
    data:params
  });
  // return request(`${url}`,{
  //   method: 'POST'
  // });
}
export async function queryById(params) {
  return request(`${url}/query`,{
    mode: 'cors',
    method: 'POST',
    data:params,
    requestType: 'form'
  });
}

export async function createBean(params) {
  return request(`${url}/query`,{
    mode: 'cors',
    method: 'POST',
    data:params,
    requestType: 'form',
  });
}

export async function updateBean(params) {
  return request(`${url}/query`,{
    mode: 'cors',
    method: 'POST',
    data:params,
    requestType: 'form',
  });
}

export async function deleteBean(params) {
  return request(`${url}/query`,{
    mode: 'cors',
    method: 'POST',
    data:params,
    requestType: 'form',
  });
}
export async function queryMoulds(params) {
  return request(`${url}/mouldnode/lists`,{
    method: 'POST',
    data:params,
    requestType: 'form',
  });
}

