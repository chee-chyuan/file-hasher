// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/FileHasherCommitment.sol";

contract MyScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        FileHasherCommitment fileHasher = new FileHasherCommitment();

        vm.stopBroadcast();
    }
}
// source .env
// forge script script/FileHasherCommitmentDeploy.s.sol:MyScript --rpc-url $GOERLI_RPC_URL --broadcast --verify -vvvv
// 0xb72e344fbd30a710ce89e3699d19a2eab3eec4fe
