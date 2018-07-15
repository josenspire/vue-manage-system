import { get, post } from '@/utils/httpHelper';
import getBaseUrl from '@/utils/baseUrlHelper';

module.exports = {
  async addProduct (params) {
    const url = `${getBaseUrl()}/product/addProduct`;
    const body = await post(url, params);
    return body.data;
  },

  async queryProduct () {
    const url = `${getBaseUrl()}/product/normal`;
    console.log(url);
    const body = await get(url);
    return body.data;
  },
};
