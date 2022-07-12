// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop is Ownable{
    address[] public toAddress;
    mapping(address => mapping(IERC20=> uint256)) public walletToToken;

    

    function addTokensToAirdrop(IERC20 _token, uint256 _amount) external payable {
        require(_amount > 0, "Need to deposit more than 0");
        _token.transferFrom(msg.sender, address(this), _amount);
        walletToToken[msg.sender][_token] = _amount;
    }

    function addWalletsToAirdrop(address[] memory _addresses) external {
        toAddress = _addresses;
    }

    function startAirdrop(IERC20 _token) external {
      uint256 _amount = walletToToken[msg.sender][_token];
      require(_amount > 0, "No tokens to airdrop");
      uint256 _amountToSend = _amount / toAddress.length;
      walletToToken[msg.sender][_token] = 0;
      for(uint i = 0; i < toAddress.length; i++){
          _token.transfer(toAddress[i], _amountToSend);
      }
    }

    function removeTokens(IERC20 _token) external {
        uint256 _amount = walletToToken[msg.sender][_token];
        _token.transfer(msg.sender, _amount);
        walletToToken[msg.sender][_token] = 0;
    }

    function balance(IERC20 _token) view public returns(uint){
        return walletToToken[msg.sender][_token];
    }
    
    function getAddresses() view public returns(address[] memory){
        return toAddress;
    }

    function getTestTokens() external {
      IERC20 testToken =  IERC20(0x5b4cE2E3D2cea2a6a40CDd2F59F30B85187d1F2B);
      bool success = testToken.balanceOf(msg.sender) < 10000 ether;
      require(success, "You already have test tokens");
      testToken.transfer(msg.sender, 10000 ether);  
    }

    receive() payable external{}
} 