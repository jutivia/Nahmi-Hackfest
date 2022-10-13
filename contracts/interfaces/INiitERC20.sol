// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;


contract INahmiiERC20Token  {
 
    function mintForSale(address account_) external payable ;

    function mintFromBond(address _userAddress, uint256 amountToMint, uint256 index) external ;
    function MintFromStake(address account_, uint256 amountToMint) external ;


    function burn(uint256 amount) external ;

    function burnFrom(address account_, uint256 amount_) external ;

    function _burnFrom(address account_, uint256 amount_) internal ;

     function approve(address spender, uint256 amount) public virtual override returns (bool) ;
}
