import { get, post, } from '@/utils/httpHelper';
import getBaseUrl from '@/utils/baseUrlHelper';

module.exports = {
  async queryAllOrders () {
    const url = `${getBaseUrl()}/order/all`;
    const body = await get(url);
    return body.data;
  },

  async querySpecialOrders (params) {
    const url = `${getBaseUrl()}/order/special`;
    const body = await post(url, params);
    return body.data;
  },

  async searchOrders (params) {
    const url = `${getBaseUrl()}/order/search`;
    const body = await post(url, params);
    return body.data;
  },
};
