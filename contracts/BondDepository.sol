// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;


import "./interfaces/INiitERC20.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IVault.sol";
contract BondDepository {
    struct UserBonds{
        uint256 id;
        address UserAddress;
        uint96 lastTimeDeposited;
        uint256 token_Amount_To_Be_Gotten;

    }
    uint96 id = 0;
    address BondableAsset;
    uint96 market_Ratio_Niitoken_To_Bondable_Asset = 20;
    address owner;
    uint96 bondDiscount = 4; // in percentage => 4% discount
    address vaultAddress;
    uint96 waitingTime = 7 days;
    address stakingContractAddr;
    address NiitERC20Addr;
    mapping(address => UserBonds) addressToBond;

    constructor (){
       owner = msg.sender;
    }
    modifier onlyOwner(){
        require(msg.sender == owner, "Er1: Only owner");
        _;
    }
    function setBondableAsset(address _BondableAsset) external onlyOwner{
        
         BondableAsset = _BondableAsset;
    }

    function setVaultAddress (address _vaultAddress) external onlyOwner {
        vaultAddress = _vaultAddress;
    }
    function setNiitERC20Addr (address _NiitERC20Addr) external onlyOwner{
        NiitERC20Addr = _NiitERC20Addr;
    }

    function setStakingContractaddr (address _stakingContractAddr) external onlyOwner{
        stakingContractAddr = _stakingContractAddr;
    }
    function deposit(uint256 _amount, address _user) external {
       require(_amount > 2000, "Er2: Bond amount too low");
       require(IERC20(BondableAsset).transferFrom(_user, vaultAddress, _amount), 'Er3: Asset deposit failed');
       UserBonds storage bond  = addressToBond[_user];
       bond.id = id;
       bond.UserAddress = _user;
       bond.lastTimeDeposited = uint96(block.timestamp);
       uint256 existing_Token_Bonded = bond.token_Amount_To_Be_Gotten;
       uint256 tokens_To_Be_Gotten_At_Direct_Bond_Market_Value = ((_amount )/market_Ratio_Niitoken_To_Bondable_Asset);
       uint256 token_With_Bond_Discount = tokens_To_Be_Gotten_At_Direct_Bond_Market_Value + (tokens_To_Be_Gotten_At_Direct_Bond_Market_Value * bondDiscount / 100);
       bond.token_Amount_To_Be_Gotten = existing_Token_Bonded + token_With_Bond_Discount;
       Vault(vaultAddress).documentIncomingAssets(bond.token_Amount_To_Be_Gotten, _user, id);
       id++;
    }

    function fetchExistingUserBond (address _userAddress) external view returns (uint256 amount) {
       UserBonds memory bond  = addressToBond[_userAddress];
       amount = bond.token_Amount_To_Be_Gotten;
    }

    function checkBondExist (address _userAddress) external view returns (bool exists){
        UserBonds memory bond = addressToBond[_userAddress];
        if(bond.UserAddress != address(0)) {
            exists =  true;
        }
    }
    function checkMaturity (address _userAddress) external view returns (uint256 waitingTimeLeft, bool matured){
        UserBonds memory bond = addressToBond[_userAddress];
        uint256 timeSpent = block.timestamp - uint256(bond.lastTimeDeposited);
        if(timeSpent < waitingTime){
            waitingTimeLeft = waitingTime - timeSpent;
            matured = false; 
        } else{
            waitingTimeLeft = 0;
            matured = true; 
        }
    }
    function getTokens() external {
        UserBonds storage bond = addressToBond[msg.sender];
        uint256 tokensToMint = bond.token_Amount_To_Be_Gotten;
        require(tokensToMint > 0, "Er4: No funds to withdraw ");
        uint256 timeSpent = block.timestamp - uint256(bond.lastTimeDeposited);
        require(timeSpent >= waitingTime, "Er5: Bond maturity period not yet reached");
        INahmiiERC20Token(NiitERC20Addr).mintFromBond(msg.sender, tokensToMint, bond.id);
        delete addressToBond[msg.sender];
    }

    // Allows Users to delete bond after staking.
    // To be called using the 
    function deleteBondAfterStake(address _userAddress) external {
        require(msg.sender == stakingContractAddr, "Er6: Only Staking contract");
         UserBonds storage bond = addressToBond[_userAddress];
        require(tx.origin ==  bond.UserAddress, 'Er7: Only owner');
        delete addressToBond[_userAddress];

    }
}
