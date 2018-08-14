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

  async confirmDeviver (params) {
    const url = `${getBaseUrl()}/order/deviver`;
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
