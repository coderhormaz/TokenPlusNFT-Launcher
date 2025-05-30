// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseToken is ERC20, Ownable {
    string private _logoURI;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address recipient,
        string memory logoURI
    ) ERC20(name, symbol) {
        _mint(recipient, initialSupply * 10**decimals());
        _logoURI = logoURI;
    }

    function logoURI() public view returns (string memory) {
        return _logoURI;
    }

    function setLogoURI(string memory newLogoURI) public onlyOwner {
        _logoURI = newLogoURI;
    }
} 