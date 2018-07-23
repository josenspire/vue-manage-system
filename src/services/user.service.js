import UserRepository from '@/repositories/user.repository';

module.exports = {
  UserLogin (params) {
    return UserRepository.UserLogin(params);
  },
};
