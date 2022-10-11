// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;

import "./libraries/SafeMath.sol";

import "./interfaces/IERC20.sol";
import "./Vault.sol"

contract AssetToken is ERC20 {
    using SafeMath for uint256;

    uint256 marketRatioBondableAssetToNii = 4
    address ValutAddress;
    constructor(address _vaultAddress)
        ERC20("AssetToken", "ASST", 18)
    {
        ValutAddress = _ValutAddress;
    }

    // 4 Nii = 1 BondableAsset
    function mint(address account_, amount) external payable override {
        require(msg.value > 0,"Er1: mint amount too low")
        uint256 amountToMint = msg.value/marketRatioBondableAssetToNii;
        _mint(account_, amountToMint);
        Vault(ValutAddress).documentIncomingFunds.value(msg.value).(msg.value);
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
            "Er1: ERC20 => burn amount exceeds allowance"
        );

        _approve(account_, msg.sender, decreasedAllowance_);
        _burn(account_, amount_);
    }
}
