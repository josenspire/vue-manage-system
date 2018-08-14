module.exports = {

  orderTabMapping(type) {
    const statusValues = ['全部', '待付款', '进行中', '退款中', '已完成', '订单已关闭'];
    return statusValues[type];
  },

  orderValueMapping(index) {
    const valueMapping = { 0: 'ALL', 1: 'UNPAY', 2: 'UNDERWAY', 3: 'REFUND', 4: 'COMPLETED', 5: 'CANCEL' };
    return valueMapping[index];
  },

  orderStatusMapping(status) {
    const ORDER_STATUS_MAPPING = { ALL: 0, UNPAY: 1, UNDERWAY: 2, REFUND: 3, COMPLETED: 4, CANCEL: 5 };
    return ORDER_STATUS_MAPPING[status];
  },

};