// Sources flattened with hardhat v2.11.2 https://hardhat.org

// File contracts/libraries/SafeMath.sol

// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;

// TODO(zx): Replace all instances of SafeMath with OZ implementation
library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        assert(a == b * c + (a % b)); // There is no case in which this doesn't hold

        return c;
    }

    // Only used in the  BondingCalculator.sol
    function sqrrt(uint256 a) internal pure returns (uint256 c) {
        if (a > 3) {
            c = a;
            uint256 b = add(div(a, 2), 1);
            while (b < c) {
                c = b;
                b = div(add(div(a, b), b), 2);
            }
        } else if (a != 0) {
            c = 1;
        }
    }
}


// File contracts/interfaces/IERC20.sol

// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}


// File contracts/types/ERC20.sol

// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.17;

abstract contract ERC20 is IERC20 {
    using SafeMath for uint256;

    // TODO comment actual hash value.
    bytes32 private constant ERC20TOKEN_ERC1820_INTERFACE_ID = keccak256("ERC20Token");

    mapping(address => uint256) internal _balances;

    mapping(address => mapping(address => uint256)) internal _allowances;

    uint256 internal _totalSupply;

    string internal _name;

    string internal _symbol;

    uint8 internal immutable _decimals;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_
    ) {
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals_;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual returns (uint8) {
        return _decimals;
    }

function totalSupply() public view override returns ( uint256 ) {
        return _totalSupply;
}

    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(
            sender,
            msg.sender,
            _allowances[sender][msg.sender].sub(amount, "ERC20: transfer amount exceeds allowance")
        );
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(
            msg.sender,
            spender,
            _allowances[msg.sender][spender].sub(subtractedValue, "ERC20: decreased allowance below zero")
        );
        return true;
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(sender, recipient, amount);

        _balances[sender] = _balances[sender].sub(amount, "ERC20: transfer amount exceeds balance");
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }

    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");
        _beforeTokenTransfer(address(0), account, amount);
        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        _balances[account] = _balances[account].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _beforeTokenTransfer(
        address from_,
        address to_,
        uint256 amount_
    ) internal virtual {}
}


// File contracts/AssetERC20.sol

// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;


contract AssetToken is ERC20 {
    using SafeMath for uint256;

    constructor()
        ERC20("AssetToken", "ASST", 18)
    {
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


// File contracts/interfaces/INiitERC20.sol

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


// File contracts/interfaces/IVault.sol

// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;

interface Vault{



    function documentIncomingAssets(uint256 amount, address _userAddress, uint256 index) external;

    function getIndexedAssetPerUser (address _userAddress, uint256 index) external view returns (uint256 amount);
    function documentIncomingFunds(uint256 amount) payable external ;

    function withdrawNii(uint256 _amount, address _addr) external;
    function WithdrawNiitoken (uint256 _amount, address _addr, address _NiitERC20Addr) external;
}


// File contracts/BondDepository.sol

// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;



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


// File contracts/interfaces/Istaking.sol

// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;
interface Staking{

     function setNiitERC20Addr (address _NiitERC20Addr) external onlyOwner;

    function stakeFromMatureBonds() external;

    function stake(uint256 _amount) external;

    // this function re-compounds the staker's stakes if the lastStakedTime is greater than 7 days each time its being called 
    function _stake(uint256 _amountIn) internal;

     // this function re-compounds the staker's stakes if the lastStakedTime is greater than 3 days each time its being called 
    function withdrawStake (uint _amount) external;

    // This function checks the compounded balance for each staker
    function checkStakingBalance (address _account) external view returns (uint balance);
}


// File contracts/NiitERC20.sol

// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;




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
        uint256 decreasedAllowanc4_ = allowance(account_, msg.sender).sub(
            amount_,
            "Er5: ERC20 => burn amount exceeds allowance"
        );

        _approve(account_, msg.sender, decreasedAllowanc4_);
        _burn(account_, amount_);
    }

     function approve(address spender, uint256 amount) public virtual override returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, amount);
        return true;
    }
}


// File contracts/Vault.sol

// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;

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


// File contracts/interfaces/IBondDepository.sol

// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;

interface IBondDepository {

    function setBondableAsset(address _BondableAsset) external onlyOwner;

