import React, { Component } from 'react'
import Navbar from './Navbar'
import './App.css'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Main from './Main'



class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
    
  }

  async loadBlockchainData(){
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    console.log(accounts)
    console.log(networkId)



    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData){
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString() })
      console.log(daiTokenBalance)
    } else {
      window.alert('DaiToken contract not deployed to detected network')
    }
  
    const dappTokenData = DappToken.networks[networkId]
    if(dappTokenData) {
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
      this.setState({ dappToken })
      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
      this.setState({ dappTokenBalance: dappTokenBalance.toString() })
      console.log(dappTokenBalance)
    }else{
      window.alert('dappTokenBalance contract not deployed to detected network')
    }

    const tokenFarmData = TokenFarm.networks[networkId]
    if(tokenFarmData){
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      this.setState({ tokenFarm })
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString() })
      // console.log(dappTokenBalance)
    } else {
      window.alert('TokenFarm contract not deployed to detected network')
    }

      this.setState({ loading: false })

  }


  stakeToken = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash',(hash) => {
      this.state.tokenFarm.methods.stakeToken(amount).send({ from: this.state.account }).on('transactionHash',(hash) => {
        this.setState({ loading: false })
      })
    })
  }


  untakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.untakeTokens().send({ from: this.state.account }).on('transaction',(hash) => {
      this.setState({ loading:false })
    })
  }
        
  

  
  

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken:{},
      dappToken:{},
      tokenFarm:{},
      daiTokenBalance:'0',
      dappTokenBalance:'0',
      stakingBalance:'0',
      loading:true
    }
  }


  async loadWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }else if (window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }else{
      window.alert('non-ethereum browser detected. you should consider trying metamask')
    }
  }


  render() {
      let content
      if(this.state.loading){
        content = <p id='loader' className='text-center'>Loading</p>
      }else{
        content=<Main 
        daiTokenBalance={this.state.daiTokenBalance}
        dappTokenBalance={this.state.dappTokenBalance}
        stakingBalance={this.state.stakingBalance}
        stakeToken={this.stakeToken}
        untakeTokens={this.untakeTokens}
        />
      }
       

    return (
      <div>
       
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                { content }

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

0x5d2389ACa52f37385aD92eAEEa3B95F56C13390f

0xa2005D68629d370AFd644Ce85Fc05A14202Ac276

0xa2005D68629d370AFd644Ce85Fc05A14202Ac276