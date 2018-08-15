import ConfigRepository from '@/services/config.service';

module.exports = {
  queryConfigs () {
    return ConfigRepository.queryConfigs();
  },

  updateConfigs () {
    return ConfigRepository.updateConfigs(params);
  },
};
