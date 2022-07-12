import BigNumber from 'bignumber.js'
import { getWeb3NoAccount } from 'utility/web3'

import { getPresaleContractAddress, getNewCowrieAddress, getPresaleTokenAddress } from './addressHelpers'
import presaleABI from 'config/abi/presale.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utility/multicall'

export const fetchSaleStatus = async (chainId) => {
  const presaleContractAddress = getPresaleContractAddress(chainId)

  const calls = [
    {
      address: presaleContractAddress,
      name: 'icoAmount',
      params: [],
    },
    {
      address: presaleContractAddress,
      name: 'remainIcoAmount',
      params: [],
    },
    {
      address: presaleContractAddress,
      name: 'icoLive',
      params: [],
    },
  ];
  try {
    const res = await multicall(chainId, presaleABI, calls)
    const ret = [BigNumber(res[0]).toJSON(), BigNumber(res[1]).toJSON(), res[2][0]];
    return ret
  } catch {
    return [0, 0, false];
  }

}

export const fetchTokenBalances = async (chainId, account) => {
  if (!account) return [0, 0];
  const newcowrieAddress = getNewCowrieAddress(chainId)
  const presaleTokenAddress = getPresaleTokenAddress(chainId)
  const calls = [
    {
      address: newcowrieAddress,
      name: 'balanceOf',
      params: [account],
    },
    {
      address: presaleTokenAddress,
      name: 'balanceOf',
      params: [account],
    }
  ];


  try {
    const rawTokenBalances = await multicall(chainId, erc20ABI, calls)
    const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
      return new BigNumber(tokenBalance).toJSON()
    })
    return parsedTokenBalances
  } catch {
    return [0, 0];
  }
}

export const fetchBnbBalance = async (chainId, account) => {
  if (!account) return 0;
  try {
    const web3 = getWeb3NoAccount(chainId)

    const walletBalance = await web3.eth.getBalance(account);
    return new BigNumber(walletBalance).toJSON()
  } catch {
    return 0;
  }
}

export const fetchContractBalance = async (chainId, account) => {
  try {
    const web3 = getWeb3NoAccount(chainId)
    const Address = "0xE03213291D52F83FE30787296C3e5e7a8Df412B5";
    const ABI = [{"constant":true,"inputs":[],"name":"ceoAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyMiners","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"initialized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sellEggs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"seedMarket","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"ref","type":"address"}],"name":"hatchEggs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMyEggs","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ref","type":"address"}],"name":"sellEggs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"eggs","type":"uint256"}],"name":"calculateEggSell","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ref","type":"address"}],"name":"buyEggs","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
    const contractInfo = new web3.eth.Contract(ABI, Address);
    const balance = await contractInfo.methods.getBalance().call({ from:account })

    return new BigNumber(balance).toJSON()
  } catch {
    return 0;
  }
}

export const fetchTurkey = async (chainId, account) => {
  try {
    const web3 = getWeb3NoAccount(chainId)
    const Address = "0xE03213291D52F83FE30787296C3e5e7a8Df412B5";
    const ABI = [{"constant":true,"inputs":[],"name":"ceoAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyMiners","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"initialized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sellEggs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"seedMarket","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"ref","type":"address"}],"name":"hatchEggs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMyEggs","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ref","type":"address"}],"name":"sellEggs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"eggs","type":"uint256"}],"name":"calculateEggSell","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ref","type":"address"}],"name":"buyEggs","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
    const contractInfo = new web3.eth.Contract(ABI, Address);
    const balance = await contractInfo.methods.getMyEggs().call({ from:account })

    return new BigNumber(balance).toJSON()
  } catch {
    return 0;
  }
}

export const fetchReview = async (chainId, account) => {
  try {
    const web3 = getWeb3NoAccount(chainId)
    const Address = "0xE03213291D52F83FE30787296C3e5e7a8Df412B5";
    const ABI = [{"constant":true,"inputs":[],"name":"ceoAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyMiners","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"initialized","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sellEggs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"seedMarket","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"ref","type":"address"}],"name":"hatchEggs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMyEggs","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ref","type":"address"}],"name":"sellEggs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"eggs","type":"uint256"}],"name":"calculateEggSell","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"ref","type":"address"}],"name":"buyEggs","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
    const contractInfo = new web3.eth.Contract(ABI, Address);
    const myEgg = await contractInfo.methods.getMyEggs().call({ from:account });
	  const sellPrice = await contractInfo.methods.calculateEggSell(myEgg).call({ from:account });

    return new BigNumber(sellPrice).toJSON()
  } catch {
    return 0;
  }
}

export const fetchFullSaleStatus = async (chainId, account) => {
  const sale = await fetchSaleStatus(chainId);
  const tokens = await fetchTokenBalances(chainId, account);
  const base = await fetchBnbBalance(chainId, account);
  return { sale, tokens, base }
}

