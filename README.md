
# NIIT Protocol
### Nahmi Hackfest submission (An interpretation of the Olympus Pro contract)
<i>A Protocol Owned Liqidity DAapp Deployed on the Nahmii 3 Testnet (Early)
The NIIt protocol was built on the Olympus pro protocol model. The protocol encourages users to hold the protocol tokens (NIIT) as opposed to selling, because there’s a lot more profit to be gained from holding the tokens. These profits can be gained in two distinct ways: bonding of assets, or staking. The goal of the protocol is to ensure a rise in the market value of the protocol tokens, by ever increasing the demand for it. </i>


#
### Constraints
Since we do not have access to any decentralised oracle that supports the Nahmi blockchain, we had to assume market value prices for the assets used in the project.

- 100 Nii = 1NIIT
- 25 AssetToken = 1NIIT
- 4 NII = 1 AssetToken
- Price with bonds  => 24 AssetToken = 1 NIIT (4% discount)

#
### Features
- Mint test AssetToken for free to deposit for bonds.
- Mint Niitokens with the Nii at a market price ratio of 100Nii to 1 Niitoken.
- Alternatively bond AssetToken minted above for 7 days to get the market value equivalence worth protocol tokens given at a 4% discount rate.
- The tokens gotten from the bond can then be staked for a longer period of time, with 7 days being the minimum waiting period before the staked tokens can begin to rack up rewards from the stake. The reward is calclated per second of stake, at at reward rate of 50% ROI per year.
- Alternatively, if you own the protocol tokens, and you want to make passive income with it, you can directly stake your tokens, using the same reward system explained above.
- All funds made by the dapp is sent directly to a vault contract, which should be controlled by a DOA in the long run, but currently is cunrrently manged by a single owner.

#
### Stack
- [Solidity](https://docs.soliditylang.org/en/v0.7.6/) - Object-oriented, high-level language for implementing smart contracts.
- [Tailwind](https://getbootstrap.com/) - CSS framework for faster and easier web development.
- [React.js](https://reactjs.org/) - JavaScript library for building user interfaces.
- [Ethers.js](https://web3js.readthedocs.io/en/v1.3.4/) - Allows users to interact with a local or remote ethereum node using HTTP, IPC or WebSocket.
- [Hardhat](https://hardhat.org/) - Development environment, testing framework and asset pipeline for blockchains using the Ethereum Virtual Machine (EVM).
#
### Interact with the deployed DApp
- NIIT protocol DApp requires [Metamask](https://metamask.io/) browser wallet extension to interact with.
- Connect metamask browser wallet to Nahmii 3 Testnet (NIIT).
- Request and get test NII for the metamask account from [Nahmii 3 matic Faucet](https://faucet.n3g0.nahmii.net/) to make transactions.
- Mint Protocol tokens directly using the Nahmii native coin NII from the protocol Token contract (NIIT)[0x1d7A2FB23cf3F889e203cfe276F3f7965BDB6Fdc](https://explorer.n3g0.nahmii.net/address/0x1d7A2FB23cf3F889e203cfe276F3f7965BDB6Fdc).
- Mint the AssetTokens from the AssetToken contract [0x0193B15c06d69cA546AE69b70155c945d3D601b7](https://explorer.n3g0.nahmii.net/address/0x0193B15c06d69cA546AE69b70155c945d3D601b7).
- Bond AssetTokens to mint protocol tokens using the BondDeopsitory contract - [0xA148D0c477EeC169Ee9f7F1Ac90B92C0AECF1821](https://explorer.n3g0.nahmii.net/address/0xA148D0c477EeC169Ee9f7F1Ac90B92C0AECF1821)
- Stake and withdraw protocol tokens or mature bonds using the staking contract - [0x3202c2Cef49DF7987B04aB2aF24E83F758253cdB](https://explorer.n3g0.nahmii.net/address/0x3202c2Cef49DF7987B04aB2aF24E83F758253cdB)
- Access NIIT protocol DApp at [NIIT-Protocol](https://dod-nft-marketplace.netlify.app/) and minting our NIIT protocol tokens!.
- Mint the AssetTokens from the AssetToken contract [0x4D737c9F72fC9AbA9140Cecb65cd5DD7F43eDA8a](https://mumbai.polygonscan.com/address/0x4D737c9F72fC9AbA9140Cecb65cd5DD7F43eDA8a).
- Bond AssetTokens to mint protocol tokens using the BondDeopsitory contract - [0x4D737c9F72fC9AbA9140Cecb65cd5DD7F43eDA8a](https://mumbai.polygonscan.com/address/0x4D737c9F72fC9AbA9140Cecb65cd5DD7F43eDA8a)
- Stake protocol tokens or mature bonds using the staking contract - [0x4D737c9F72fC9AbA9140Cecb65cd5DD7F43eDA8a](https://mumbai.polygonscan.com/address/0x4D737c9F72fC9AbA9140Cecb65cd5DD7F43eDA8a)

- Access NIIT protocol DApp at [NIIT-Protocol](https://niit-protocol.netlify.app/) and mint our NIIT protocol tokens!.

#
### Run the DApp Locally

### Open new terminal window and clone this repository
```
git clone https://github.com/jutivia/Nahmi-Hackfest
```
#### Install dependencies
```
npm install
```
#### Compile smart contract
```
npx hardhat compile
```
#### Deploy smart contract 
```
npx hardhat run scripts/deploy.ts --network nahmii
```
#### Test smart contract
```
npx hardhat test test/bondAndStake.ts.
```
#### Navigate to the frontend
```
cd frontend
```
#### Install dependencies
```
yarn
```
#### Start DApp
```
yarn start
```
- Open metamask browser wallet and connect network.
```
#### Hardhat help commands
npx hardhat help

```
