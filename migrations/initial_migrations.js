const ProductManager = artifacts.require("ProductManager");

module.exports = function (deployer) {
  deployer.deploy(ProductManager);
};

