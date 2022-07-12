import React, { useState } from "react";
import { airdropContractAddress } from "./contracts/addresses";
import { ethers } from "ethers";

const axios = require("axios").default;
const fromWei = (num) => ethers.utils.formatEther(num);
const toWei = (num) => ethers.utils.parseEther(num.toString());

const Main = ({
  tokenAddress,
  tokenContract,
  airdropContract,
  setTokenAbi,
  setTokenAddress,
  setTokenBalance,
  setAddresses,
}) => {
  const [address, setAddress] = useState("");
  const [addressArray, setAddressArray] = useState([]);
  const [depositAmount, setDepositAmount] = useState();

  const apikey = "T1P35YUW7DSCXMY9YJ16KSI146JCR9YTYQ";

  const submitTokenAddress = async (e) => {
    e.preventDefault();
    if (tokenAddress && tokenAddress.length !== 42) return;
    try {
      axios
        .get(
          `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${apikey}`
        )
        .then((response) => setTokenAbi(response.data.result));
      if (airdropContract) {
        await airdropContract.tokenToAirdrop(tokenAddress);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const addAddress = async (e) => {
    e.preventDefault();
    if (addressArray.includes(address) || address.length !== 42) {
      return;
    }
    setAddressArray([...addressArray, address]);
  };

  const removeAddress = (i) => {
    const newArr = addressArray.filter((add) => add !== i);
    setAddressArray(newArr);
  };

  const syncAddresses = async () => {
    const tx = await airdropContract.addWalletsToAirdrop(addressArray);
    await tx.wait();
    setAddressArray(null);
    const addys = await airdropContract.getAddresses();
    setAddresses(addys);
  };

  const depositTokens = async (e) => {
    e.preventDefault();
    if (tokenContract && depositAmount) {
      const tx = await tokenContract.approve(
        airdropContractAddress,
        toWei(depositAmount)
      );
      await tx.wait();
      const tx2 = await airdropContract.addTokensToAirdrop(
        tokenAddress,
        toWei(depositAmount)
      );
      await tx2.wait();

      const balance = await airdropContract.balance(tokenAddress);
      setTokenBalance(fromWei(balance));
      setDepositAmount(null);
    }
  };

  const withdrawTokens = async (e) => {
    e.preventDefault();
    if (airdropContract) {
      let balance = await airdropContract.balance(tokenAddress);
      if (fromWei(balance) > 0) {
        const tx = await airdropContract.removeTokens(tokenAddress);
        await tx.wait();
        const balance = await airdropContract.balance(tokenAddress);
        setTokenBalance(fromWei(balance));
      } else {
        alert("No tokens to withdraw");
      }
    }
  };

  const startAirdrop = async (e) => {
    e.preventDefault();
    if (airdropContract) {
      const check = await airdropContract.balance(tokenAddress);
      if (fromWei(check) > 0) {
        const drop = await airdropContract.startAirdrop(tokenAddress);
        await drop.wait();
        const balance = await airdropContract.balance(tokenAddress);
        setTokenBalance(fromWei(balance));
        alert("Airdrop Successfull");
      } else {
        alert("Not enough tokens to send");
      }
    }
  };

  return (
    <div className="main_main">
      <div className="main_token main_box">
        Set Token to Airdrop:
        <form>
          <input
            onChange={(e) => setTokenAddress(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
          />
          <button onClick={(e) => submitTokenAddress(e)}>SET</button>
        </form>
      </div>
      <div className="main_addresses main_box">
        Add Addresses
        <form>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onSubmit={(e) => e.preventDefault()}
          />
          <button onClick={(e) => addAddress(e)}>Add</button>
        </form>
        {addressArray
          ? addressArray.map((i) => {
              return (
                <div key={i}>
                  {`${i.slice(0, 6)}...${i.slice(35, 44)}`}{" "}
                  <button onClick={() => removeAddress(i)}>Remove</button>
                </div>
              );
            })
          : ""}
        <button onClick={syncAddresses}>Submit</button>
      </div>
      <div className="main_airdrop main_box">
        <form className="deposit_withdraw">
          <div>
            <input
              onChange={(e) => setDepositAmount(e.target.value)}
              onSubmit={(e) => e.preventDefault()}
            />
            <button onClick={(e) => depositTokens(e)}>Deposit Tokens</button>
          </div>
          <div>
            <button onClick={(e) => withdrawTokens(e)}>Withdraw Tokens</button>
          </div>

          <button onClick={(e) => startAirdrop(e)}>Start Airdrop</button>
        </form>
      </div>
    </div>
  );
};

export default Main;
