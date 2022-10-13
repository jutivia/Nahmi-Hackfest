// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;

import "./libraries/SafeMath.sol";
import "./types/ERC20.sol";
import "./interfaces/IVault.sol";
import "./interfaces/Istaking.sol";

contract NahmiiERC20Token is ERC20 {
    using SafeMath for uint256;

    uint96 marketRatioNiiTokenToNii = 100;
    address stakingContractAddr;
    address BondDepo;
    Staking stakingContract;
    Vault VaultContract;
    // Since we don’t have access to any decentralised oracle that supports the Nahmii blockchain, we had to assume market value prices for the assets used in the project.
    // 100 Nii = 1Niit
    // 
    // 25 BondableAsset = 1Niit
    // 4 Nii = 1 BondableAsset

    // Bonded price => 24 BondableAsset = 1 Niit (4% discount)
    constructor(address _vaultAddress, address _stakingaddr, address _BondDepo)
        ERC20("NahmiiToken", "Niit", 18)
    {
        VaultContract = Vault(_vaultAddress);
        stakingContract = Staking(_stakingaddr);
        BondDepo = _BondDepo;
        stakingContractAddr = _stakingaddr;
    }

    function mintForSale(address account_) external payable {
        require(msg.value > marketRatioNiiTokenToNii, "Er1: mint amount too low");
        uint256 amountToMint = msg.value/marketRatioNiiTokenToNii;
        _mint(account_, amountToMint);
        VaultContract.documentIncomingFunds{value:msg.value}(msg.value);
    }

    function mintFromBond(address _userAddress, uint256 amountToMint, uint256 index) external {
        require(msg.sender == BondDepo, 'Er2: Only Bond Depo contract');
        require (VaultContract.getIndexedAssetPerUser(_userAddress,index) >= amountToMint);
        _mint(_userAddress, amountToMint);
    }

    function MintFromStake(address account_, uint256 amountToMint) external {
        //check stake amount is greater than amount to mint
        require(msg.sender == stakingContractAddr, 'Er3: Only staking contract');
        _mint(account_, amountToMint);
    }


    function burn(uint256 amount) external  {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account_, uint256 amount_) external {
        _burnFrom(account_, amount_);
    }

    function _burnFrom(address account_, uint256 amount_) internal {
        uint256 decreasedAllowance_ = allowance(account_, msg.sender).sub(
            amount_,
            "Er5: ERC20 => burn amount exceeds allowance"
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
