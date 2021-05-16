const TokenFarm = artifacts.require("TokenFarm");
const DappToken = artifacts.require("DappToken");
const DaoToken = artifacts.require("DaoToken");
const DaiToken = artifacts.require("DaiToken");
const DoppToken = artifacts.require("DoppToken");
const InsuranceFarm = artifacts.require("InsuranceFarm");




module.exports =  async function(deployer, network, accounts) {
  
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  await deployer.deploy(DaoToken)
  const daoToken = await DaoToken.deployed()

  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()

  await deployer.deploy(DoppToken)
  const doppToken = await DoppToken.deployed()

  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address, daoToken.address,doppToken.address)
  const tokenFarm = await TokenFarm.deployed()

  await deployer.deploy(DaiToken)
  const daiToken2 = await DaiToken.deployed()

  await deployer.deploy(DappToken)
  const dappToken2 = await DappToken.deployed()

  await deployer.deploy(InsuranceFarm,dappToken.address,daiToken.address,tokenFarm.address)
  const insuranceFarm = await InsuranceFarm.deployed()

  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000') 

  await daoToken.transfer(accounts[1],'100000000000000000000')

  await daiToken.transfer(accounts[1], '100000000000000000000')

  await dappToken2.transfer(tokenFarm.address, '1000000000000000000000000') 

  await daiToken2.transfer(accounts[1], '100000000000000000000')



};

