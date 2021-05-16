const IF = artifacts.require('InsuranceFarm');

module.exports = async function(callback) {

    let insurfarm = await IF.deployed()

    await insurfarm.issueToken(100)
    

    console.log('token issued')
    callback()
}