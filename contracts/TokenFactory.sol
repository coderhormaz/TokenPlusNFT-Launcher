// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SepoliaToken is ERC20, Ownable {
    string private _logoURI;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address recipient,
        string memory logo
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(recipient, initialSupply);
        _logoURI = logo;
    }

    function logoURI() public view returns (string memory) {
        return _logoURI;
    }

    function setLogoURI(string memory newLogoURI) public onlyOwner {
        _logoURI = newLogoURI;
    }
}

contract TokenFactory {
    address[] public deployedTokens;

    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        uint256 totalSupply,
        address indexed recipient
    );

    // No constructor arguments — deploy this contract directly in Remix
    constructor() {}

    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address recipient
    ) public returns (address) {
        SepoliaToken token = new SepoliaToken(
            name,
            symbol,
            initialSupply,
            recipient,
            ""
        );
        deployedTokens.push(address(token));
        emit TokenCreated(address(token), name, symbol, initialSupply, recipient);
        return address(token);
    }

    function getTokenInfo(address tokenAddress)
        public
        view
        returns (
            string memory name,
            string memory symbol,
            uint256 totalSupply
        )
    {
        ERC20 token = ERC20(tokenAddress);
        return (token.name(), token.symbol(), token.totalSupply());
    }

    function getDeployedTokens() public view returns (address[] memory) {
        return deployedTokens;
    }
}
