// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;

import "./libraries/SafeMath.sol";

import "./interfaces/IERC20.sol";
import "./types/ERC20.sol";
import "./Vault.sol";

contract AssetToken is ERC20 {
    using SafeMath for uint256;
    address ValutAddress;

    constructor(address _vaultAddress)
        ERC20("AssetToken", "ASST", 18)
    {
        ValutAddress = _vaultAddress;
    }

    function mint(address account_, uint256 amount) external payable {
        _mint(account_, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account_, uint256 amount_) external {
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

    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, amount);
        return true;
    }
}
