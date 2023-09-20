import * as ethers from 'ethers'
import config from '../../config/environment'

class Ethereum {
  constructor () {
    if (config.useEthereum) {
      this.testnet = true
      this.chainId = 557888
      this.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545', this.testnet, this.chainId)
      this.Wallet = ethers.Wallet
    }
  }

  createWallet (privateKey) {
    if (!config.useEthereum) {
      return null
    }
    return new ethers.Wallet(privateKey, this.provider)
  }
  transferEther (privateKey, address, amount, callback) {
    if (!config.useEthereum) {
      return callback(null)
    }
    const wallet = new ethers.Wallet(privateKey)
    wallet.provider = this.provider

    // We must pass in the amount as wei (1 ether = 1e18 wei), so we use
    // this convenience function to convert ether to wei.
    const etherAmount = ethers.parseEther(amount)
    const sendPromise = wallet.send(address, etherAmount)

    sendPromise.then(function (transactionHash) {
      console.log(transactionHash)
      if (callback) {
        return callback(transactionHash)
      }
    })
  }
  getBalance (privateKey, address, callback) {
    if (!config.useEthereum || !privateKey || !address) {
      return callback(null)
    }
    const wallet = new ethers.Wallet(privateKey)
    wallet.provider = this.provider
    let balancePromise = wallet.getBalance(address)
    balancePromise.then(callback)
  }
}

const ethereum = new Ethereum()
// const Wallet = instance.Wallet
// export {Wallet, instance}
export default ethereum
