import { get, post, put, deleteMethod } from '@/utils/httpHelper';
import getBaseUrl from '@/utils/baseUrlHelper';

module.exports = {
  async addProduct (params) {
    const url = `${getBaseUrl()}/product/addProduct`;
    const body = await post(url, params);
    return body.data;
  },

  async queryProduct () {
    const url = `${getBaseUrl()}/product/normal`;
    const body = await get(url);
    return body.data;
  },

  async updateProduct (params) {
    const url = `${getBaseUrl()}/product/update`;
    const body = await put(url, params);
    return body.data;
  },

  async deleteProduct (params) {
    const url = `${getBaseUrl()}/product/delete`;
    const body = await deleteMethod(url, params);
    return body.data;
  },

  async searchProduct (params) {
    const url = `${getBaseUrl()}/product/search`;
    const body = await post(url, params);
    return body.data;
  },

};
