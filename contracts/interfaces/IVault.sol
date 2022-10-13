// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;

interface Vault{



    function documentIncomingAssets(uint256 amount, address _userAddress, uint256 index) external;

    function getIndexedAssetPerUser (address _userAddress, uint256 index) external view returns (uint256 amount);
    function documentIncomingFunds(uint256 amount) payable external ;

    function withdrawNii(uint256 _amount, address _addr) external;
    function WithdrawNiitoken (uint256 _amount, address _addr, address _NiitERC20Addr) external;
}
