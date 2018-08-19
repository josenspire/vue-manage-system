import {post, put} from '@/utils/httpHelper';
import getBaseUrl from '@/utils/baseUrlHelper';

module.exports = {
  async queryConfigs () {
    const url = `${getBaseUrl()}/config/commission`;
    const body = await post(url);
    return body.data;
  },

  async updateConfigs (params) {
    const url = `${getBaseUrl()}/config/update`;
    const body = await put(url, params);
    return body.data;
  },
};
