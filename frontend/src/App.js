import React, { useState } from "react";

import "./App.css";
import { ethers } from "ethers";
import Main from "./Main";
import Topbar from "./Topbar";
import { airdropContractAddress } from "./contracts/addresses";
import airdropABI from "./contracts/airdrop.json";
import Instructions from "./Instructions";

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [airdropContract, setAirdropContract] = useState(null);
  const [tokenAbi, setTokenAbi] = useState(null);
  const [tokenAddress, setTokenAddress] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [addresses, setAddresses] = useState();

  const connect = async () => {
    if (tokenAbi && tokenAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const signer = provider.getSigner();
      setWallet(accounts[0]);
      createContracts(signer);
    } else {
      alert("Must set token first");
    }
  };

  const createContracts = (signer) => {
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
    setTokenContract(tokenContract);
    const airdropContract = new ethers.Contract(
      airdropContractAddress,
      airdropABI,
      signer
    );
    setAirdropContract(airdropContract);
    console.log(tokenContract, airdropContract);
  };

  const testTokens = async () => {
    if (airdropContract) {
      try {
        await airdropContract.getTestTokens();
      } catch (error) {
        alert(error.error.message);
      }
    }
  };

  return (
    <div className="App">
      <div className="connect">
        {wallet ? wallet : <button onClick={connect}>Connect</button>}
      </div>
      <Main
        setTokenAbi={setTokenAbi}
        tokenContract={tokenContract}
        airdropContract={airdropContract}
        setTokenAddress={setTokenAddress}
        tokenAddress={tokenAddress}
        tokenAbi={tokenAbi}
        wallet={wallet}
        setTokenBalance={setTokenBalance}
        addresses={addresses}
        setAddresses={setAddresses}
      />
      <Topbar
        airdropContract={airdropContract}
        tokenContract={tokenContract}
        tokenAddress={tokenAddress}
        tokenBalance={tokenBalance}
        setTokenBalance={setTokenBalance}
        addresses={addresses}
        setAddresses={setAddresses}
      />
      <Instructions />
      <div className="testTokens">
        <button onClick={testTokens}>Get Test Tokens</button>
        Test token address: 0x5b4cE2E3D2cea2a6a40CDd2F59F30B85187d1F2B
      </div>
    </div>
  );
};

export default App;
