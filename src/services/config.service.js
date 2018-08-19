import ConfigRepository from '@/repositories/config.repository.js';

module.exports = {
  queryConfigs () {
    return ConfigRepository.queryConfigs();
  },

  updateConfigs (params) {
    return ConfigRepository.updateConfigs(params);
  },
};
