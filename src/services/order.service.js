import OrderRepository from '@/repositories/order.repository';

module.exports = {
  queryAllOrders () {
    return OrderRepository.queryAllOrders();
  },

  querySpecialOrders (params) {
    return OrderRepository.querySpecialOrders(params);
  },

  searchOrders (params) {
    return OrderRepository.searchOrders(params);
  },

  confirmDeliver (params) {
    return OrderRepository.confirmDeliver(params);
  },
  completeOrder (params) {
    return OrderRepository.completeOrder(params);
  },
  cancelOrder (params) {
    return OrderRepository.cancelOrder(params);
  },
};
