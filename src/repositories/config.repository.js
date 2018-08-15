import {get, put} from '@/utils/httpHelper';
import getBaseUrl from '@/utils/baseUrlHelper';

module.exports = {
  async queryConfig () {
    const url = `${getBaseUrl()}/config/commission`;
    const body = await get(url);
    return body.data;
  },

  async updateConfigs (params) {
    const url = `${getBaseUrl()}/config/update`;
    const body = await put(url, params);
    return body.data;
  },
};
