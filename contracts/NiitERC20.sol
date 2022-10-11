// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;

import "./libraries/SafeMath.sol";

import "./interfaces/IERC20.sol";
import "./types/ERC20.sol";
import "./Vault.sol"


contract NahmiiERC20Token is ERC20 {
    using SafeMath for uint256;

    address ValutAddress;

    // Since we don’t have access to any decentralised oracle that supports the Nahmii blockchain, we had to assume market value prices for the assets used in the project.
    // 100 Nii = 1Niit
    // 
    // 25 BondableAsset = 1Niit
    // 4 Nii = 1 BondableAsset

    // Bonded price => 24 BondableAsset = 1 Niit (4% discount)
    uint256 marketRatioNiiTokenToNii = 100
    constructor(address _vaultAddress)
        ERC20("NahmiiToken", "Niit", 18)
    {
        ValutAddress = _vaultAddress
    }

    function mintForSale(address account_) external payable override {
        require(msg.value > 0,"Er1: mint amount too low")
        uint256 amountToMint = msg.value/marketRatioNiiTokenToNii;
        _mint(account_, amountToMint);
        Vault(ValutAddress).documentIncomingFunds.value(msg.value).(msg.value);
    }

    function mintFromBond(address account_, uint256 amountToMint, uint256 index) public override {
        require (Vault(ValutAddress).getIndexedAssetPerUser(_userAddress,index) >= amountToMint);
        _mint(account_, amountToMint);
    }

    function burn(uint256 amount) external override {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account_, uint256 amount_) external override {
        _burnFrom(account_, amount_);
    }

    function _burnFrom(address account_, uint256 amount_) internal {
        uint256 decreasedAllowance_ = allowance(account_, msg.sender).sub(
            amount_,
            "Er2: ERC20 => burn amount exceeds allowance"
        );

        _approve(account_, msg.sender, decreasedAllowance_);
        _burn(account_, amount_);
    }
}
