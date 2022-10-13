// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;


import "./interfaces/IERC20.sol";

contract Vault{

    uint256 NiiBalance;
    uint256 AssetBalance;
    address BondDepositoryAddress;
    address owner;
    mapping(address => uint256) assetsPerUser;
    mapping(address=> mapping( uint256=> uint256)) indexedAssetPerUser;

    constructor (address _BondDepositoryAddress){
        BondDepositoryAddress = _BondDepositoryAddress;
        owner = msg.sender;
    }

    function documentIncomingAssets(uint256 amount, address _userAddress, uint256 index) external {
        require(msg.sender == BondDepositoryAddress, "Er1: Not accessible");
        uint existingAmountPerIndex = indexedAssetPerUser[_userAddress][index];
        uint256 existingAmountPerUser = assetsPerUser[_userAddress];
        indexedAssetPerUser[_userAddress][index] = existingAmountPerIndex + amount;
        assetsPerUser[_userAddress] = existingAmountPerUser + amount;
        AssetBalance+= amount;
    }

    function getIndexedAssetPerUser (address _userAddress, uint256 index) external view returns (uint256 amount){
        return indexedAssetPerUser[_userAddress][index];
    }

    function documentIncomingFunds(uint256 amount) payable external {
        require(msg.value == amount, "Er2: Invalid amount");
        NiiBalance += amount;
    }

    function withdrawNii(uint256 _amount, address _addr) external{
        require(msg.sender == owner, "Er3 only owner");
        require(NiiBalance >= _amount, "Er4: Insufficient funds");
        NiiBalance -= _amount;
        payable(_addr).transfer(_amount);
    }

    function WithdrawNiitoken (uint256 _amount, address _addr, address _NiitERC20Addr) external{
        require(msg.sender == owner, "Er4 only owner");
        require(AssetBalance >= _amount, "Er5: Insufficient funds");
        AssetBalance -= _amount;
        IERC20(_NiitERC20Addr).transferFrom(address(this), _addr, _amount);
        
    }
}
