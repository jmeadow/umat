const UMAT = artifacts.require("UMAT");

module.exports = function (deployer) {
  deployer.deploy(UMAT, "0xf17f52151EbEF6C7334FAD080c5704D77216b732"); // hardcoded based on tests
};
