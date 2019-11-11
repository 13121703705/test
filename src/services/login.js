import request from '@/utils/request';
import { RestUrl } from '../const/localConfig';

export async function fakeAccountLogin(params) {
  const { type, password, userName } = params;
  const data = {
    type,
    password,
    userName: userName.trim(),
  }
  return request(`${RestUrl}/user/login`, {
    mode: 'cors',
    method: 'POST',
    data,
    requestType: 'form',
  });
}
