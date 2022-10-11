// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;


import "./NiitERC20.sol";
import "./types/ERC20.sol";
import "../interfaces/IERC20.sol";

contract BondDepository {
    struct UserBonds{
        uint256 id,
        address UserAddress,
        uint96 lastTimeDeposited,
        uint256 tokenAmountToBeGotten,

    }
    uint96 id = 0;
    uint8 marketRatioNiitokenToBondableAsset = 20;
    uint8 bondDiscount = 4; // in percentage => 4% discount
    uint16 waitingTime = 7 days;
    address BondableAsset;
    mapping(address => UserBonds) addressToBond;

    constructor (address _BondableAsset){
        BondableAsset = _BondableAsset;
    }
    
    function deposit(uint256 _amount, address _user, address vaultAddress) external returns(UserBonds memory bond){
       require(IERC20(BondableAsset).transferFrom(_user, vaultAddress, _amount * 1e18), 'er1: Asset deposit failed');
       bond  = addressToBond[_user];
       bond.id = id;
       bond.UserAddress = _user;
       bond.lastTimeDeposited = block.timestamp;
       uint existingTokenBonded = bond.tokenAmountToBeGotten;
       uint tokensToBeGottenAtDirectBondMarketValue = ((_amount * 1e18 )/marketRatioNiitokenToBondableAsset);
       uint tokenWithBondDiscount = tokensToBeGottenAtDirectBondMarketValue + (tokensToBeGottenAtDirectBondMarketValue * (bondDiscount/100));
       bond.tokenAmountToBeGotten = existingTokenBonded + tokenWithBondDiscount;
       Vault(ValutAddress).documentIncomingAssets(bond.tokenAmountToBeGotten, _user, id);
       id++;
       
    }

    function fetchExistingUserBond (address _userAddress) external returns (UserBonds memory bond) {
       bond  = addressToBond[_userAddress];
    }

    function checkBondExisist (address _userAddress) external returns (bool exists){
        UserBonds bond = addressToBond[_user];
        if(bond.UserAddress === 0x00) {
            return false;
        } else {
            return true;
        }
    }
    function checkMaturity (address _userAddress) external view returns (uint246 waitingTimeLeft, bool matured){
        UserBonds bond = addressToBond[_user];
        uint256 timeSpent = block.timestamp - uint256(bond.lastTimeDeposited);
        if(timeSpent >= waitingTime){
            waitingTimeLeft =  0;
            matured = true; 
        } else{
            waitingTimeLeft = timeSpent - waitingTime;
            matured = false; 
        }
    }
    function getTokens(address _NiitERC20Addr) external {
        UserBonds bond = addressToBond[msg.sender];
        uint256 tokensToMint = bond.tokenAmountToBeGotten;
        uint256 timeSpent = block.timestamp - uint256(bond.lastTimeDeposited);
        require(timeSpent >= waitingTime, "er2: Bond maturity period not yet reached");
        NiitERC20(_NiitERC20Addr).mintFromBond(msg.sender, tokensToMint);
        delete addressToBond[_user];
    }

    function deleteBondAfterStake(address _userAddress) external {
         UserBonds bond = addressToBond[_userAddress];
        require(tx.origin ===  bond.UserAddress, 'Only owner');
        delete addressToBond[msg.sender];

    }
}
