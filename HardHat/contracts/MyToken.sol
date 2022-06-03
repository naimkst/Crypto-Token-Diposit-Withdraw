// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {


    uint256 public allTokens;
    address payable admin;
    uint128 public tokenPrice = 10 gwei;
    uint256 public totalSale;
    mapping(address => uint256) public balances;

    
    constructor() ERC20("Naim Token", "NAIM") {
        allTokens = 500 * 10 ** 18;
        admin = payable(msg.sender);
        balances[msg.sender] = allTokens;
        _mint(msg.sender, allTokens);
    }

    function buyToken(uint256 _tokenGet) public payable{
        uint256 valuesOfToken;
        valuesOfToken = (_tokenGet);
        admin.transfer(msg.value);
        _transfer(admin, msg.sender, valuesOfToken);
        // balances[admin] -= _tokenGet;
        // balances[msg.sender] += _tokenGet;
        // totalSale = totalSale + _tokenGet;
    }

}

