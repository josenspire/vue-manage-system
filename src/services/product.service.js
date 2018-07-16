import ProductRepository from '@/repositories/product.repository';

module.exports = {
  addProduct (params) {
    return ProductRepository.addProduct(params);
  },

  queryProduct () {
    return ProductRepository.queryProduct();
  },

  updateProduct (params) {
    return ProductRepository.updateProduct(params);
  },

  deleteProduct (params) {
    return ProductRepository.deleteProduct(params);
  },
};
