import React, { useEffect, useState } from "react";
import { airdropContractAddress } from "./contracts/addresses";
import { ethers } from "ethers";

const fromWei = (num) => ethers.utils.formatEther(num);

const Topbar = ({
  tokenContract,
  airdropContract,
  tokenAddress,
  setTokenBalance,
  tokenBalance,
  setAddresses,
  addresses,
}) => {
  const [airdropToken, setAirdropToken] = useState(0);

  useEffect(() => {
    if (!tokenContract) return;
    const getBalances = async () => {
      const balance = await tokenContract.balanceOf(airdropContractAddress);

      setTokenBalance(fromWei(balance));
    };
    getBalances();
    // eslint-disable-next-line
  }, [tokenContract]);

  useEffect(() => {
    if (airdropContract) {
      const fetchAddresses = async () => {
        const token = await tokenContract.name();
        setAirdropToken(token);
        const addys = await airdropContract.getAddresses();
        setAddresses(addys);
      };
      fetchAddresses();
    }
    // eslint-disable-next-line
  }, [airdropContract, tokenAddress]);

  return (
    <div className="topbar_main">
      <div className="topbar_container">
        Token to Airdrop:
        <div className="topbar_values">{airdropToken ? airdropToken : ""}</div>
      </div>
      <div className="topbar_container">
        Tokens in Contract:{" "}
        <div className="topbar_values">{Number(tokenBalance).toFixed(2)}</div>
      </div>
      <div className="topbar_container">
        Addresses to Airdrop:
        <div className="topbar_values">
          {addresses
            ? addresses.map((add) => {
                return (
                  <div key={add}>{`${add.slice(0, 6)}...${add.slice(
                    35,
                    44
                  )}`}</div>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
