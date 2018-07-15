import ProductService from '@/repositories/product.repository';

module.exports = {
  async addProduct (params) {
    return ProductService.addProduct(params);
  },

  async queryProduct () {
    return ProductService.queryProduct();
  },
};
