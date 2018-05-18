const MoneyBox = artifacts.require("MoneyBox");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MoneyBox);
};

