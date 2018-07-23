import { get, post, } from '@/utils/httpHelper';
import getBaseUrl from '@/utils/baseUrlHelper';

module.exports = {
  async UserLogin (params) {
    const url = `${getBaseUrl()}/user/login`;
    const body = await post(url, params);
    return body.data;
  },
};
