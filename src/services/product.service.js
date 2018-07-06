import { addProduct } from '@/repositories/product.repository';

module.exports = {
  async addProduct (params) {
    return addProduct(params);
  },
};
