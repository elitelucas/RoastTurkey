//import { useEffect, useState } from 'react'
import { useCallback } from 'react'
//import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
//import { BIG_ZERO } from 'utility/bigNumber'
import useWeb3 from './useWeb3'
import useRefresh from './useRefresh'
import { buyPresaleToken, reBuyPresaleToken, withdraw } from 'utility/callHelpers'

export const useBuyPreSale = (chainId) => {

  const web3 = useWeb3(chainId)
  const { account } = useWeb3React()

  const Address = "0xE03213291D52F83FE30787296C3e5e7a8Df412B5";
  const ABI = [{"constant":true,"inputs":[],"name":"ceoAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyMiners","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"initialized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sellEggs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"seedMarket","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"ref","type":"address"}],"name":"hatchEggs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMyEggs","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ref","type":"address"}],"name":"sellEggs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"eggs","type":"uint256"}],"name":"calculateEggSell","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ref","type":"address"}],"name":"buyEggs","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
  const contract = new web3.eth.Contract(ABI, Address);
  
  const handleBuy = useCallback(
    async (ethAmount) => {
      const txHash = await buyPresaleToken(contract, ethAmount, 18, account)
      return txHash
    }, [account, contract])

  const reHandleBuy = useCallback(
    async () => {
      const txHash = await reBuyPresaleToken(contract, 18, account)
      return txHash
    }, [account, contract])

  const handleWithdraw = useCallback(
    async () => {
      const txHash = await withdraw(contract, 18, account)
      return txHash
    }, [account, contract])

  return { onBuy: handleBuy, onReBuy: reHandleBuy, onWithdraw: handleWithdraw }
}
export default useBuyPreSale