    function setVaultAddress (address _vaultAddress) external onlyOwner ;
    function setNiitERC20Addr (address _NiitERC20Addr) external onlyOwner;

    function setStakingContractaddr (address _stakingContractAddr) external onlyOwner;
    function deposit(uint256 _amount, address _user) external ;

    function fetchExistingUserBond (address _userAddress) external view returns (uint256 amount) ;

    function checkBondExist (address _userAddress) external view returns (bool exists);
    function checkMaturity (address _userAddress) external view returns (uint256 waitingTimeLeft, bool matured);
    function getTokens() external ;
    function deleteBondAfterStake(address _userAddress) external ;
}


// File contracts/staking.sol

// SPDX-License-Identifier: AGPL-3.0
pragma solidity 0.8.17;



contract Staking{
    mapping(address => Staker) stakerToStakes;
    address BondDepositoryAddress;
    address VaultAddress;
    address NiitERC20Addr;
    address owner;
    uint96 constant minStakePeriod = 7 days;

    IBondDepository BondContract;

    struct Staker{
        address owner;
        uint96 lastTimeStake;
        uint currentStake;   
    }
    // Staking is done at 50% interest per year, and accumulated for users per second.

    constructor (address _BondDepositoryAddress, address _vaultAddress){
        BondContract = IBondDepository(_BondDepositoryAddress);
        VaultAddress = _vaultAddress;
        owner = msg.sender;
    }
    modifier onlyOwner(){
        require(msg.sender == owner, "Er1: Only owner");
        _;
    }
     function setNiitERC20Addr (address _NiitERC20Addr) external onlyOwner{
        NiitERC20Addr = _NiitERC20Addr;
    }

    function stakeFromMatureBonds() external{
       require(BondContract.checkBondExist(msg.sender), 'Er1: Bond does not exist');
       (, bool matured) = BondContract.checkMaturity(msg.sender);
       require(matured == true, 'Er2: Bond not mature');
       (uint256 amountToStake) = BondContract.fetchExistingUserBond(msg.sender);
        _stake(amountToStake);
        BondContract.deleteBondAfterStake(msg.sender);
    }

    function stake(uint256 _amount) external{
        require(IERC20(NiitERC20Addr).transferFrom(msg.sender, VaultAddress, _amount), 'Er3: Asset transfer failed');
        _stake(_amount);
    }

    // this function re-compounds the staker's stakes if the lastStakedTime is greater than 7 days each time its being called 
    function _stake(uint256 _amountIn) internal {
        Staker storage o = stakerToStakes[msg.sender];
        if(o.lastTimeStake == 0){
        o.owner = msg.sender;
        o.currentStake = _amountIn;
        o.lastTimeStake = uint96(block.timestamp);
        } else {
        uint stakePeriod = block.timestamp - o.lastTimeStake;
        if(stakePeriod >= minStakePeriod){
            uint bonus = (o.currentStake * 2/100000000 * stakePeriod);
            o.currentStake = o.currentStake + _amountIn + bonus;
        } else {
            o.currentStake += _amountIn;
        }
        o.lastTimeStake = uint96(block.timestamp);
        }
    }

     // this function re-compounds the staker's stakes if the lastStakedTime is greater than 3 days each time its being called 
    function withdrawStake (uint _amount) external {
        Staker storage o = stakerToStakes[msg.sender];
        uint stakePeriod = block.timestamp - o.lastTimeStake;
        if(stakePeriod >= minStakePeriod){
            uint bonus = (o.currentStake *  2/100000000 * stakePeriod);
            o.currentStake += bonus;
        }
        require (o.currentStake >= _amount, 'Er4: Stake balance less than request amount');
        o.currentStake -= _amount;
        o.lastTimeStake = uint96(block.timestamp);
        INahmiiERC20Token(NiitERC20Addr).MintFromStake(msg.sender, _amount);
    }

    // This function checks the compounded balance for each staker
    function checkStakingBalance (address _account) external view returns (uint balance){
        Staker storage o = stakerToStakes[_account];
        uint stakePeriod = block.timestamp - o.lastTimeStake;
        if(stakePeriod >= minStakePeriod){
            uint bonus = (o.currentStake *  2/100000000 * stakePeriod);
           return balance= o.currentStake + bonus;
        } 
        return balance = o.currentStake;
    }
}
