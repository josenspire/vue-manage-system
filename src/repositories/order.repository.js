import { get, post, } from '@/utils/httpHelper';
import getBaseUrl from '@/utils/baseUrlHelper';

module.exports = {
  async queryAllOrders () {
    const url = `${getBaseUrl()}/order/all`;
    const body = await post(url);
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

  async confirmDeliver (params) {
    const url = `${getBaseUrl()}/order/deliver`;
    const body = await post(url, params);
    return body.data;
  },
  async completeOrder (params) {
    const url = `${getBaseUrl()}/order/complete`;
    const body = await post(url, params);
    return body.data;
  },
  async cancelOrder (params) {
    const url = `${getBaseUrl()}/order/cancel`;
    const body = await post(url, params);
    return body.data;
  },
};
